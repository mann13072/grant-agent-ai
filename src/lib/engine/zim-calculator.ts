import type { PersonnelEntry, FinancialSummary } from "@/types";

export const CONSTRAINTS = {
  MAX_SALARY_PER_PERSON_PER_YEAR: 120_000,
  MAX_OVERHEAD_RATIO: 1.0,
  MAX_SUBCONTRACT_RATIO: 0.25,
  MAX_ZIM_INDIVIDUAL: 550_000,
  MAX_ZIM_COOP_PER_COMPANY: 450_000,
  COOP_PARTNER_RATIO_MIN: 0.3,
  COOP_PARTNER_RATIO_MAX: 0.7,
  FORSCHUNGSZULAGE_RATE: 0.25,
  CONSULTANT_FEE_RATE: 0.12,
} as const;

interface ZIMInput {
  companySize: "micro" | "small" | "medium";
  isEastGermany: boolean;
  grantType: "individual" | "cooperation";
  personnel: PersonnelEntry[];
  materialCostsPercent: number;
  subcontractingCosts: number;
  partnerPersonMonths?: number;
  totalPersonMonths?: number;
}

export function calculateZIM(input: ZIMInput): FinancialSummary {
  // Step 1: Cap salaries at €120K/year
  const cappedPersonnel = input.personnel.map((p) => ({
    ...p,
    cappedSalary: Math.min(p.annualGrossSalary, CONSTRAINTS.MAX_SALARY_PER_PERSON_PER_YEAR),
    eligibleCost:
      Math.min(p.annualGrossSalary, CONSTRAINTS.MAX_SALARY_PER_PERSON_PER_YEAR) *
      (p.allocationPercent / 100) *
      (p.monthsOnProject / 12),
  }));

  // Step 2: Aggregate personnel baseline
  const totalPersonnel = cappedPersonnel.reduce((sum, p) => sum + p.eligibleCost, 0);

  // Step 3: Overhead (max 100% of personnel)
  const overheadPercent = Math.min(input.materialCostsPercent, 100);
  const overhead = totalPersonnel * (overheadPercent / 100);

  // Step 4: Subcontracting (max 25% of personnel)
  const maxSubcontracting = totalPersonnel * CONSTRAINTS.MAX_SUBCONTRACT_RATIO;
  const subcontracting = Math.min(input.subcontractingCosts, maxSubcontracting);
  const subcontractingViolation = input.subcontractingCosts > maxSubcontracting;

  // Step 5: Total eligible costs
  const totalEligible = totalPersonnel + overhead + subcontracting;

  // Step 6: Apply caps
  const maxCap =
    input.grantType === "individual"
      ? CONSTRAINTS.MAX_ZIM_INDIVIDUAL
      : CONSTRAINTS.MAX_ZIM_COOP_PER_COMPANY;
  const cappedTotal = Math.min(totalEligible, maxCap);

  // Step 7: Funding rate
  let baseRate: number;
  if (input.grantType === "individual") {
    baseRate =
      input.companySize === "micro" || input.companySize === "small" ? 0.45 : 0.35;
  } else {
    baseRate =
      input.companySize === "micro" || input.companySize === "small" ? 0.55 : 0.45;
  }
  if (input.isEastGermany) {
    baseRate = Math.min(baseRate + 0.1, 0.55);
  }

  // Step 8: Grant amount
  const grantAmount = Math.round(cappedTotal * baseRate);
  const ownContribution = cappedTotal - grantAmount;

  // Step 9: Forschungszulage bonus (25% tax credit on own contribution)
  const forschungszulage = Math.round(ownContribution * CONSTRAINTS.FORSCHUNGSZULAGE_RATE);

  // Step 10: Cooperation validation
  let cooperationViolation: string | null = null;
  if (input.grantType === "cooperation" && input.partnerPersonMonths) {
    const ratio = input.partnerPersonMonths / (input.totalPersonMonths || 1);
    if (ratio < CONSTRAINTS.COOP_PARTNER_RATIO_MIN || ratio > CONSTRAINTS.COOP_PARTNER_RATIO_MAX) {
      cooperationViolation = `Partner ratio ${(ratio * 100).toFixed(1)}% (must be 30–70%)`;
    }
  }

  const salaryWarnings = cappedPersonnel
    .filter((p) => p.annualGrossSalary > CONSTRAINTS.MAX_SALARY_PER_PERSON_PER_YEAR)
    .map((p) => `${p.name}: salary capped at €120K`);

  return {
    totalPersonnel: Math.round(totalPersonnel),
    overhead: Math.round(overhead),
    subcontracting: Math.round(subcontracting),
    totalEligible: Math.round(totalEligible),
    cappedTotal: Math.round(cappedTotal),
    baseRate,
    grantAmount,
    ownContribution,
    forschungszulage,
    totalNonDilutive: grantAmount + forschungszulage,
    consultantSavings: Math.round(grantAmount * CONSTRAINTS.CONSULTANT_FEE_RATE),
    violations: {
      subcontracting: subcontractingViolation,
      cooperation: cooperationViolation,
      overCap: totalEligible > maxCap,
      salaryWarnings,
    },
  };
}

export function getConstraintStatus(
  value: number,
  max: number,
  warnThreshold = 0.85
): "ok" | "warning" | "error" {
  const ratio = value / max;
  if (ratio > 1) return "error";
  if (ratio > warnThreshold) return "warning";
  return "ok";
}
