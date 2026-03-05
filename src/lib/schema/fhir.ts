/**
 * FHIR R4 Zod Schemas
 * Compliant with HL7 FHIR Release 4 (v4.0.1)
 * https://hl7.org/fhir/R4/
 */

import { z } from "zod";

// ============================================================
// SECTION 1: FHIR R4 Primitive Type Schemas
// ============================================================

/** Internal FHIR logical id — alphanumeric + hyphens/dots, max 64 chars */
export const FhirIdSchema = z
  .string()
  .regex(/^[A-Za-z0-9\-.]{1,64}$/, "Invalid FHIR id");

/** Any URI */
export const FhirUriSchema = z.string();

/** URL (absolute URI) */
export const FhirUrlSchema = z.string();

/** Canonical URL (versioned reference to a canonical resource) */
export const FhirCanonicalSchema = z.string();

/** Code: restricted string with no leading/trailing whitespace */
export const FhirCodeSchema = z
  .string()
  .regex(/^[^\s]+(\s[^\s]+)*$/, "Invalid FHIR code");

/** Instant: YYYY-MM-DDThh:mm:ss.sss+zz:zz */
export const FhirInstantSchema = z.string();

/** DateTime: YYYY, YYYY-MM, YYYY-MM-DD, or YYYY-MM-DDThh:mm:ss+zz:zz */
export const FhirDateTimeSchema = z.string();

/** Date: YYYY, YYYY-MM, or YYYY-MM-DD */
export const FhirDateSchema = z
  .string()
  .regex(/^\d{4}(-\d{2}(-\d{2})?)?$/, "Invalid FHIR date");

/** Time: hh:mm:ss */
export const FhirTimeSchema = z
  .string()
  .regex(
    /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)(\.\d+)?$/,
    "Invalid FHIR time",
  );

export const FhirDecimalSchema = z.number();
export const FhirIntegerSchema = z.number().int();
export const FhirPositiveIntSchema = z.number().int().min(1);
export const FhirUnsignedIntSchema = z.number().int().min(0);
export const FhirBase64BinarySchema = z.string();
export const FhirMarkdownSchema = z.string();
export const FhirXhtmlSchema = z.string();
export const FhirOidSchema = z
  .string()
  .regex(/^urn:oid:[0-2](\.(0|[1-9][0-9]*))+$/, "Invalid OID");

// ============================================================
// SECTION 2: Forward TypeScript Type Declarations
// (needed to break circular references between Extension,
//  Identifier, and Reference)
// ============================================================

export type FhirExtension = {
  url: string;
  valueString?: string;
  valueBoolean?: boolean;
  valueInteger?: number;
  valueDecimal?: number;
  valueCode?: string;
  valueUri?: string;
  valueUrl?: string;
  valueDateTime?: string;
  valueDate?: string;
  valueTime?: string;
  valueInstant?: string;
  valueBase64Binary?: string;
  valueMarkdown?: string;
  valueId?: string;
  valueOid?: string;
  valueUnsignedInt?: number;
  valuePositiveInt?: number;
  valueCoding?: FhirCoding;
  valueCodeableConcept?: FhirCodeableConcept;
  valueQuantity?: FhirQuantity;
  valuePeriod?: FhirPeriod;
  valueRange?: FhirRange;
  valueRatio?: FhirRatio;
  valueReference?: FhirReference;
  valueIdentifier?: FhirIdentifier;
  valueAnnotation?: FhirAnnotation;
  valueAttachment?: FhirAttachment;
  extension?: FhirExtension[];
};

export type FhirCoding = {
  system?: string;
  version?: string;
  code?: string;
  display?: string;
  userSelected?: boolean;
  extension?: FhirExtension[];
};

export type FhirCodeableConcept = {
  coding?: FhirCoding[];
  text?: string;
  extension?: FhirExtension[];
};

export type FhirPeriod = {
  start?: string;
  end?: string;
  extension?: FhirExtension[];
};

export type FhirQuantity = {
  value?: number;
  comparator?: "<" | "<=" | ">=" | ">";
  unit?: string;
  system?: string;
  code?: string;
  extension?: FhirExtension[];
};

export type FhirSimpleQuantity = {
  value?: number;
  unit?: string;
  system?: string;
  code?: string;
  extension?: FhirExtension[];
};

export type FhirRange = {
  low?: FhirSimpleQuantity;
  high?: FhirSimpleQuantity;
  extension?: FhirExtension[];
};

export type FhirRatio = {
  numerator?: FhirQuantity;
  denominator?: FhirQuantity;
  extension?: FhirExtension[];
};

export type FhirAnnotation = {
  authorReference?: FhirReference;
  authorString?: string;
  time?: string;
  text: string;
  extension?: FhirExtension[];
};

export type FhirAttachment = {
  contentType?: string;
  language?: string;
  data?: string;
  url?: string;
  size?: number;
  hash?: string;
  title?: string;
  creation?: string;
  extension?: FhirExtension[];
};

export type FhirReference = {
  reference?: string;
  type?: string;
  identifier?: FhirIdentifier;
  display?: string;
  extension?: FhirExtension[];
};

export type FhirIdentifier = {
  use?: "usual" | "official" | "temp" | "secondary" | "old";
  type?: FhirCodeableConcept;
  system?: string;
  value?: string;
  period?: FhirPeriod;
  assigner?: FhirReference;
  extension?: FhirExtension[];
};

// ============================================================
// SECTION 3: FHIR R4 Common Data Type Schemas
// ============================================================

