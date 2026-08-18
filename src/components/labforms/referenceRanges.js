export const REFERENCE_RANGES = {
  hematology: {
    hemoglobin: { M: { min: 140, max: 170 }, F: { min: 120, max: 150 } },
    rbc: { min: 4.5, max: 5.5 },
    wbc: { min: 5.5, max: 10.0 },
    bleedingTime: { min: 1, max: 3 },
    clottingTime: { min: 2, max: 6 },
    platelet: { min: 150, max: 450 },
    hematocrit: { M: { min: 0.4, max: 0.54 }, F: { min: 0.36, max: 0.48 } },

    segmenters: { min: 0.55, max: 0.65 },
    band: { min: 0.02, max: 0.04 },
    juvenile: { min: 0.0, max: 0.02 },
    lymphocytes: { min: 0.25, max: 0.35 },
    monocytes: { min: 0.02, max: 0.06 },
    eosinophils: { min: 0.02, max: 0.04 },
    basophils: { min: 0.0, max: 0.01 },

    mcv: { min: 80, max: 100 },
    mch: { min: 27, max: 31 },
    mchc: { min: 32, max: 36 },
    rdw: { min: 11, max: 15 },
  },

  hba1c: {
    glucose: { min: 4.38, max: 6.05 },
    rbs: { min: 4.38, max: 6.05 },
    creatinine: { M: { min: 70, max: 120 }, F: { min: 53, max: 106 } },
    uricAcid: { M: { min: 200, max: 420 }, F: { min: 140, max: 340 } },

    totalCholesterol: { max: 5.7 },
    triglycerides: { max: 1.71 },
    ldlCholesterol: { max: 3.8 },

    hdlCholesterol: { M: { min: 1.43 }, F: { min: 1.69 } },

    sgot: { M: { max: 66.5 }, F: { max: 41 } },
    sgpt: { M: { max: 55.1 }, F: { max: 34 } },
    totalBilirubin: { max: 16.6 },
    directBilirubin: { max: 4.3 },
    indirectBilirubin: { min: 0.2, max: 0.8 },
    hba1c: { max: 6.5 },
    bun: { min: 10, max: 40 },
  },

  thyroid: {
    tsh: { min: 0.27, max: 4.2 },
    ft4: { min: 12.0, max: 22.0 },
    t3: { min: 1.30, max: 3.10 },
    t4: { min: 59.0, max: 154.0 },
  },

  ogtt: {
    fbs: { min: 3.89, max: 5.83 },
    firstHour: { max: 11.1 },
    secondHour: { max: 7.8 },
  },

  semenalysis: {
    volume: { min: 2, max: 5 },
    ph: { min: 7.2, max: 8.0 },
    viscosity: { min: 1, max: 4 },

    spermConcentration: { min: 20 },
    spermCount: { min: 40 },
  },

  rbs: {
    siUnit: { min: 3.4, max: 6.7 },
    conventionalUnit: { min: 60.0, max: 120.0 }
  }
};

function normalizeSex(sex) {
  const first = String(sex ?? "").trim().charAt(0).toUpperCase();
  return first === "M" || first === "F" ? first : null;
}

export function resolveRange(range, sex) {
  if (!range) return null;
  if (!range.M && !range.F) return range;

  const key = normalizeSex(sex);
  if (key && range[key]) return range[key];

  const variants = [range.M, range.F].filter(Boolean);
  if (variants.length === 0) return null;

  const mins = variants.map((v) => v.min).filter((v) => v != null);
  const maxes = variants.map((v) => v.max).filter((v) => v != null);

  return {
    min: mins.length === variants.length ? Math.min(...mins) : undefined,
    max: maxes.length === variants.length ? Math.max(...maxes) : undefined,
  };
}

export function evaluateResult(value, range, sex) {
  const resolved = resolveRange(range, sex);
  if (!resolved) return null;

  const text = String(value ?? "").trim();
  if (!text) return null;

  const numeric = Number(text);
  if (!Number.isFinite(numeric)) return null;

  if (resolved.max != null && numeric > resolved.max) return "high";
  if (resolved.min != null && numeric < resolved.min) return "low";

  return null;
}
