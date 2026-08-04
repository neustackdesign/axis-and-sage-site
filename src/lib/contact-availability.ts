type ContactDeliveryEnvironment = Record<string, string | undefined>;

export function isContactFormConfigured(environment: ContactDeliveryEnvironment = process.env) {
  return Boolean(
    environment.RESEND_API_KEY &&
    environment.CONTACT_FROM_EMAIL &&
    environment.CONTACT_TO_EMAIL,
  );
}
