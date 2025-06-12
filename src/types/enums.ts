// User
export const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;
export type WeekDays = (typeof weekDays)[number];

export const categoryTypes = ["income", "expense"] as const;
export type CategoryType = (typeof categoryTypes)[number];
