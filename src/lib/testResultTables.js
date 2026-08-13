// lib/config/testResultTables.js
//
// Each test type in tbltests has its own results table with its own columns.
// Add an entry here whenever a new test type's results table is built.
//
// `isCritical` is optional — there's no critical-value tracking in the DB yet,
// so this is a manual placeholder. Leave it off until you define real
// reference ranges per test.

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
      {column: "glucose", label: "Glucose"},
      {column: "creatinine", label: "Creatinine"},
      {column: "uricAcid", label: "Uric Acid"},
      {column: "totalCholesterol", label: "Total Cholesterol"},
      {column: "triglycerides", label: "Triglycerides"},
      {column: "hdlCholesterol", label: "HDL Cholesterol"},
      {column: "ldlCholesterol", label: "LDL Cholesterol"},
      {column: "sgot", label: "SGOT"},
      {column: "sgpt", label: "SGPT"},
      {column: "totalBilirubin", label: "Total Bilirubin"},
      {column: "directBilirubin", label: "Direct Bilirubin"},
      {column: "indirectBilirubin", label: "Indirect Bilirubin"},
      {column: "hba1c", label: "HbA1c"},
      {column: "bun", label: "BUN"},
    ]  
  },
  dengue: {
    table: "test_dengueresult",
    fields: [
      { column: "igg", label: "IgG" },
      { column: "igm", label: "IgM" },
      { column: "ns1", label: "NS1" },
    ],
  },
  fobt: {
    table: "test_fobtresult",
    fields: [
      { column: "fobtResult", label: "FOBT Result" },
    ],
  },
  hbsag: {
    table: "test_hbsagresult",
    fields: [
      { column: "hbsagResult", label: "HBsAg Result" },
    ],
  },
  hematology: {
    table: "test_hematologyresult",
    fields: [
      { column: "hemoglobinMass", label: "Hemoglobin Mass" },
      { column: "rbcNumConcentration", label: "RBC Number Concentration" },
      { column: "wbcNumConcentration", label: "WBC Number Concentration" },
      { column: "bleedingTime", label: "Bleeding Time" },
      { column: "clottingTime", label: "Clotting Time" },
      { column: "bloodGroup", label: "Blood Group" },
      { column: "plateletCount", label: "Platelet Count" },
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
      { column: "fbs", label: "Fasting Blood Sugar" },
      { column: "firstHour", label: "Glucose 1 Hour" },
      { column: "secondHour", label: "Glucose 2 Hour" },
    ],
  },
  pregnancy: {
    table: "test_pregnancyresult",
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
      { column: "occultBlood", label: "Occult Blood" },
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
      { column: "tsh", label: "TSH" },
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
      { column: "vdrl", label: "VDRL Result" },
    ],
  },
  

// Example for when the chemistry results table exists:
  // chemistry: {
  //   table: "test_chemistryresult",
  //   fields: [
  //     {
  //       column: "wbc",
  //       label: "WBC",
  //       isCritical: (value) => Number(value) > 11,
  //     },
  //     { column: "glucose", label: "Glucose" },
  //   ],
  // },
};

// Matches a test name from tbltests (e.g. "Blood Type", "bloodtype") to a
// config key above, case/space-insensitively.
export function normalizeTestName(name) {
  return name.toLowerCase().replace(/\s+/g, "");
}
