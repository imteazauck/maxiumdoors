import type { OrderConfirmationEmailPayload } from "./mapOrderConfirmationEmailPayload";

export function buildOrderConfirmationEmail(
  payload: OrderConfirmationEmailPayload
): string {
  const itemsText = payload.items
    .map(
      (item) =>
        `- ${item.title} (${item.doorRef}) x${item.quantity} - £${item.lineTotal.toFixed(2)}`
    )
    .join("\n");

  const addressText = payload.deliveryAddress.join(", ");

  return `Dear ${payload.customerName},

Thank you for your order.

Order number: ${payload.orderNumber}
Quote reference: ${payload.quoteRef}
Status: ${payload.status}
Created at: ${new Date(payload.createdAt).toLocaleString()}

Items:
${itemsText}

Subtotal: £${payload.subtotal.toFixed(2)}

Delivery address:
${addressText}

We will contact you again with any further updates.

Kind regards,
Maxium Doors`;
}