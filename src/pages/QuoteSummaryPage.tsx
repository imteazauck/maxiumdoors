import { Navigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";
import ActionButton from "../components/ActionButton";
import { useNavigate } from "react-router-dom"; 
import { usePriceVisibility } from "../context/PriceVisibilityContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

async function imageToDataUrl(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load image: ${url}`);
  }

  const blob = await response.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error(`Unable to read image: ${url}`));
    reader.readAsDataURL(blob);
  });
}

async function buildQuotePdf({
  quoteRef,
  customerName,
  companyName,
  email,
  phone,
  address,
  subtotal,
  doors,
}: {
  quoteRef: string;
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  address: string;
  subtotal: number;
  doors: {
    doorRef: string;
    title: string;
    quantity: number;
    unitPrice: number;
    selections: Record<string, string>;
    technicalNotes?: string[];
  }[];
}) {
  const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 40;

  const [headerImage, footerImage] = await Promise.all([
    imageToDataUrl("/images/header-logo.jpg"),
    imageToDataUrl("/images/footer-logo.jpg"),
  ]);

  pdf.addImage(headerImage, "JPEG", marginX, 20, pageWidth - marginX * 2, 75);
  pdf.addImage(footerImage, "JPEG", marginX, pageHeight - 75, pageWidth - marginX * 2, 40);

  let currentY = 125;

  const ensureSpace = (neededHeight = 24) => {
    if (currentY + neededHeight <= pageHeight - 90) {
      return;
    }

    pdf.addPage();
    pdf.addImage(headerImage, "JPEG", marginX, 20, pageWidth - marginX * 2, 75);
    pdf.addImage(footerImage, "JPEG", marginX, pageHeight - 75, pageWidth - marginX * 2, 40);
    currentY = 125;
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("Quote Summary", marginX, currentY);
  currentY += 28;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);
  pdf.text(`Quote Ref: ${quoteRef}`, marginX, currentY);
  currentY += 18;
  pdf.text(`Customer: ${customerName}`, marginX, currentY);
  currentY += 18;

  if (companyName) {
    pdf.text(`Company: ${companyName}`, marginX, currentY);
    currentY += 18;
  }

  pdf.text(`Email: ${email}`, marginX, currentY);
  currentY += 18;
  pdf.text(`Phone: ${phone}`, marginX, currentY);
  currentY += 18;

  const addressLines = pdf.splitTextToSize(`Address: ${address}`, pageWidth - marginX * 2);
  pdf.text(addressLines, marginX, currentY);
  currentY += addressLines.length * 14 + 16;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(16);
  pdf.text("Door Summary", marginX, currentY);
  currentY += 24;

  doors.forEach((door, index) => {
    ensureSpace(80 + Object.keys(door.selections).length * 16 + (door.technicalNotes?.length ?? 0) * 16);

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(13);
    pdf.text(`${index + 1}. ${door.doorRef} - ${door.title}`, marginX, currentY);
    currentY += 18;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(
      `Quantity: ${door.quantity}    Total: ${formatMoney(door.unitPrice * door.quantity)}`,
      marginX + 10,
      currentY,
    );
    currentY += 16;

    Object.entries(door.selections).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").trim();
      const line = `${label}: ${value}`;
      const wrapped = pdf.splitTextToSize(line, pageWidth - (marginX + 10) * 2);
      pdf.setFontSize(10);
      pdf.text(wrapped, marginX + 10, currentY);
      currentY += wrapped.length * 14;
    });

    if (door.technicalNotes?.length) {
      door.technicalNotes.forEach((note) => {
        const wrapped = pdf.splitTextToSize(`Note: ${note}`, pageWidth - (marginX + 10) * 2);
        pdf.text(wrapped, marginX + 10, currentY);
        currentY += wrapped.length * 14;
      });
    }

    currentY += 12;
  });

  ensureSpace(40);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(15);
  pdf.text(`Subtotal: ${formatMoney(subtotal)}`, marginX, currentY);

  return pdf.output("blob");
}

export default function QuoteSummaryPage() {
  const { quoteRef, customerDetails, doors, removeDoor } = useQuote();
  const { items, subtotal, removeItem } = useCart();
  const navigate = useNavigate();
  const { showPrices } = usePriceVisibility();

  function removeItemFromCartAndQuote(doorRef: string) {
    const cartItem = items.find((item) => item.doorRef === doorRef);

    if (cartItem) {
      removeItem(cartItem.id);
    }

    removeDoor(doorRef);
  }

  async function handleDownloadPdf() {
    if (!customerDetails || doors.length === 0) return;

    try {
      const address = [
        customerDetails.addressLine1,
        customerDetails.addressLine2,
        customerDetails.city,
        customerDetails.postcode,
      ]
        .filter(Boolean)
        .join(", ");

      const pdfBlob = await buildQuotePdf({
        quoteRef,
        customerName: customerDetails.customerName,
        companyName: customerDetails.companyName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address,
        subtotal,
        doors: doors.map((door) => ({
          doorRef: door.doorRef,
          title: door.title,
          quantity: door.quantity,
          unitPrice: door.unitPrice,
          selections: door.selections,
          technicalNotes: door.technicalNotes,
        })),
      });

      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, "_blank", "noopener,noreferrer");

      const link = document.createElement("a");
      link.href = pdfUrl;
      link.download = `${quoteRef}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();

      setTimeout(() => URL.revokeObjectURL(pdfUrl), 5000);
    } catch (error) {
      console.error(error);
      window.alert("Unable to generate the quote PDF right now. Please try again.");
    }
  }

  if (!customerDetails) {
    return <Navigate to="/order-online" replace />;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#6B6B6B]">
            Quote summary
          </p>
          <p className="mt-2 text-m font-semibold text-[#111111]">{quoteRef}</p>
          <p className="mt-2 text-sm text-[#2A2A2A]">
            {customerDetails.customerName} · {customerDetails.addressLine1}, {customerDetails.city}
          </p>
        </div>


        <div className="flex flex-col items-end gap-3">
          <ActionButton autoFocus
           className=" focus:ring-2 focus:ring-[#F47A20]"
            onClick={() => navigate("/order-online/configure")}
          >
            Add another door
          </ActionButton>

          {doors.length > 0 && (
            <ActionButton onClick={handleDownloadPdf}>
              Download quote PDF
            </ActionButton>
          )}
        </div>

      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          {doors.length === 0 ? (
            <div className="rounded-[2rem] border border-[#D7D7D7] bg-white p-8 shadow-sm">
              <p className="text-lg font-semibold text-[#111111]">No doors added yet</p>
              <p className="mt-2 text-sm text-[#2A2A2A]">
                Build your first door configuration to start the quote.
              </p>
            </div>
          ) : (
            doors.map((door) => (
              <article
                key={door.doorRef}
                className="rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">
                      Door reference
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-[#111111]">{door.doorRef}</h2>
                    <p className="mt-1 text-sm text-[#2A2A2A]">{door.title}</p>
                  </div>
                  <div className="text-right">
                    {showPrices && (
                      <p className="text-sm font-semibold text-[#F47A20]">
                        {formatMoney(door.unitPrice * door.quantity)}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => removeItemFromCartAndQuote(door.doorRef)}
                      className="mt-3 py-1 px-3 text-sm font-medium text-[#6B6B6B] transition hover:text-[#F47A20]"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <ul className="mt-4 divide-y divide-[#E7DED5]">
                  {Object.entries(door.selections).map(([key, value]) => (
                    <li key={key} className="flex items-center justify-between py-3">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8A908C]">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="text-sm font-medium text-[#111111]">{value}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))
          )}
        </div>

        <aside className="h-fit rounded-[2rem] border border-[#D7D7D7] bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6B6B6B]">
            Basket summary
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111111]">Current quote</h2>
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[1rem] border border-[#D7D7D7] bg-[#FFF9F4] px-4 py-3"
              >
                <p className="font-medium text-[#111111]">{item.name}</p>
                {item.doorRef && (
                  <p className="mt-1 text-sm text-[#2A2A2A]">Door Ref: {item.doorRef}</p>
                )}
                {showPrices && (
                  <p className="mt-2 text-sm text-[#2A2A2A]">
                    {formatMoney(item.unitPrice * item.quantity)}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#D7D7D7] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#111111]">{showPrices ? "Subtotal" : ""}</span>
              <span className="text-xl font-semibold text-[#F47A20]">{showPrices ? formatMoney(subtotal) : ""}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
