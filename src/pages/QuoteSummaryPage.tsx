import { Link, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useQuote } from "../context/QuoteContext";

function formatMoney(value: number) {
  return `£${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function toPdfLine(text: string, x: number, y: number, fontSize = 12) {
  return `BT /F1 ${fontSize} Tf ${x} ${y} Td (${escapePdfText(text)}) Tj ET`;
}

function getJpegDimensions(bytes: Uint8Array) {
  let offset = 2;

  while (offset < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    const length = (bytes[offset + 2] << 8) + bytes[offset + 3];

    const isStartOfFrame =
      marker >= 0xc0 &&
      marker <= 0xcf &&
      marker !== 0xc4 &&
      marker !== 0xc8 &&
      marker !== 0xcc;

    if (isStartOfFrame) {
      const height = (bytes[offset + 5] << 8) + bytes[offset + 6];
      const width = (bytes[offset + 7] << 8) + bytes[offset + 8];
      return { width, height };
    }

    offset += 2 + length;
  }

  throw new Error("Unable to read JPEG dimensions.");
}

async function loadJpeg(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Unable to load image: ${url}`);
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  const { width, height } = getJpegDimensions(bytes);

  return {
    width,
    height,
    binary,
    length: bytes.length,
  };
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
  const [headerImage, footerImage] = await Promise.all([
    loadJpeg("/images/pdf-header.jpg"),
    loadJpeg("/images/pdf-footer.jpg"),
  ]);

  const pageWidth = 595;
  const pageHeight = 842;
  const marginX = 40;
  const usableWidth = pageWidth - marginX * 2;

  const headerDisplayWidth = usableWidth;
  const headerDisplayHeight = (headerImage.height / headerImage.width) * headerDisplayWidth;
  const footerDisplayWidth = usableWidth;
  const footerDisplayHeight = (footerImage.height / footerImage.width) * footerDisplayWidth;

  let currentY = pageHeight - 34 - headerDisplayHeight - 28;
  const lines: string[] = [];

  lines.push(toPdfLine("Quote Summary", marginX, currentY, 22));
  currentY -= 28;
  lines.push(toPdfLine(`Quote Ref: ${quoteRef}`, marginX, currentY, 12));
  currentY -= 18;
  lines.push(toPdfLine(`Customer: ${customerName}`, marginX, currentY, 12));
  currentY -= 18;

  if (companyName) {
    lines.push(toPdfLine(`Company: ${companyName}`, marginX, currentY, 12));
    currentY -= 18;
  }

  lines.push(toPdfLine(`Email: ${email}`, marginX, currentY, 12));
  currentY -= 18;
  lines.push(toPdfLine(`Phone: ${phone}`, marginX, currentY, 12));
  currentY -= 18;
  lines.push(toPdfLine(`Address: ${address}`, marginX, currentY, 12));
  currentY -= 30;
  lines.push(toPdfLine("Door Summary", marginX, currentY, 16));
  currentY -= 20;

  doors.forEach((door, index) => {
    lines.push(toPdfLine(`${index + 1}. ${door.doorRef} - ${door.title}`, marginX, currentY, 13));
    currentY -= 18;
    lines.push(
      toPdfLine(
        `Quantity: ${door.quantity}    Total: ${formatMoney(door.unitPrice * door.quantity)}`,
        marginX + 10,
        currentY,
        11,
      ),
    );
    currentY -= 16;

    Object.entries(door.selections).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, " $1").trim();
      lines.push(toPdfLine(`${label}: ${value}`, marginX + 10, currentY, 10));
      currentY -= 14;
    });

    if (door.technicalNotes?.length) {
      door.technicalNotes.forEach((note) => {
        lines.push(toPdfLine(`Note: ${note}`, marginX + 10, currentY, 10));
        currentY -= 14;
      });
    }

    currentY -= 10;
  });

  lines.push(toPdfLine(`Subtotal: ${formatMoney(subtotal)}`, marginX, Math.max(currentY - 6, 120), 15));

  const headerX = marginX;
  const headerY = pageHeight - 34 - headerDisplayHeight;
  const footerX = marginX;
  const footerY = 34;

  const contentStream = [
    `q ${headerDisplayWidth} 0 0 ${headerDisplayHeight} ${headerX} ${headerY} cm /Im1 Do Q`,
    ...lines,
    `q ${footerDisplayWidth} 0 0 ${footerDisplayHeight} ${footerX} ${footerY} cm /Im2 Do Q`,
  ].join("\n");

  const objects: string[] = [];
  objects[1] = `<< /Type /Catalog /Pages 2 0 R >>`;
  objects[2] = `<< /Type /Pages /Kids [3 0 R] /Count 1 >>`;
  objects[3] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 6 0 R >> /XObject << /Im1 4 0 R /Im2 5 0 R >> >> /Contents 7 0 R >>`;
  objects[4] = `<< /Type /XObject /Subtype /Image /Width ${headerImage.width} /Height ${headerImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${headerImage.length} >>\nstream\n${headerImage.binary}\nendstream`;
  objects[5] = `<< /Type /XObject /Subtype /Image /Width ${footerImage.width} /Height ${footerImage.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${footerImage.length} >>\nstream\n${footerImage.binary}\nendstream`;
  objects[6] = `<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`;
  objects[7] = `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`;

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [0];

  for (let i = 1; i <= 7; i += 1) {
    offsets[i] = pdf.length;
    pdf += `${i} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;

  pdf += `xref\n0 8\n0000000000 65535 f \n${offsets
    .slice(1)
    .map((offset) => `${String(offset).padStart(10, "0")} 00000 n `)
    .join("\n")}\ntrailer\n<< /Size 8 /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: "application/pdf" });
}

export default function QuoteSummaryPage() {
  const { quoteRef, customerDetails, doors, removeDoor } = useQuote();
  const { items, subtotal, removeItem } = useCart();

  function removeItemFromCartAndQuote(doorRef: string) {
    const cartItem = items.find((item) => item.doorRef === doorRef);

    if (cartItem) {
      removeItem(cartItem.id);
    }

    removeDoor(doorRef);
  }

  async function handleDownloadPdf() {
    if (!customerDetails || doors.length === 0) return;

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
          <Link
            to="/order-online/configure"
            className="rounded-full border border-[#D7D7D7] px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#FFF6EE]"
          >
            Add another door
          </Link>

          {doors.length > 0 && (
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="rounded-full border border-[#F47A20] bg-[#F47A20] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d96614]"
            >
              Download quote PDF
            </button>
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
                    <p className="text-sm font-semibold text-[#F47A20]">
                      {formatMoney(door.unitPrice * door.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItemFromCartAndQuote(door.doorRef)}
                      className="mt-3 text-sm font-medium text-[#6B6B6B] transition hover:text-[#F47A20]"
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
                <p className="mt-2 text-sm text-[#2A2A2A]">
                  {formatMoney(item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t border-[#D7D7D7] pt-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#111111]">Subtotal</span>
              <span className="text-xl font-semibold text-[#F47A20]">{formatMoney(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
