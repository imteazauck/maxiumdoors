import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8080;
const root = path.join(__dirname, "dist");
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

app.use(express.json());
app.use(express.static(root));

function maskCardNumber(cardNumber = "") {
  const digits = String(cardNumber).replace(/\D/g, "");
  return digits.slice(-4).padStart(Math.min(16, digits.length), "*");
}

async function ensureOrdersFile() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(ordersFile);
  } catch {
    await fs.writeFile(ordersFile, "[]", "utf8");
  }
}

app.post("/api/orders", async (req, res) => {
  const { quoteRef, customerDetails, doors, subtotal, payment } = req.body ?? {};

  if (!quoteRef || !customerDetails || !Array.isArray(doors) || doors.length === 0 || !payment?.cardholderName) {
    res.status(400).send("Missing order information.");
    return;
  }

  const cardDigits = String(payment.cardNumber ?? "").replace(/\D/g, "");
  if (cardDigits.length < 12 || cardDigits.length > 19) {
    res.status(400).send("Card number is invalid.");
    return;
  }

  const createdAt = new Date().toISOString();
  const orderId = `ORD-${Date.now()}`;
  const paymentLast4 = cardDigits.slice(-4);

  const orderRecord = {
    orderId,
    quoteRef,
    createdAt,
    customerDetails,
    doors,
    subtotal,
    payment: {
      cardholderName: payment.cardholderName,
      expiry: payment.expiry,
      maskedCardNumber: maskCardNumber(cardDigits),
      paymentLast4,
    },
  };

  try {
    await ensureOrdersFile();
    const raw = await fs.readFile(ordersFile, "utf8");
    const orders = JSON.parse(raw);
    orders.push(orderRecord);
    await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2), "utf8");

    res.json({
      orderId,
      quoteRef,
      createdAt,
      customerName: customerDetails.customerName,
      email: customerDetails.email,
      subtotal,
      doorCount: doors.reduce((sum, door) => sum + Number(door.quantity || 0), 0),
      paymentLast4,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Unable to save the order.");
  }
});

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(root, "index.html"));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
