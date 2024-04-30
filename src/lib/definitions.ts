export type Patient = {
  patientName: string;
  insuranceProvider: string;
  dob: Date | string;
  memberId: string;
  nurses: Caregiver[]
}

export type Caregiver = {
  caregiverName: string;
  totalHours: number;
  date: Date
}

export type PayrollRow = {
  [patientName: string]: Patient
}

export type CalendarEvent = {
  title: string;
  start: Date,
  end: Date
}

export type PayrollEvent = {
  [caregiverName: string]: { [patientName: string]: CalendarEvent[] }
}

