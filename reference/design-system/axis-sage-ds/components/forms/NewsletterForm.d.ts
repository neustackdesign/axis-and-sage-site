import * as React from "react";
/** Single-row email + orange Subscribe form for "Terms & Moments"; shows the confirm message after submit. */
export interface NewsletterFormProps {
  dark?: boolean;
  onSubmit?: () => void;
}
export declare function NewsletterForm(props: NewsletterFormProps): JSX.Element;
