export type UserRole = "FOUNDER" | "TTO_ADMIN" | "ADMIN";
export type Plan = "FREE" | "PRO" | "ENTERPRISE";
export type GrantType =
  | "ZIM_INDIVIDUAL"
  | "ZIM_COOPERATION"
  | "EXIST_STARTUP"
  | "EXIST_TRANSFER";
export type AppStatus =
  | "DRAFT"
  | "GENERATING"
  | "REVIEW"
  | "FINALIZED"
  | "SUBMITTED";
export type DocType =
  | "NARRATIVE_PDF"
  | "FINANCIAL_PDF"
  | "FULL_APPLICATION_DOCX"
  | "EASY_ONLINE_XML";

export interface PersonnelEntry {
  name: string;
  role:
    | "Project Lead"
    | "Senior Engineer"
    | "Junior Engineer"
    | "Researcher"
    | "Admin"
    | "Lab Technician";
  annualGrossSalary: number;
  allocationPercent: number;
  monthsOnProject: number;
}

export interface MaterialEntry {
  description: string;
  amount: number;
}

export interface SubcontractEntry {
  vendor: string;
  service: string;
  amount: number;
}

export interface FinancialSummary {
  totalPersonnel: number;
  overhead: number;
  subcontracting: number;
  totalEligible: number;
  cappedTotal: number;
  baseRate: number;
  grantAmount: number;
  ownContribution: number;
  forschungszulage: number;
  totalNonDilutive: number;
  consultantSavings: number;
  violations: {
    subcontracting: boolean;
    cooperation: string | null;
    overCap: boolean;
    salaryWarnings: string[];
  };
}

export interface DummyUser {
  id: string;
  name: string;
  email: string;
  company: string;
  role: UserRole;
  plan: Plan;
  avatar?: string;
}

export interface DummyApplication {
  id: string;
  userId: string;
  grantType: GrantType;
  status: AppStatus;
  title: string;
  companyName: string;
  projectTitle: string;
  sector: string;
  techSummary: string;
  teamSize: number;
  projectMonths: number;
  personnel: PersonnelEntry[];
  financials: FinancialSummary;
  createdAt: string;
}
