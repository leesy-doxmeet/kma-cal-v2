import Papa from "papaparse"
import type { MedicalEvent } from "./types"

type RawRow = Record<string, string>

/**
 * Loads /data/events.csv from the public folder and converts it into MedicalEvent[].
 * Expected columns (snake_case):
 * event_id,start_date,title,organizer,contact_name,contact_email,education_type,expected_attendees,
 * region,fee,fee_detail,notes,location,branch_or_department,contact_phone,credits,education_hours,
 * is_online,credits_normal,credits_ness,credits_all
 */
export async function loadEventsFromCsv(url = "/data/events.csv"): Promise<MedicalEvent[]> {
  const res = await fetch(url, { cache: "no-store" })
  if (!res.ok) throw new Error(`Failed to fetch events CSV: ${res.status}`)
  const csv = await res.text()

  const parsed = Papa.parse<RawRow>(csv, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
  })

  if (parsed.errors?.length) {
    // Keep first error as a hint; do not hard-fail unless no rows.
    console.warn("CSV parse warnings:", parsed.errors.slice(0, 3))
  }

  const rows = (parsed.data ?? []).filter((r) => r && Object.keys(r).length)

  const toBool = (v: unknown) => {
    const s = String(v ?? "").trim().toLowerCase()
    return ["true", "1", "y", "yes", "t"].includes(s)
  }

  const toNum = (v: unknown) => {
    const s = String(v ?? "").replace(/,/g, "").trim()
    const n = Number(s)
    return Number.isFinite(n) ? n : 0
  }

  const clean = (v: unknown) => String(v ?? "").trim()

  return rows.map((r) => {
    const startDate = clean(r.start_date)
    const endDate = startDate // source has 1-day events; extend later if needed

    const generalCredits = toNum(r.credits_normal)
    const requiredCredits = toNum(r.credits_ness)
    const totalCredits = toNum(r.credits_all) || (generalCredits + requiredCredits)

    return {
      id: clean(r.event_id),
      title: clean(r.title),
      specialty: clean(r.education_type),
      region: clean(r.region),
      isOnline: toBool(r.is_online),
      startDate,
      endDate,
      generalCredits,
      requiredCredits,
      totalCredits,
      organizer: clean(r.organizer),
      location: clean(r.location),
      contact: clean(r.contact_phone),
      notes: clean(r.notes),
      contactName: clean(r.contact_name),
      contactEmail: clean(r.contact_email),
      expectedAttendees: clean(r.expected_attendees),
      fee: clean(r.fee),
      feeDetail: clean(r.fee_detail),
      branchOrDepartment: clean(r.branch_or_department),
      creditsRaw: clean(r.credits),
      educationHours: clean(r.education_hours),
    } satisfies MedicalEvent
  })
}
