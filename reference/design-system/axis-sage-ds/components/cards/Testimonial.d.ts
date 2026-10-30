import * as React from "react";
/** Ruled serif quotation with a small square portrait; TestimonialFeature is the large single-quote variant. */
export interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  company?: string;
  portrait?: string;
}
export declare function Testimonial(props: TestimonialProps): JSX.Element;
export declare function TestimonialFeature(props: TestimonialProps): JSX.Element;
