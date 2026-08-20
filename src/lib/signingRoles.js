/* Who actually signs a lab report.

   The report has exactly two signature slots -- Pathologist and Medical
   Technologist -- and the doctor dashboard is shared by Physician and
   Pathologist. Reception and Administrator never appear on a result, so
   offering them a signature would collect something that could never be
   printed, and would put a legally meaningful mark on file for no reason.

   Stored role strings, matching tblusers.role exactly. */
export const SIGNING_ROLES = [
    "Physician",
    "Pathologist",
    "Medical Technologist",
];

export function canSign(role) {
    return SIGNING_ROLES.includes(String(role ?? "").trim());
}
