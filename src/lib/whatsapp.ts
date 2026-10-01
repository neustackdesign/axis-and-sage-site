// WhatsApp is operational configuration, not editorial copy: the number stays in the environment. The pre-filled
// message is editable in Sanity (Site settings).
export const whatsappNumber = () => process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";

/** WhatsApp deep link with the message pre-filled. Null while the number is unset: every WhatsApp link then hides. */
export function whatsappHref(message: string) {
  const digits = whatsappNumber().replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : null;
}

export const whatsappLink = (message: string) => {
  const href = whatsappHref(message);
  return href ? { href, number: whatsappNumber() } : null;
};
