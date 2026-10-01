"use client";

import { ToolEmail } from "@/components/tools/ToolEmail";
import type { Template } from "@/lib/content/types";

/** Templates: leave a work email, we send a copy and the file downloads. Only templates with a file are listed. */
export function TemplateRequest({ templates }: { templates: Template[] }) {
  return (
    <ul className="spec-list">
      {templates.map((t, i) => (
        <li key={t.title}>
          <span className="t-label">{String(i + 1).padStart(2, "0")}</span>
          <div className="stack-8">
            <p style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><span>{t.title}</span><span className="chip">{t.format}</span></p>
            <ToolEmail tool={`Template: ${t.title}`} label="Email me and download" summary={() => `${t.title} (${t.format})`}
              download={{ filename: t.file!.split("/").pop()!, build: async () => (await fetch(t.file!)).blob() }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
