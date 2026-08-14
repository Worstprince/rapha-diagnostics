// lib/config/testResultTables.js
//
// Each test type in tbltests has its own results table with its own columns.
// Add an entry here whenever a new test type's results table is built.
//
// `isCritical` thresholds are based on the client-provided normal reference
// ranges (units confirmed to match what's actually stored in the DB) plus
// standard published critical/panic-value lists, converted into the same
// units as the client's ranges. These are a solid, medically grounded
// starting point — but real hospital labs typically have their critical
// value list reviewed and approved by a pathologist/lab director, since
// exact cutoffs can vary by institution and patient population. Treat this
// as a strong starting point, not a substitute for that review before any
// real clinical use.
//
// `isCritical` returns one of: false (not critical), "low" / "high" (for
// directional numeric thresholds), or true (for positive/negative-style
// results with no low/high concept). Returning the direction explicitly —
// instead of a bare boolean — matters: it lets the UI and the AI narrative
// builder state "critically high" or "critically low" as a fact computed
// by our own comparison, rather than asking the AI to infer direction from
// a bare number, which it can get wrong.
//
// Deliberately left WITHOUT a threshold: values that don't have a safe,
// context-independent cutoff (Creatinine, BUN, Uric Acid, Cholesterol,
// Bilirubin — these depend heavily on the patient's baseline/age to
// interpret safely; this system serves patients of all ages, including
// infants, and adult-oriented cutoffs can be actively wrong for neonates),
// and purely descriptive/qualitative fields with no numeric range.

function isPositiveResult(value) {
  const v = String(value).toLowerCase();
  if (v.includes("non-reactive") || v.includes("nonreactive") || v.includes("negative")) {
    return false;
  }
  return v.includes("positive") || v.includes("reactive");
}

// Test types with no critical-value concept at all — a visit made up
// entirely of these never needs a diagnostic narrative, so it's excluded
// from the notes queue rather than requiring a doctor to manually dismiss
// it. Anything with an isCritical flag (even a "simple" positive/negative
// test like HBsAg or VDRL) stays in the queue, since a flagged result on
// those genuinely deserves documentation.
export const NARRATIVE_OPTIONAL_TESTS = new Set(["bloodtype", "pregnancy"]);

