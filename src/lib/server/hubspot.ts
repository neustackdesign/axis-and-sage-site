import "server-only";
import { config, logFailure } from "./config";

type Stage = "new_lead" | "call_booked";

async function hs(path: string, body: unknown) {
  const res = await fetch(`https://api.hubapi.com${path}`, { method: "POST", headers: { Authorization: `Bearer ${config.hubspotToken}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(`HubSpot ${path} ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json() as Promise<Record<string, unknown>>;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Create or update the contact, then create a deal. Best effort: retried, never blocks the visitor's response. */
export async function syncToHubSpot(lead: { email: string; name?: string; company?: string; role?: string; sentence?: string; source: string }, stage: Stage): Promise<boolean> {
  if (!config.hubspotToken) return false;
  const [firstname, ...rest] = (lead.name || "").trim().split(/\s+/);
  const dealstage = stage === "call_booked" ? config.hubspotStageCallBooked || "appointmentscheduled" : config.hubspotStageNewLead || "appointmentscheduled";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const upsert = await hs("/crm/v3/objects/contacts/batch/upsert", { inputs: [{ id: lead.email.toLowerCase(), idProperty: "email", properties: { email: lead.email, firstname: firstname || undefined, lastname: rest.join(" ") || undefined, company: lead.company || undefined, jobtitle: lead.role || undefined } }] });
      const contactId = (upsert.results as { id: string }[] | undefined)?.[0]?.id;
      await hs("/crm/v3/objects/deals", {
        properties: { dealname: `${lead.company || lead.name || lead.email}: ${lead.sentence || lead.source}`.slice(0, 250), pipeline: config.hubspotPipeline, dealstage, description: lead.sentence || undefined },
        associations: contactId ? [{ to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 3 }] }] : [],
      });
      return true;
    } catch (error) {
      logFailure("hubspot", error, { attempt });
      if (attempt < 3) await wait(500 * 2 ** attempt);
    }
  }
  return false;
}
