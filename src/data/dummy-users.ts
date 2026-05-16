import type { DummyUser } from "@/types";

export const dummyUsers: DummyUser[] = [
  {
    id: "user_lena",
    name: "Dr. Lena Müller",
    email: "lena@thermovolt.de",
    company: "ThermoVolt GmbH",
    role: "FOUNDER",
    plan: "PRO",
    avatar: "/avatars/lena.jpg",
  },
  {
    id: "user_raj",
    name: "Raj Sharma",
    email: "raj@predictmaint.ai",
    company: "PredictMaint AI",
    role: "FOUNDER",
    plan: "FREE",
  },
  {
    id: "user_klaus",
    name: "Prof. Dr. Klaus Weber",
    email: "weber@tum-tto.de",
    company: "TU Munich TTO",
    role: "TTO_ADMIN",
    plan: "ENTERPRISE",
  },
];

export const currentUser = dummyUsers[0];
