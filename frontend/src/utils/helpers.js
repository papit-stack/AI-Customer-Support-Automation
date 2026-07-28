export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const INTENT_LABELS = {
  order_status: "Order Status",
  refund_request: "Refund Request",
  product_inquiry: "Product Inquiry",
  product_recommendation: "Product Recommendation",
  complaint: "Complaint",
  faq: "FAQ",
};

export const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Sent: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Edited: "bg-purple-100 text-purple-800",
};
