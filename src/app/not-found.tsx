import Link from "next/link";

export default function NotFound() {
  return <section className="not-found container"><p className="eyebrow">404 / Not found</p><h1>This page moved on to the next idea.</h1><Link className="button button-dark" href="/">Back to Axis &amp; Sage <span aria-hidden="true">↗</span></Link></section>;
}