export const FhirExtensionSchema: z.ZodType<FhirExtension> = z.lazy(() =>
  z.object({
    url: FhirUriSchema,
    valueString: z.string().optional(),
    valueBoolean: z.boolean().optional(),
    valueInteger: FhirIntegerSchema.optional(),
    valueDecimal: FhirDecimalSchema.optional(),
    valueCode: FhirCodeSchema.optional(),
    valueUri: FhirUriSchema.optional(),
    valueUrl: FhirUrlSchema.optional(),
    valueDateTime: FhirDateTimeSchema.optional(),
    valueDate: FhirDateSchema.optional(),
    valueTime: FhirTimeSchema.optional(),
    valueInstant: FhirInstantSchema.optional(),
    valueBase64Binary: FhirBase64BinarySchema.optional(),
    valueMarkdown: FhirMarkdownSchema.optional(),
    valueId: FhirIdSchema.optional(),
    valueOid: FhirOidSchema.optional(),
    valueUnsignedInt: FhirUnsignedIntSchema.optional(),
    valuePositiveInt: FhirPositiveIntSchema.optional(),
    valueCoding: CodingSchema.optional(),
    valueCodeableConcept: CodeableConceptSchema.optional(),
    valueQuantity: QuantitySchema.optional(),
    valuePeriod: PeriodSchema.optional(),
    valueRange: RangeSchema.optional(),
    valueRatio: RatioSchema.optional(),
    valueReference: ReferenceSchema.optional(),
    valueIdentifier: IdentifierSchema.optional(),
    valueAnnotation: AnnotationSchema.optional(),
    valueAttachment: AttachmentSchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const CodingSchema: z.ZodType<FhirCoding> = z.lazy(() =>
  z.object({
    system: FhirUriSchema.optional(),
    version: z.string().optional(),
    code: FhirCodeSchema.optional(),
    display: z.string().optional(),
    userSelected: z.boolean().optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const CodeableConceptSchema: z.ZodType<FhirCodeableConcept> = z.lazy(
  () =>
    z.object({
      coding: z.array(CodingSchema).optional(),
      text: z.string().optional(),
      extension: z.array(FhirExtensionSchema).optional(),
    }),
);

export const PeriodSchema: z.ZodType<FhirPeriod> = z.lazy(() =>
  z.object({
    start: FhirDateTimeSchema.optional(),
    end: FhirDateTimeSchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const QuantitySchema: z.ZodType<FhirQuantity> = z.lazy(() =>
  z.object({
    value: FhirDecimalSchema.optional(),
    comparator: z.enum(["<", "<=", ">=", ">"]).optional(),
    unit: z.string().optional(),
    system: FhirUriSchema.optional(),
    code: FhirCodeSchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const SimpleQuantitySchema: z.ZodType<FhirSimpleQuantity> = z.lazy(
  () =>
    z.object({
      value: FhirDecimalSchema.optional(),
      unit: z.string().optional(),
      system: FhirUriSchema.optional(),
      code: FhirCodeSchema.optional(),
      extension: z.array(FhirExtensionSchema).optional(),
    }),
);

export const RangeSchema: z.ZodType<FhirRange> = z.lazy(() =>
  z.object({
    low: SimpleQuantitySchema.optional(),
    high: SimpleQuantitySchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const RatioSchema: z.ZodType<FhirRatio> = z.lazy(() =>
  z.object({
    numerator: QuantitySchema.optional(),
    denominator: QuantitySchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const AttachmentSchema: z.ZodType<FhirAttachment> = z.lazy(() =>
  z.object({
    contentType: FhirCodeSchema.optional(),
    language: FhirCodeSchema.optional(),
    data: FhirBase64BinarySchema.optional(),
    url: FhirUrlSchema.optional(),
    size: FhirUnsignedIntSchema.optional(),
    hash: FhirBase64BinarySchema.optional(),
    title: z.string().optional(),
    creation: FhirDateTimeSchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

/** Reference to another FHIR resource */
export const ReferenceSchema: z.ZodType<FhirReference> = z.lazy(() =>
  z.object({
    /** Relative, internal, or absolute URL */
    reference: z.string().optional(),
    /** Type the reference refers to (e.g. "Patient") */
    type: FhirUriSchema.optional(),
    /** Logical reference when literal reference is not known */
    identifier: IdentifierSchema.optional(),
    display: z.string().optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

/** Business identifier for a resource */
export const IdentifierSchema: z.ZodType<FhirIdentifier> = z.lazy(() =>
  z.object({
    use: z.enum(["usual", "official", "temp", "secondary", "old"]).optional(),
    type: CodeableConceptSchema.optional(),
    system: FhirUriSchema.optional(),
    value: z.string().optional(),
    period: PeriodSchema.optional(),
    assigner: ReferenceSchema.optional(),
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

export const AnnotationSchema: z.ZodType<FhirAnnotation> = z.lazy(() =>
  z.object({
    authorReference: ReferenceSchema.optional(),
    authorString: z.string().optional(),
    time: FhirDateTimeSchema.optional(),
    text: FhirMarkdownSchema,
    extension: z.array(FhirExtensionSchema).optional(),
  }),
);

/** Human-readable XHTML narrative */
export const NarrativeSchema = z.object({
  status: z.enum(["generated", "extensions", "additional", "empty"]),
  div: FhirXhtmlSchema,
  extension: z.array(FhirExtensionSchema).optional(),
});

/** Resource metadata */
export const MetaSchema = z.object({
  versionId: FhirIdSchema.optional(),
  lastUpdated: FhirInstantSchema.optional(),
  source: FhirUriSchema.optional(),
  profile: z.array(FhirCanonicalSchema).optional(),
  security: z.array(CodingSchema).optional(),
  tag: z.array(CodingSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** A name of a human being */
export const HumanNameSchema = z.object({
  use: z
    .enum(["usual", "official", "temp", "nickname", "anonymous", "old", "maiden"])
    .optional(),
  text: z.string().optional(),
  family: z.string().optional(),
  given: z.array(z.string()).optional(),
  prefix: z.array(z.string()).optional(),
  suffix: z.array(z.string()).optional(),
  period: PeriodSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** Physical/postal address */
export const AddressSchema = z.object({
  use: z.enum(["home", "work", "temp", "old", "billing"]).optional(),
  type: z.enum(["postal", "physical", "both"]).optional(),
  text: z.string().optional(),
  line: z.array(z.string()).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  period: PeriodSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** Contact details (phone, email, etc.) */
export const ContactPointSchema = z.object({
  system: z
    .enum(["phone", "fax", "email", "pager", "url", "sms", "other"])
    .optional(),
  value: z.string().optional(),
  use: z.enum(["home", "work", "temp", "old", "mobile"]).optional(),
  rank: FhirPositiveIntSchema.optional(),
  period: PeriodSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** Duration (time quantity) */
export const DurationSchema = z.object({
  value: FhirDecimalSchema.optional(),
  comparator: z.enum(["<", "<=", ">=", ">"]).optional(),
  unit: z.string().optional(),
  system: FhirUriSchema.optional(),
  code: FhirCodeSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** Age (quantity representing age) */
export const AgeSchema = z.object({
  value: FhirDecimalSchema.optional(),
  comparator: z.enum(["<", "<=", ">=", ">"]).optional(),
  unit: z.string().optional(),
  system: FhirUriSchema.optional(),
  code: FhirCodeSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** Timing schedule */
export const TimingRepeatSchema = z.object({
  boundsDuration: DurationSchema.optional(),
  boundsRange: RangeSchema.optional(),
  boundsPeriod: PeriodSchema.optional(),
  count: FhirPositiveIntSchema.optional(),
  countMax: FhirPositiveIntSchema.optional(),
  duration: FhirDecimalSchema.optional(),
  durationMax: FhirDecimalSchema.optional(),
  durationUnit: z.enum(["s", "min", "h", "d", "wk", "mo", "a"]).optional(),
  frequency: FhirPositiveIntSchema.optional(),
  frequencyMax: FhirPositiveIntSchema.optional(),
  period: FhirDecimalSchema.optional(),
  periodMax: FhirDecimalSchema.optional(),
  periodUnit: z.enum(["s", "min", "h", "d", "wk", "mo", "a"]).optional(),
  dayOfWeek: z
    .array(z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]))
    .optional(),
  timeOfDay: z.array(FhirTimeSchema).optional(),
  when: z.array(FhirCodeSchema).optional(),
  offset: FhirUnsignedIntSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

export const TimingSchema = z.object({
  event: z.array(FhirDateTimeSchema).optional(),
  repeat: TimingRepeatSchema.optional(),
  code: CodeableConceptSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

/** Dosage instruction for a medication */
export const DosageSchema = z.object({
  sequence: FhirIntegerSchema.optional(),
  text: z.string().optional(),
  additionalInstruction: z.array(CodeableConceptSchema).optional(),
  patientInstruction: z.string().optional(),
  timing: TimingSchema.optional(),
  asNeededBoolean: z.boolean().optional(),
  asNeededCodeableConcept: CodeableConceptSchema.optional(),
  site: CodeableConceptSchema.optional(),
  route: CodeableConceptSchema.optional(),
  method: CodeableConceptSchema.optional(),
  doseAndRate: z
    .array(
      z.object({
        type: CodeableConceptSchema.optional(),
        doseRange: RangeSchema.optional(),
        doseQuantity: SimpleQuantitySchema.optional(),
        rateRatio: RatioSchema.optional(),
        rateRange: RangeSchema.optional(),
        rateQuantity: SimpleQuantitySchema.optional(),
        extension: z.array(FhirExtensionSchema).optional(),
      }),
    )
    .optional(),
  maxDosePerPeriod: RatioSchema.optional(),
  maxDosePerAdministration: SimpleQuantitySchema.optional(),
  maxDosePerLifetime: SimpleQuantitySchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

// ============================================================
// SECTION 4: PATIENT (R4)
// https://hl7.org/fhir/R4/patient.html
// ============================================================

const PatientContactSchema = z.object({
  relationship: z.array(CodeableConceptSchema).optional(),
  name: HumanNameSchema.optional(),
  telecom: z.array(ContactPointSchema).optional(),
  address: AddressSchema.optional(),
  gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  organization: ReferenceSchema.optional(),
  period: PeriodSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const PatientCommunicationSchema = z.object({
  language: CodeableConceptSchema,
  preferred: z.boolean().optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const PatientLinkSchema = z.object({
  other: ReferenceSchema,
  type: z.enum(["replaced-by", "replaces", "refer", "seealso"]),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const PatientSchema = z.object({
  resourceType: z.literal("Patient"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().optional(),
  name: z.array(HumanNameSchema).optional(),
  telecom: z.array(ContactPointSchema).optional(),
  /** Administrative gender (does not necessarily match biological sex) */
  gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  birthDate: FhirDateSchema.optional(),
  deceasedBoolean: z.boolean().optional(),
  deceasedDateTime: FhirDateTimeSchema.optional(),
  address: z.array(AddressSchema).optional(),
  maritalStatus: CodeableConceptSchema.optional(),
  multipleBirthBoolean: z.boolean().optional(),
  multipleBirthInteger: FhirIntegerSchema.optional(),
  photo: z.array(AttachmentSchema).optional(),
  contact: z.array(PatientContactSchema).optional(),
  communication: z.array(PatientCommunicationSchema).optional(),
  generalPractitioner: z.array(ReferenceSchema).optional(),
  managingOrganization: ReferenceSchema.optional(),
  link: z.array(PatientLinkSchema).optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

// ============================================================
// SECTION 5: PRACTITIONER (R4)
// https://hl7.org/fhir/R4/practitioner.html
// ============================================================

const PractitionerQualificationSchema = z.object({
  identifier: z.array(IdentifierSchema).optional(),
  code: CodeableConceptSchema,
  period: PeriodSchema.optional(),
  issuer: ReferenceSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const PractitionerSchema = z.object({
  resourceType: z.literal("Practitioner"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().optional(),
  name: z.array(HumanNameSchema).optional(),
  telecom: z.array(ContactPointSchema).optional(),
  address: z.array(AddressSchema).optional(),
  gender: z.enum(["male", "female", "other", "unknown"]).optional(),
  birthDate: FhirDateSchema.optional(),
  photo: z.array(AttachmentSchema).optional(),
  qualification: z.array(PractitionerQualificationSchema).optional(),
  communication: z.array(CodeableConceptSchema).optional(),
});

export type Practitioner = z.infer<typeof PractitionerSchema>;

// ============================================================
// SECTION 6: ORGANIZATION (R4)
// https://hl7.org/fhir/R4/organization.html
// ============================================================

const OrganizationContactSchema = z.object({
  purpose: CodeableConceptSchema.optional(),
  name: HumanNameSchema.optional(),
  telecom: z.array(ContactPointSchema).optional(),
  address: AddressSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const OrganizationSchema = z.object({
  resourceType: z.literal("Organization"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  active: z.boolean().optional(),
  type: z.array(CodeableConceptSchema).optional(),
  name: z.string().optional(),
  alias: z.array(z.string()).optional(),
  telecom: z.array(ContactPointSchema).optional(),
  address: z.array(AddressSchema).optional(),
  /** The organization of which this organization forms a part */
  partOf: ReferenceSchema.optional(),
  contact: z.array(OrganizationContactSchema).optional(),
  endpoint: z.array(ReferenceSchema).optional(),
});

export type Organization = z.infer<typeof OrganizationSchema>;

// ============================================================
// SECTION 7: ENCOUNTER (R4)
// https://hl7.org/fhir/R4/encounter.html
// ============================================================

const EncounterStatusHistorySchema = z.object({
  status: z.enum([
    "planned",
    "arrived",
    "triaged",
    "in-progress",
    "onleave",
    "finished",
    "cancelled",
    "entered-in-error",
    "unknown",
  ]),
  period: PeriodSchema,
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const EncounterClassHistorySchema = z.object({
  class: CodingSchema,
  period: PeriodSchema,
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const EncounterParticipantSchema = z.object({
  type: z.array(CodeableConceptSchema).optional(),
  period: PeriodSchema.optional(),
  individual: ReferenceSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const EncounterDiagnosisSchema = z.object({
  condition: ReferenceSchema,
  use: CodeableConceptSchema.optional(),
  rank: FhirPositiveIntSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const EncounterHospitalizationSchema = z.object({
  preAdmissionIdentifier: IdentifierSchema.optional(),
  origin: ReferenceSchema.optional(),
  admitSource: CodeableConceptSchema.optional(),
  reAdmission: CodeableConceptSchema.optional(),
  dietPreference: z.array(CodeableConceptSchema).optional(),
  specialCourtesy: z.array(CodeableConceptSchema).optional(),
  specialArrangement: z.array(CodeableConceptSchema).optional(),
  destination: ReferenceSchema.optional(),
  dischargeDisposition: CodeableConceptSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const EncounterLocationSchema = z.object({
  location: ReferenceSchema,
  status: z.enum(["planned", "active", "reserved", "completed"]).optional(),
  physicalType: CodeableConceptSchema.optional(),
  period: PeriodSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const EncounterSchema = z.object({
  resourceType: z.literal("Encounter"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  /** REQUIRED: planned | arrived | triaged | in-progress | onleave | finished | cancelled | entered-in-error | unknown */
  status: z.enum([
    "planned",
    "arrived",
    "triaged",
    "in-progress",
    "onleave",
    "finished",
    "cancelled",
    "entered-in-error",
    "unknown",
  ]),
  statusHistory: z.array(EncounterStatusHistorySchema).optional(),
  /** REQUIRED: Classification of patient encounter (e.g., ambulatory, inpatient) */
  class: CodingSchema,
  classHistory: z.array(EncounterClassHistorySchema).optional(),
  type: z.array(CodeableConceptSchema).optional(),
  serviceType: CodeableConceptSchema.optional(),
  priority: CodeableConceptSchema.optional(),
  subject: ReferenceSchema.optional(),
  episodeOfCare: z.array(ReferenceSchema).optional(),
  basedOn: z.array(ReferenceSchema).optional(),
  participant: z.array(EncounterParticipantSchema).optional(),
  appointment: z.array(ReferenceSchema).optional(),
  period: PeriodSchema.optional(),
  length: DurationSchema.optional(),
  reasonCode: z.array(CodeableConceptSchema).optional(),
  reasonReference: z.array(ReferenceSchema).optional(),
  diagnosis: z.array(EncounterDiagnosisSchema).optional(),
  account: z.array(ReferenceSchema).optional(),
  hospitalization: EncounterHospitalizationSchema.optional(),
  location: z.array(EncounterLocationSchema).optional(),
  serviceProvider: ReferenceSchema.optional(),
  partOf: ReferenceSchema.optional(),
});

export type Encounter = z.infer<typeof EncounterSchema>;

// ============================================================
// SECTION 8: OBSERVATION (R4)
// https://hl7.org/fhir/R4/observation.html
// ============================================================

const ObservationReferenceRangeSchema = z.object({
  low: SimpleQuantitySchema.optional(),
  high: SimpleQuantitySchema.optional(),
  type: CodeableConceptSchema.optional(),
  appliesTo: z.array(CodeableConceptSchema).optional(),
  age: RangeSchema.optional(),
  text: z.string().optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const ObservationComponentSchema = z.object({
  code: CodeableConceptSchema,
  valueQuantity: QuantitySchema.optional(),
  valueCodeableConcept: CodeableConceptSchema.optional(),
  valueString: z.string().optional(),
  valueBoolean: z.boolean().optional(),
  valueInteger: FhirIntegerSchema.optional(),
  valueRange: RangeSchema.optional(),
  valueRatio: RatioSchema.optional(),
  valueSampledData: z.any().optional(),
  valueTime: FhirTimeSchema.optional(),
  valueDateTime: FhirDateTimeSchema.optional(),
  valuePeriod: PeriodSchema.optional(),
  dataAbsentReason: CodeableConceptSchema.optional(),
  interpretation: z.array(CodeableConceptSchema).optional(),
  referenceRange: z.array(ObservationReferenceRangeSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const ObservationSchema = z.object({
  resourceType: z.literal("Observation"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  basedOn: z.array(ReferenceSchema).optional(),
  partOf: z.array(ReferenceSchema).optional(),
  /** REQUIRED: registered | preliminary | final | amended | corrected | cancelled | entered-in-error | unknown */
  status: z.enum([
    "registered",
    "preliminary",
    "final",
    "amended",
    "corrected",
    "cancelled",
    "entered-in-error",
    "unknown",
  ]),
  category: z.array(CodeableConceptSchema).optional(),
  /** REQUIRED: Type of observation (e.g., LOINC code) */
  code: CodeableConceptSchema,
  subject: ReferenceSchema.optional(),
  focus: z.array(ReferenceSchema).optional(),
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: FhirDateTimeSchema.optional(),
  effectivePeriod: PeriodSchema.optional(),
  effectiveTiming: TimingSchema.optional(),
  effectiveInstant: FhirInstantSchema.optional(),
  issued: FhirInstantSchema.optional(),
  performer: z.array(ReferenceSchema).optional(),
  valueQuantity: QuantitySchema.optional(),
  valueCodeableConcept: CodeableConceptSchema.optional(),
  valueString: z.string().optional(),
  valueBoolean: z.boolean().optional(),
  valueInteger: FhirIntegerSchema.optional(),
  valueRange: RangeSchema.optional(),
  valueRatio: RatioSchema.optional(),
  valueSampledData: z.any().optional(),
  valueTime: FhirTimeSchema.optional(),
  valueDateTime: FhirDateTimeSchema.optional(),
  valuePeriod: PeriodSchema.optional(),
  dataAbsentReason: CodeableConceptSchema.optional(),
  interpretation: z.array(CodeableConceptSchema).optional(),
  note: z.array(AnnotationSchema).optional(),
  bodySite: CodeableConceptSchema.optional(),
  method: CodeableConceptSchema.optional(),
  specimen: ReferenceSchema.optional(),
  device: ReferenceSchema.optional(),
  referenceRange: z.array(ObservationReferenceRangeSchema).optional(),
  hasMember: z.array(ReferenceSchema).optional(),
  derivedFrom: z.array(ReferenceSchema).optional(),
  component: z.array(ObservationComponentSchema).optional(),
});

export type Observation = z.infer<typeof ObservationSchema>;

// ============================================================
// SECTION 9: CONDITION (R4)
// https://hl7.org/fhir/R4/condition.html
// ============================================================

const ConditionStageSchema = z.object({
  summary: CodeableConceptSchema.optional(),
  assessment: z.array(ReferenceSchema).optional(),
  type: CodeableConceptSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const ConditionEvidenceSchema = z.object({
  code: z.array(CodeableConceptSchema).optional(),
  detail: z.array(ReferenceSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const ConditionSchema = z.object({
  resourceType: z.literal("Condition"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  /** active | recurrence | relapse | inactive | remission | resolved */
  clinicalStatus: CodeableConceptSchema.optional(),
  /** unconfirmed | provisional | differential | confirmed | refuted | entered-in-error */
  verificationStatus: CodeableConceptSchema.optional(),
  category: z.array(CodeableConceptSchema).optional(),
  severity: CodeableConceptSchema.optional(),
  code: CodeableConceptSchema.optional(),
  bodySite: z.array(CodeableConceptSchema).optional(),
  /** REQUIRED: Patient/Group who has the condition */
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  onsetDateTime: FhirDateTimeSchema.optional(),
  onsetAge: AgeSchema.optional(),
  onsetPeriod: PeriodSchema.optional(),
  onsetRange: RangeSchema.optional(),
  onsetString: z.string().optional(),
  abatementDateTime: FhirDateTimeSchema.optional(),
  abatementAge: AgeSchema.optional(),
  abatementPeriod: PeriodSchema.optional(),
  abatementRange: RangeSchema.optional(),
  abatementString: z.string().optional(),
  recordedDate: FhirDateTimeSchema.optional(),
  recorder: ReferenceSchema.optional(),
  asserter: ReferenceSchema.optional(),
  stage: z.array(ConditionStageSchema).optional(),
  evidence: z.array(ConditionEvidenceSchema).optional(),
  note: z.array(AnnotationSchema).optional(),
});

export type Condition = z.infer<typeof ConditionSchema>;

// ============================================================
// SECTION 10: MEDICATION (R4)
// https://hl7.org/fhir/R4/medication.html
// ============================================================

const MedicationIngredientSchema = z.object({
  itemCodeableConcept: CodeableConceptSchema.optional(),
  itemReference: ReferenceSchema.optional(),
  isActive: z.boolean().optional(),
  strength: RatioSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const MedicationBatchSchema = z.object({
  lotNumber: z.string().optional(),
  expirationDate: FhirDateTimeSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const MedicationSchema = z.object({
  resourceType: z.literal("Medication"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  code: CodeableConceptSchema.optional(),
  /** active | inactive | entered-in-error */
  status: z.enum(["active", "inactive", "entered-in-error"]).optional(),
  manufacturer: ReferenceSchema.optional(),
  form: CodeableConceptSchema.optional(),
  amount: RatioSchema.optional(),
  ingredient: z.array(MedicationIngredientSchema).optional(),
  batch: MedicationBatchSchema.optional(),
});

export type Medication = z.infer<typeof MedicationSchema>;

// ============================================================
// SECTION 11: MEDICATION REQUEST (R4)
// https://hl7.org/fhir/R4/medicationrequest.html
// ============================================================

const MedicationRequestDispenseRequestSchema = z.object({
  initialFill: z
    .object({
      quantity: SimpleQuantitySchema.optional(),
      duration: DurationSchema.optional(),
      extension: z.array(FhirExtensionSchema).optional(),
      modifierExtension: z.array(FhirExtensionSchema).optional(),
    })
    .optional(),
  dispenseInterval: DurationSchema.optional(),
  validityPeriod: PeriodSchema.optional(),
  numberOfRepeatsAllowed: FhirUnsignedIntSchema.optional(),
  quantity: SimpleQuantitySchema.optional(),
  expectedSupplyDuration: DurationSchema.optional(),
  performer: ReferenceSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const MedicationRequestSubstitutionSchema = z.object({
  allowedBoolean: z.boolean().optional(),
  allowedCodeableConcept: CodeableConceptSchema.optional(),
  reason: CodeableConceptSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const MedicationRequestSchema = z.object({
  resourceType: z.literal("MedicationRequest"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  /** REQUIRED: active | on-hold | cancelled | completed | entered-in-error | stopped | draft | unknown */
  status: z.enum([
    "active",
    "on-hold",
    "cancelled",
    "completed",
    "entered-in-error",
    "stopped",
    "draft",
    "unknown",
  ]),
  statusReason: CodeableConceptSchema.optional(),
  /** REQUIRED: proposal | plan | order | original-order | reflex-order | filler-order | instance-order | option */
  intent: z.enum([
    "proposal",
    "plan",
    "order",
    "original-order",
    "reflex-order",
    "filler-order",
    "instance-order",
    "option",
  ]),
  category: z.array(CodeableConceptSchema).optional(),
  priority: z.enum(["routine", "urgent", "asap", "stat"]).optional(),
  doNotPerform: z.boolean().optional(),
  reportedBoolean: z.boolean().optional(),
  reportedReference: ReferenceSchema.optional(),
  /** REQUIRED: Medication reference or inline CodeableConcept */
  medicationCodeableConcept: CodeableConceptSchema.optional(),
  medicationReference: ReferenceSchema.optional(),
  /** REQUIRED: Patient or group for whom medication is being ordered */
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  supportingInformation: z.array(ReferenceSchema).optional(),
  authoredOn: FhirDateTimeSchema.optional(),
  requester: ReferenceSchema.optional(),
  performer: ReferenceSchema.optional(),
  performerType: CodeableConceptSchema.optional(),
  recorder: ReferenceSchema.optional(),
  reasonCode: z.array(CodeableConceptSchema).optional(),
  reasonReference: z.array(ReferenceSchema).optional(),
  instantiatesCanonical: z.array(FhirCanonicalSchema).optional(),
  instantiatesUri: z.array(FhirUriSchema).optional(),
  basedOn: z.array(ReferenceSchema).optional(),
  groupIdentifier: IdentifierSchema.optional(),
  courseOfTherapyType: CodeableConceptSchema.optional(),
  insurance: z.array(ReferenceSchema).optional(),
  note: z.array(AnnotationSchema).optional(),
  dosageInstruction: z.array(DosageSchema).optional(),
  dispenseRequest: MedicationRequestDispenseRequestSchema.optional(),
  substitution: MedicationRequestSubstitutionSchema.optional(),
  priorPrescription: ReferenceSchema.optional(),
  detectedIssue: z.array(ReferenceSchema).optional(),
  eventHistory: z.array(ReferenceSchema).optional(),
});

export type MedicationRequest = z.infer<typeof MedicationRequestSchema>;

// ============================================================
// SECTION 12: PROCEDURE (R4)
// https://hl7.org/fhir/R4/procedure.html
// ============================================================

const ProcedurePerformerSchema = z.object({
  function: CodeableConceptSchema.optional(),
  actor: ReferenceSchema,
  onBehalfOf: ReferenceSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const ProcedureFocalDeviceSchema = z.object({
  action: CodeableConceptSchema.optional(),
  manipulated: ReferenceSchema,
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const ProcedureSchema = z.object({
  resourceType: z.literal("Procedure"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  instantiatesCanonical: z.array(FhirCanonicalSchema).optional(),
  instantiatesUri: z.array(FhirUriSchema).optional(),
  basedOn: z.array(ReferenceSchema).optional(),
  partOf: z.array(ReferenceSchema).optional(),
  /** REQUIRED: preparation | in-progress | not-done | on-hold | stopped | completed | entered-in-error | unknown */
  status: z.enum([
    "preparation",
    "in-progress",
    "not-done",
    "on-hold",
    "stopped",
    "completed",
    "entered-in-error",
    "unknown",
  ]),
  statusReason: CodeableConceptSchema.optional(),
  category: CodeableConceptSchema.optional(),
  code: CodeableConceptSchema.optional(),
  /** REQUIRED: Patient/Group/Device/Location on whom the procedure was performed */
  subject: ReferenceSchema,
  encounter: ReferenceSchema.optional(),
  performedDateTime: FhirDateTimeSchema.optional(),
  performedPeriod: PeriodSchema.optional(),
  performedString: z.string().optional(),
  performedAge: AgeSchema.optional(),
  performedRange: RangeSchema.optional(),
  recorder: ReferenceSchema.optional(),
  asserter: ReferenceSchema.optional(),
  performer: z.array(ProcedurePerformerSchema).optional(),
  location: ReferenceSchema.optional(),
  reasonCode: z.array(CodeableConceptSchema).optional(),
  reasonReference: z.array(ReferenceSchema).optional(),
  bodySite: z.array(CodeableConceptSchema).optional(),
  outcome: CodeableConceptSchema.optional(),
  report: z.array(ReferenceSchema).optional(),
  complication: z.array(CodeableConceptSchema).optional(),
  complicationDetail: z.array(ReferenceSchema).optional(),
  followUp: z.array(CodeableConceptSchema).optional(),
  note: z.array(AnnotationSchema).optional(),
  focalDevice: z.array(ProcedureFocalDeviceSchema).optional(),
  usedReference: z.array(ReferenceSchema).optional(),
  usedCode: z.array(CodeableConceptSchema).optional(),
});

export type Procedure = z.infer<typeof ProcedureSchema>;

// ============================================================
// SECTION 13: DIAGNOSTIC REPORT (R4)
// https://hl7.org/fhir/R4/diagnosticreport.html
// ============================================================

const DiagnosticReportMediaSchema = z.object({
  comment: z.string().optional(),
  link: ReferenceSchema,
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const DiagnosticReportSchema = z.object({
  resourceType: z.literal("DiagnosticReport"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  identifier: z.array(IdentifierSchema).optional(),
  basedOn: z.array(ReferenceSchema).optional(),
  /** REQUIRED: registered | partial | preliminary | final | amended | corrected | appended | cancelled | entered-in-error | unknown */
  status: z.enum([
    "registered",
    "partial",
    "preliminary",
    "final",
    "amended",
    "corrected",
    "appended",
    "cancelled",
    "entered-in-error",
    "unknown",
  ]),
  category: z.array(CodeableConceptSchema).optional(),
  /** REQUIRED: Name/code for this diagnostic report */
  code: CodeableConceptSchema,
  subject: ReferenceSchema.optional(),
  encounter: ReferenceSchema.optional(),
  effectiveDateTime: FhirDateTimeSchema.optional(),
  effectivePeriod: PeriodSchema.optional(),
  issued: FhirInstantSchema.optional(),
  performer: z.array(ReferenceSchema).optional(),
  resultsInterpreter: z.array(ReferenceSchema).optional(),
  specimen: z.array(ReferenceSchema).optional(),
  result: z.array(ReferenceSchema).optional(),
  imagingStudy: z.array(ReferenceSchema).optional(),
  media: z.array(DiagnosticReportMediaSchema).optional(),
  conclusion: z.string().optional(),
  conclusionCode: z.array(CodeableConceptSchema).optional(),
  presentedForm: z.array(AttachmentSchema).optional(),
});

export type DiagnosticReport = z.infer<typeof DiagnosticReportSchema>;

// ============================================================
// SECTION 14: DOCUMENT REFERENCE (R4)
// https://hl7.org/fhir/R4/documentreference.html
// ============================================================

const DocumentReferenceRelatesToSchema = z.object({
  code: z.enum(["replaces", "transforms", "signs", "appends"]),
  target: ReferenceSchema,
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const DocumentReferenceContentSchema = z.object({
  attachment: AttachmentSchema,
  format: CodingSchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const DocumentReferenceContextSchema = z.object({
  encounter: z.array(ReferenceSchema).optional(),
  event: z.array(CodeableConceptSchema).optional(),
  period: PeriodSchema.optional(),
  facilityType: CodeableConceptSchema.optional(),
  practiceSetting: CodeableConceptSchema.optional(),
  sourcePatientInfo: ReferenceSchema.optional(),
  related: z.array(ReferenceSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const DocumentReferenceSchema = z.object({
  resourceType: z.literal("DocumentReference"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  masterIdentifier: IdentifierSchema.optional(),
  identifier: z.array(IdentifierSchema).optional(),
  /** REQUIRED: current | superseded | entered-in-error */
  status: z.enum(["current", "superseded", "entered-in-error"]),
  /** preliminary | final | amended | entered-in-error */
  docStatus: z
    .enum(["preliminary", "final", "amended", "entered-in-error"])
    .optional(),
  type: CodeableConceptSchema.optional(),
  category: z.array(CodeableConceptSchema).optional(),
  subject: ReferenceSchema.optional(),
  date: FhirInstantSchema.optional(),
  author: z.array(ReferenceSchema).optional(),
  authenticator: ReferenceSchema.optional(),
  custodian: ReferenceSchema.optional(),
  relatesTo: z.array(DocumentReferenceRelatesToSchema).optional(),
  description: z.string().optional(),
  securityLabel: z.array(CodeableConceptSchema).optional(),
  /** REQUIRED: at least one content entry */
  content: z.array(DocumentReferenceContentSchema).min(1),
  context: DocumentReferenceContextSchema.optional(),
});

export type DocumentReference = z.infer<typeof DocumentReferenceSchema>;

// ============================================================
// SECTION 15: AUDIT EVENT (R4)
// https://hl7.org/fhir/R4/auditevent.html
// ============================================================

const AuditEventAgentNetworkSchema = z.object({
  address: z.string().optional(),
  type: z.enum(["1", "2", "3", "4", "5"]).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const AuditEventAgentSchema = z.object({
  type: CodeableConceptSchema.optional(),
  role: z.array(CodeableConceptSchema).optional(),
  who: ReferenceSchema.optional(),
  altId: z.string().optional(),
  name: z.string().optional(),
  /** REQUIRED: Whether the agent is the requestor */
  requestor: z.boolean(),
  location: ReferenceSchema.optional(),
  policy: z.array(FhirUriSchema).optional(),
  media: CodingSchema.optional(),
  network: AuditEventAgentNetworkSchema.optional(),
  purposeOfUse: z.array(CodeableConceptSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const AuditEventSourceSchema = z.object({
  site: z.string().optional(),
  observer: ReferenceSchema,
  type: z.array(CodingSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const AuditEventEntityDetailSchema = z.object({
  type: z.string(),
  valueString: z.string().optional(),
  valueBase64Binary: FhirBase64BinarySchema.optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

const AuditEventEntitySchema = z.object({
  what: ReferenceSchema.optional(),
  type: CodingSchema.optional(),
  role: CodingSchema.optional(),
  lifecycle: CodingSchema.optional(),
  securityLabel: z.array(CodingSchema).optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  query: FhirBase64BinarySchema.optional(),
  detail: z.array(AuditEventEntityDetailSchema).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),
});

export const AuditEventSchema = z.object({
  resourceType: z.literal("AuditEvent"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  text: NarrativeSchema.optional(),
  contained: z.array(z.any()).optional(),
  extension: z.array(FhirExtensionSchema).optional(),
  modifierExtension: z.array(FhirExtensionSchema).optional(),

  /** REQUIRED: Type/identifier of event (DICOM audit event type) */
  type: CodingSchema,
  subtype: z.array(CodingSchema).optional(),
  /** C=Create, R=Read/View/Print, U=Update, D=Delete, E=Execute */
  action: z.enum(["C", "R", "U", "D", "E"]).optional(),
  period: PeriodSchema.optional(),
  /** REQUIRED: Time when the event was recorded */
  recorded: FhirInstantSchema,
  /** 0=Success, 4=Minor failure, 8=Serious failure, 12=Major failure */
  outcome: z.enum(["0", "4", "8", "12"]).optional(),
  outcomeDesc: z.string().optional(),
  purposeOfEvent: z.array(CodeableConceptSchema).optional(),
  /** REQUIRED: Actor involved in the event */
  agent: z.array(AuditEventAgentSchema).min(1),
  /** REQUIRED: Audit event reporter */
  source: AuditEventSourceSchema,
  entity: z.array(AuditEventEntitySchema).optional(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

// ============================================================
// SECTION 16: BUNDLE ENTRY & FHIR RESOURCE UNION
// ============================================================

/** Union of all supported FHIR resource schemas */
export const FhirResourceSchema = z.discriminatedUnion("resourceType", [
  PatientSchema,
  PractitionerSchema,
  OrganizationSchema,
  EncounterSchema,
  ObservationSchema,
  ConditionSchema,
  MedicationSchema,
  MedicationRequestSchema,
  ProcedureSchema,
  DiagnosticReportSchema,
  DocumentReferenceSchema,
  AuditEventSchema,
]);

export type FhirResource = z.infer<typeof FhirResourceSchema>;

/** FHIR Bundle entry */
export const BundleEntrySchema = z.object({
  fullUrl: FhirUriSchema.optional(),
  resource: FhirResourceSchema.optional(),
  search: z
    .object({
      mode: z.enum(["match", "include", "outcome"]).optional(),
      score: FhirDecimalSchema.optional(),
    })
    .optional(),
  request: z
    .object({
      method: z.enum(["GET", "HEAD", "POST", "PUT", "DELETE", "PATCH"]),
      url: FhirUriSchema,
      ifNoneMatch: z.string().optional(),
      ifModifiedSince: FhirInstantSchema.optional(),
      ifMatch: z.string().optional(),
      ifNoneExist: z.string().optional(),
    })
    .optional(),
  response: z
    .object({
      status: z.string(),
      location: FhirUriSchema.optional(),
      etag: z.string().optional(),
      lastModified: FhirInstantSchema.optional(),
    })
    .optional(),
  extension: z.array(FhirExtensionSchema).optional(),
});

/** FHIR Bundle (collection of resources) */
export const BundleSchema = z.object({
  resourceType: z.literal("Bundle"),
  id: FhirIdSchema.optional(),
  meta: MetaSchema.optional(),
  implicitRules: FhirUriSchema.optional(),
  language: FhirCodeSchema.optional(),
  identifier: IdentifierSchema.optional(),
  type: z.enum([
    "document",
    "message",
    "transaction",
    "transaction-response",
    "batch",
    "batch-response",
    "history",
    "searchset",
    "collection",
  ]),
  timestamp: FhirInstantSchema.optional(),
  total: FhirUnsignedIntSchema.optional(),
  link: z
    .array(
      z.object({
        relation: z.string(),
        url: FhirUriSchema,
      }),
    )
    .optional(),
  entry: z.array(BundleEntrySchema).optional(),
  signature: z.any().optional(),
});

export type Bundle = z.infer<typeof BundleSchema>;

// ============================================================
// SECTION 17: INFERRED TYPESCRIPT TYPES RE-EXPORTS
// ============================================================

export type FhirMeta = z.infer<typeof MetaSchema>;
export type FhirNarrative = z.infer<typeof NarrativeSchema>;
export type FhirHumanName = z.infer<typeof HumanNameSchema>;
export type FhirAddress = z.infer<typeof AddressSchema>;
export type FhirContactPoint = z.infer<typeof ContactPointSchema>;
export type FhirDuration = z.infer<typeof DurationSchema>;
export type FhirAge = z.infer<typeof AgeSchema>;
export type FhirTiming = z.infer<typeof TimingSchema>;
export type FhirDosage = z.infer<typeof DosageSchema>;
export type FhirBundleEntry = z.infer<typeof BundleEntrySchema>;
