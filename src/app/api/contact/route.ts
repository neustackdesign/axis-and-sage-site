import { NextResponse } from "next/server";
import { isContactFormConfigured } from "@/lib/contact-availability";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const organisation = String(form.get("organisation") || "").trim();
  const timeline = String(form.get("timeline") || "").trim();
  const needs = form.getAll("needs").map(String).filter(Boolean);
  const message = String(form.get("message") || "").trim();
  const company = String(form.get("company") || "").trim();
  if (company) return NextResponse.json({ message: "Thanks — your message has been received." });
  if (name.length < 2 || !emailPattern.test(email) || !needs.length || message.length < 10) return NextResponse.json({ message: "Please add your name, a valid work email, at least one need and a little more detail so we can respond." }, { status: 400 });
  if (!isContactFormConfigured()) return NextResponse.json({ message: "The contact channel is not configured yet. Please email the team directly once a verified address is published." }, { status: 503 });
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: process.env.CONTACT_FROM_EMAIL, to: [process.env.CONTACT_TO_EMAIL], reply_to: email, subject: `Axis & Sage enquiry from ${name}`, text: [`Name: ${name}`, `Email: ${email}`, organisation ? `Organisation: ${organisation}` : "", `Needs: ${needs.join(", ")}`, timeline ? `Timeline: ${timeline}` : "", "", message].filter(Boolean).join("\n") }) });
  if (!response.ok) return NextResponse.json({ message: "We couldn’t send your message just now. Please try again shortly." }, { status: 502 });
  return NextResponse.json({ message: "Thanks — your message has been sent. We’ll be in touch soon." });
}
