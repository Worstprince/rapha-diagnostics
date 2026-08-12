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
