export enum UserRole {
  PATIENT,
  DOCTOR,
}

export interface Doctor {
  id: number;
  name: string;
  avatar: string;
  patientIds: number[];
}

export enum Biomarker {
  UROBILINOGEN = 'Urobilinogen',
  GLUCOSE = 'Glucose',
  BILIRUBIN = 'Bilirubin',
  KETONE = 'Ketone',
  SPECIFIC_GRAVITY = 'Specific Gravity',
  BLOOD = 'Blood',
  PH = 'pH',
  PROTEIN = 'Protein',
  NITRITE = 'Nitrite',
  LEUKOCYTES = 'Leukocytes',
  ASCORBIC_ACID = 'Ascorbic Acid',
}

export enum HealthStatus {
  NORMAL = 'Normal',
  CAUTION = 'Caution',
  ALERT = 'Alert',
}

export interface TestResult {
  date: string;
  values: Record<Biomarker, number | string>;
}

export interface PatientContact {
    email: string;
    phone: string;
    address: string;
}

export interface Caregiver {
    name: string;
    relation: string;
    phone: string;
}

export enum Gender {
    MALE = 'Male',
    FEMALE = 'Female',
    OTHER = 'Other',
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: Gender;
  avatar: string;
  results: TestResult[];
  hospital: string;
  contact: PatientContact;
  caregiver: Caregiver;
}

export interface BiomarkerThreshold {
  normal: (value: number | string) => boolean;
  caution?: (value: number | string) => boolean;
  unit: string;
  name: string;
}

export enum Page {
    DASHBOARD = 'Dashboard',
    ALERTS = 'Alerts',
    SETTINGS = 'Settings',
    HISTORY = 'Test History',
}

export enum AlertLevel {
    HIGH = 'High',
    MEDIUM = 'Medium',
}

export enum AlertStatus {
    ACTIVE = 'Active',
    SNOOZED = 'Snoozed',
    REVIEWED = 'Reviewed',
}

export interface Alert {
    id: string;
    patientId: number;
    patientName: string;
    message: string;
    level: AlertLevel;
    timestamp: string;
    status: AlertStatus;
}