export const TEST_RESULT_TABLES = {
  bloodtype: {
    table: "test_bloodtyperesult",
    fields: [
      { column: "bloodType", label: "Blood Type" },
      { column: "rhFactor", label: "RH Factor" },
    ],
  },
  chemistry: {
    table: "test_chemistryresult",
    fields: [
      {
        column: "glucose",
        label: "Glucose",
        // Normal: 4.38-6.05 mmol/L. Severe hypo/hyperglycemia (mmol/L).
        isCritical: (v) => {
          const n = Number(v);
          if (n < 2.8) return "low";
          if (n > 25.0) return "high";
          return false;
        },
      },
      { column: "creatinine", label: "Creatinine" },
      { column: "uricAcid", label: "Uric Acid" },
      { column: "totalCholesterol", label: "Total Cholesterol" },
      {
        column: "triglycerides",
        label: "Triglycerides",
        // >11.3 mmol/L (~1000 mg/dL) carries a recognized acute
        // pancreatitis risk — well above the sheet's "elevated" cutoff.
        isCritical: (v) => (Number(v) > 11.3 ? "high" : false),
      },
      { column: "hdlCholesterol", label: "HDL Cholesterol" },
      { column: "ldlCholesterol", label: "LDL Cholesterol" },
      {
        column: "sgot",
        label: "SGOT",
        // Normal up to ~66.5 U/L (M) / 41 U/L (F). Markedly elevated
        // transaminases suggest acute hepatic injury regardless of sex.
        isCritical: (v) => (Number(v) > 1000 ? "high" : false),
      },
      {
        column: "sgpt",
        label: "SGPT",
        isCritical: (v) => (Number(v) > 1000 ? "high" : false),
      },
      { column: "totalBilirubin", label: "Total Bilirubin" },
      { column: "directBilirubin", label: "Direct Bilirubin" },
      { column: "indirectBilirubin", label: "Indirect Bilirubin" },
      { column: "hba1c", label: "HbA1c" },
      { column: "bun", label: "BUN" },
    ],
  },
  dengue: {
    table: "test_dengueresult",
    fields: [
      { column: "igg", label: "IgG" },
      {
        column: "igm",
        label: "IgM",
        // Positive IgM suggests acute/recent infection — clinically urgent
        isCritical: isPositiveResult,
      },
      {
        column: "ns1",
        label: "NS1",
        isCritical: isPositiveResult,
      },
    ],
  },
  fobt: {
    table: "test_fobtresult",
    fields: [
      {
        column: "fobtResult",
        label: "FOBT Result",
        // Positive fecal occult blood warrants urgent GI follow-up
        isCritical: isPositiveResult,
      },
    ],
  },
  hbsag: {
    table: "test_hbsagresult",
    fields: [
      {
        column: "hbsagResult",
        label: "HBsAg Result",
        // Positive/reactive indicates active Hepatitis B infection
        isCritical: isPositiveResult,
      },
    ],
  },
  hematology: {
    table: "test_hematologyresult",
    fields: [
      {
        column: "hemoglobinMass",
        label: "Hemoglobin Mass",
        // Normal: M 140-170 g/L, F 120-150 g/L. Severe anemia/polycythemia,
        // set well outside both sex-specific ranges (g/L, not g/dL).
        isCritical: (v) => {
          const n = Number(v);
          if (n < 70) return "low";
          if (n > 200) return "high";
          return false;
        },
      },
      { column: "rbcNumConcentration", label: "RBC Number Concentration" },
      {
        column: "wbcNumConcentration",
        label: "WBC Number Concentration",
        // Normal: 5.5-10.0 x10^9/L. Severe leukopenia / possible
        // leukemoid reaction.
        isCritical: (v) => {
          const n = Number(v);
          if (n < 2) return "low";
          if (n > 30) return "high";
          return false;
        },
      },
      { column: "bleedingTime", label: "Bleeding Time" },
      { column: "clottingTime", label: "Clotting Time" },
      { column: "bloodGroup", label: "Blood Group" },
      {
        column: "plateletCount",
        label: "Platelet Count",
        // Normal: 150-450 x10^9/L. Significant bleeding risk.
        isCritical: (v) => (Number(v) < 20 ? "low" : false),
      },
      { column: "hematoCrit", label: "Hematocrit" },
      { column: "segmenters", label: "Segmenters" },
      { column: "band", label: "Band" },
      { column: "juvenile", label: "Juvenile" },
      { column: "lymphocytes", label: "Lymphocytes" },
      { column: "monocytes", label: "Monocytes" },
      { column: "eosinophils", label: "Eosinophils" },
      { column: "basophils", label: "Basophils" },
      { column: "mcv", label: "MCV" },
      { column: "mch", label: "MCH" },
      { column: "mchc", label: "MCHC" },
      { column: "bsmp", label: "BSMP" },
      { column: "rdwCv", label: "RDW-CV" },
    ],
  },
  ogtt: {
    table: "test_ogttresult",
    fields: [
      {
        column: "fbs",
        label: "Fasting Blood Sugar",
        // Same marker/units as chemistry glucose.
        isCritical: (v) => {
          const n = Number(v);
          if (n < 2.8) return "low";
          if (n > 25.0) return "high";
          return false;
        },
      },
      { column: "firstHour", label: "Glucose 1 Hour" },
      { column: "secondHour", label: "Glucose 2 Hour" },
    ],
  },
  pregnancy: {
    table: "test_pregnancytestresult",
    fields: [
      { column: "ptHCGSerum", label: "Pregnancy Result" },
    ],
  },
  semenalysis: {
    table: "test_semenanalysisresult",
    fields: [
      { column: "appearance", label: "Appearance" },
      { column: "volume", label: "Volume" },
      { column: "pH", label: "pH" },
      { column: "viscosity", label: "Viscosity" },
      { column: "others", label: "Others" },
      { column: "morphology", label: "Morphology" },
      { column: "motility", label: "Motility" },
      { column: "wbc", label: "WBC" },
      { column: "rbc", label: "RBC" },
      { column: "m30mins", label: " Motility 30 Minutes" },
      { column: "m1hr", label: "Motility 1 Hour" },
      { column: "m2hr", label: "Motility 2 Hours" },
      { column: "v30mins", label: "Viscosity 30 Minutes" },
      { column: "v1hr", label: "Viscosity 1 Hour" },
      { column: "v2hr", label: "Viscosity 2 Hours" },
      { column: "spermConcentration", label: "Sperm Concentration" },
      { column: "spermCount", label: "Sperm Count" },
    ],
  },
  stoolanalysis: {
    table: "test_stoolanalysisresult",
    fields: [
      { column: "color", label: "Color" },
      { column: "parasiticOva", label: "Parasitic Ova" },
      { column: "pussCells", label: "Puss Cells" },
      { column: "rbc", label: "RBC" },
      {
        column: "occultBlood",
        label: "Occult Blood",
        isCritical: isPositiveResult,
      },
      { column: "fecalysisNo", label: "Fecalalysis No. " },
      { column: "consistency", label: "Consistency" },
      { column: "bacteria", label: "Bacteria" },
      { column: "fatGlobules", label: "Fat Globules" },
      { column: "others", label: "Others" },
    ],
  },
  thyroid: {
    table: "test_thyroidresult",
    fields: [
      {
        column: "tsh",
        label: "TSH",
        // NOT from the client's sheet — thyroid wasn't included in the
        // data you shared, so this is still a general estimate
        // (assumes uIU/mL). Verify units/range before trusting this one.
        isCritical: (v) => {
          const n = Number(v);
          if (n < 0.01) return "low";
          if (n > 100) return "high";
          return false;
        },
      },
      { column: "ft4", label: "FT4" },
    ],
  },
  urinalysis: {
    table: "test_urinalysisresult",
    fields: [
      { column: "color", label: "Color" },
      { column: "transparency", label: "Transparency" },
      { column: "reaction", label: "Reaction" },
      { column: "sugar", label: "Sugar" },
      { column: "albumin", label: "Albumin" },
      { column: "specificgravity", label: "Specific Gravity" },
      { column: "pregnancytest", label: "Pregnancy Test" },
      { column: "others", label: "Others" },
      { column: "epithelialCells", label: "Epithelial Cells" },
      { column: "mucusthread", label: "Mucus Thread" },
      { column: "pus", label: "Pus" },
      { column: "rbc", label: "RBC" },
      { column: "cast", label: "Cast" },
      { column: "renalCells", label: "Renal Cells" },
      { column: "crystal", label: "Crystal" },
      { column: "bacteria", label: "Bacteria" },
    ],
  },
  vdrl: {
    table: "test_vdrlresult",
    fields: [
      {
        column: "vdrl",
        label: "VDRL Result",
        // Reactive VDRL indicates likely syphilis infection
        isCritical: isPositiveResult,
      },
    ],
  },
};

// Matches a test name from tbltests (e.g. "Blood Type", "bloodtype") to a
// config key above, case/space-insensitively.
export function normalizeTestName(name) {
  return name.toLowerCase().replace(/\s+/g, "");
}