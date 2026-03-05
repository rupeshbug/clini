import { useRef, useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Drawer,
  Empty,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
  message,
} from "antd";
import type { ColumnsType, TableProps } from "antd/es/table";
import Form from "@rjsf/antd";
import validator from "@rjsf/validator-ajv8";
import type {
  RJSFSchema,
  UiSchema,
  ObjectFieldTemplateProps,
} from "@rjsf/utils";
import {
  Calendar,
  Edit2,
  Plus,
  Search,
  Stethoscope,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/patients")({ component: PatientsPage });

const { Text } = Typography;

// ── Types ────────────────────────────────────────────────────

interface PatientRecord {
  id: string;
  mrn: string;
  prefix?: string;
  given: string;
  family: string;
  birthDate: string;
  gender: "male" | "female" | "other" | "unknown";
  active: boolean;
  phone?: string;
  email?: string;
  addressLine?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  bloodType?: string;
  allergies?: string;
  notes?: string;
  lastVisit?: string;
  emergencyName?: string;
  emergencyPhone?: string;
  emergencyRelation?: string;
}

// ── Helpers ──────────────────────────────────────────────────

function calcAge(dob: string): number {
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  if (
    today.getMonth() < birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
  )
    age--;
  return age;
}

function fullName(
  p: Pick<PatientRecord, "prefix" | "given" | "family">,
): string {
  return [p.prefix, p.given, p.family].filter(Boolean).join(" ");
}

function initials(p: Pick<PatientRecord, "given" | "family">): string {
  return `${p.given[0] ?? ""}${p.family[0] ?? ""}`.toUpperCase();
}

const AVATAR_PALETTE = [
  "#4fb8b2",
  "#52c41a",
  "#1677ff",
  "#722ed1",
  "#eb2f96",
  "#fa8c16",
  "#13c2c2",
  "#2f6a4a",
];

function avatarColor(name: string): string {
  return AVATAR_PALETTE[name.charCodeAt(0) % AVATAR_PALETTE.length];
}

function generateMRN(): string {
  return `MRN-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

// ── Seed Data ────────────────────────────────────────────────

const SEED: PatientRecord[] = [
  {
    id: "p01",
    mrn: "MRN-2025-1042",
    prefix: "Mr.",
    given: "James",
    family: "Wilson",
    birthDate: "1978-03-15",
    gender: "male",
    active: true,
    phone: "+1 (617) 555-2341",
    email: "james.wilson@email.com",
    addressLine: "142 Oak Street",
    city: "Boston",
    state: "MA",
    postalCode: "02101",
    country: "US",
    bloodType: "A+",
    allergies: "Penicillin",
    lastVisit: "2026-02-10",
    emergencyName: "Sarah Wilson",
    emergencyPhone: "+1 (617) 555-9999",
    emergencyRelation: "spouse",
  },
  {
    id: "p02",
    mrn: "MRN-2025-1087",
    prefix: "Ms.",
    given: "Elena",
    family: "Martinez",
    birthDate: "1991-07-22",
    gender: "female",
    active: true,
    phone: "+1 (312) 555-7840",
    email: "elena.m@mail.com",
    addressLine: "88 Lakeview Ave",
    city: "Chicago",
    state: "IL",
    postalCode: "60601",
    country: "US",
    bloodType: "O+",
    allergies: "Sulfa drugs, Latex",
    lastVisit: "2026-02-28",
    emergencyName: "Marco Martinez",
    emergencyPhone: "+1 (312) 555-0033",
    emergencyRelation: "parent",
  },
  {
    id: "p03",
    mrn: "MRN-2025-1135",
    prefix: "Dr.",
    given: "Aisha",
    family: "Okonkwo",
    birthDate: "1965-11-04",
    gender: "female",
    active: true,
    phone: "+1 (404) 555-6612",
    email: "a.okonkwo@hospital.org",
    addressLine: "25 Peach Tree Blvd",
    city: "Atlanta",
    state: "GA",
    postalCode: "30301",
    country: "US",
    bloodType: "B+",
    lastVisit: "2026-01-18",
    emergencyName: "Kwame Okonkwo",
    emergencyPhone: "+1 (404) 555-7700",
    emergencyRelation: "spouse",
  },
  {
    id: "p04",
    mrn: "MRN-2025-1201",
    prefix: "Mr.",
    given: "Liam",
    family: "O'Brien",
    birthDate: "2001-05-30",
    gender: "male",
    active: true,
    phone: "+1 (415) 555-3308",
    email: "liam.obrien@gmail.com",
    addressLine: "510 Mission St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94105",
    country: "US",
    bloodType: "AB-",
    allergies: "Aspirin",
    lastVisit: "2026-03-01",
    emergencyName: "Fiona O'Brien",
    emergencyPhone: "+1 (415) 555-4411",
    emergencyRelation: "parent",
  },
  {
    id: "p05",
    mrn: "MRN-2025-1289",
    prefix: "Mrs.",
    given: "Priya",
    family: "Nair",
    birthDate: "1984-09-12",
    gender: "female",
    active: true,
    phone: "+1 (206) 555-8820",
    email: "priya.nair@work.com",
    addressLine: "309 Pine Street",
    city: "Seattle",
    state: "WA",
    postalCode: "98101",
    country: "US",
    bloodType: "O-",
    lastVisit: "2026-02-14",
    emergencyName: "Arjun Nair",
    emergencyPhone: "+1 (206) 555-5544",
    emergencyRelation: "spouse",
  },
  {
    id: "p06",
    mrn: "MRN-2025-1356",
    given: "Robert",
    family: "Chen",
    birthDate: "1952-02-28",
    gender: "male",
    active: false,
    phone: "+1 (212) 555-1122",
    city: "New York",
    state: "NY",
    country: "US",
    bloodType: "A-",
    allergies: "Ibuprofen, Codeine",
    lastVisit: "2025-11-05",
    emergencyName: "Grace Chen",
    emergencyPhone: "+1 (212) 555-3344",
    emergencyRelation: "child",
  },
  {
    id: "p07",
    mrn: "MRN-2025-1421",
    prefix: "Ms.",
    given: "Fatima",
    family: "Al-Hassan",
    birthDate: "1997-12-01",
    gender: "female",
    active: true,
    phone: "+1 (713) 555-9090",
    email: "fatima.alhassan@email.com",
    addressLine: "1800 Main St",
    city: "Houston",
    state: "TX",
    postalCode: "77001",
    country: "US",
    bloodType: "B-",
    lastVisit: "2026-02-22",
    emergencyName: "Omar Al-Hassan",
    emergencyPhone: "+1 (713) 555-1234",
    emergencyRelation: "sibling",
  },
  {
    id: "p08",
    mrn: "MRN-2025-1499",
    prefix: "Mr.",
    given: "Samuel",
    family: "Johnson",
    birthDate: "1943-06-18",
    gender: "male",
    active: true,
    phone: "+1 (305) 555-4567",
    city: "Miami",
    state: "FL",
    country: "US",
    bloodType: "O+",
    allergies: "Warfarin (interaction risk)",
    lastVisit: "2026-01-30",
    emergencyName: "Dorothy Johnson",
    emergencyPhone: "+1 (305) 555-7890",
    emergencyRelation: "spouse",
  },
  {
    id: "p09",
    mrn: "MRN-2026-0012",
    prefix: "Ms.",
    given: "Yuna",
    family: "Kim",
    birthDate: "2003-08-14",
    gender: "female",
    active: true,
    phone: "+1 (503) 555-3344",
    email: "yuna.kim@student.edu",
    addressLine: "750 Morrison Ave",
    city: "Portland",
    state: "OR",
    postalCode: "97201",
    country: "US",
    bloodType: "AB+",
    lastVisit: "2026-03-03",
    emergencyName: "Jin-Ho Kim",
    emergencyPhone: "+1 (503) 555-7788",
    emergencyRelation: "parent",
  },
  {
    id: "p10",
    mrn: "MRN-2026-0031",
    prefix: "Mr.",
    given: "Carlos",
    family: "Reyes",
    birthDate: "1969-04-07",
    gender: "male",
    active: true,
    phone: "+1 (602) 555-6677",
    email: "c.reyes@company.com",
    addressLine: "2020 Desert Rd",
    city: "Phoenix",
    state: "AZ",
    postalCode: "85001",
    country: "US",
    bloodType: "A+",
    allergies: "NSAIDs",
    lastVisit: "2026-02-05",
    emergencyName: "Maria Reyes",
    emergencyPhone: "+1 (602) 555-9900",
    emergencyRelation: "spouse",
  },
  {
    id: "p11",
    mrn: "MRN-2025-1589",
    prefix: "Mrs.",
    given: "Helen",
    family: "Papadopoulos",
    birthDate: "1956-10-23",
    gender: "female",
    active: false,
    phone: "+1 (773) 555-2211",
    city: "Chicago",
    state: "IL",
    country: "US",
    bloodType: "B+",
    allergies: "Tetracycline",
    lastVisit: "2025-12-19",
  },
  {
    id: "p12",
    mrn: "MRN-2026-0058",
    given: "Noah",
    family: "Thompson",
    birthDate: "2015-01-17",
    gender: "male",
    active: true,
    phone: "+1 (617) 555-8833",
    city: "Boston",
    state: "MA",
    country: "US",
    bloodType: "O+",
    lastVisit: "2026-02-27",
    emergencyName: "Lisa Thompson",
    emergencyPhone: "+1 (617) 555-4422",
    emergencyRelation: "parent",
  },
];

// ── RJSF JSON Schema ─────────────────────────────────────────

const PATIENT_SCHEMA: RJSFSchema = {
  type: "object",
  required: ["given", "family", "birthDate", "gender"],
  properties: {
    mrn: { type: "string", title: "MRN" },
    active: { type: "boolean", title: "Active Patient", default: true },
    prefix: {
      type: "string",
      title: "Prefix",
      enum: ["", "Mr.", "Mrs.", "Ms.", "Dr.", "Prof."],
    },
    given: { type: "string", title: "First Name(s)" },
    family: { type: "string", title: "Last Name" },
    birthDate: { type: "string", title: "Date of Birth", format: "date" },
    gender: {
      type: "string",
      title: "Gender",
      enum: ["male", "female", "other", "unknown"],
      enumNames: ["Male", "Female", "Other", "Unknown"],
    },
    bloodType: {
      type: "string",
      title: "Blood Type",
      enum: ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    phone: { type: "string", title: "Phone" },
    email: { type: "string", title: "Email", format: "email" },
    addressLine: { type: "string", title: "Street Address" },
    city: { type: "string", title: "City" },
    state: { type: "string", title: "State / Province" },
    postalCode: { type: "string", title: "Postal Code" },
    country: { type: "string", title: "Country", default: "US" },
    emergencyName: { type: "string", title: "Contact Name" },
    emergencyPhone: { type: "string", title: "Contact Phone" },
    emergencyRelation: {
      type: "string",
      title: "Relationship",
      enum: [
        "",
        "spouse",
        "parent",
        "child",
        "sibling",
        "friend",
        "guardian",
        "other",
      ],
      enumNames: [
        "—",
        "Spouse",
        "Parent",
        "Child",
        "Sibling",
        "Friend",
        "Guardian",
        "Other",
      ],
    },
    allergies: { type: "string", title: "Known Allergies" },
    notes: { type: "string", title: "Clinical Notes" },
  },
};

const PATIENT_UI_SCHEMA: UiSchema = {
  "ui:order": [
    "mrn",
    "active",
    "prefix",
    "given",
    "family",
    "birthDate",
    "gender",
    "bloodType",
    "phone",
    "email",
    "addressLine",
    "city",
    "state",
    "postalCode",
    "country",
    "emergencyName",
    "emergencyPhone",
    "emergencyRelation",
    "allergies",
    "notes",
  ],
  mrn: { "ui:placeholder": "Auto-generated if empty" },
  prefix: { "ui:widget": "select", "ui:placeholder": "—" },
  given: { "ui:placeholder": "First name(s)" },
  family: { "ui:placeholder": "Last name" },
  birthDate: { "ui:widget": "date" },
  gender: { "ui:widget": "select" },
  bloodType: { "ui:widget": "select" },
  phone: { "ui:placeholder": "+1 (555) 000-0000" },
  email: { "ui:placeholder": "patient@email.com" },
  emergencyRelation: { "ui:widget": "select" },
  allergies: {
    "ui:widget": "textarea",
    "ui:options": { rows: 2 },
    "ui:placeholder": "e.g. Penicillin, Latex",
  },
  notes: {
    "ui:widget": "textarea",
    "ui:options": { rows: 3 },
    "ui:placeholder": "Clinical observations, history…",
  },
};

// ── Custom 2-column sectioned form template ───────────────────

interface SectionField {
  name: string;
  span: 1 | 2;
}
interface FormSection {
  title: string;
  fields: SectionField[];
}

const FORM_SECTIONS: FormSection[] = [
  {
    title: "Record",
    fields: [
      { name: "mrn", span: 2 },
      { name: "active", span: 1 },
    ],
  },
  {
    title: "Name",
    fields: [
      { name: "prefix", span: 1 },
      { name: "given", span: 1 },
      { name: "family", span: 2 },
    ],
  },
  {
    title: "Demographics",
    fields: [
      { name: "birthDate", span: 1 },
      { name: "gender", span: 1 },
      { name: "bloodType", span: 1 },
    ],
  },
  {
    title: "Contact",
    fields: [
      { name: "phone", span: 1 },
      { name: "email", span: 1 },
      { name: "addressLine", span: 2 },
      { name: "city", span: 1 },
      { name: "state", span: 1 },
      { name: "postalCode", span: 1 },
      { name: "country", span: 1 },
    ],
  },
  {
    title: "Emergency Contact",
    fields: [
      { name: "emergencyName", span: 1 },
      { name: "emergencyPhone", span: 1 },
      { name: "emergencyRelation", span: 1 },
    ],
  },
  {
    title: "Clinical",
    fields: [
      { name: "allergies", span: 2 },
      { name: "notes", span: 2 },
    ],
  },
];

function PatientFormTemplate({ properties }: ObjectFieldTemplateProps) {
  const fieldMap = new Map(properties.map((p) => [p.name, p.content]));

  return (
    <div>
      {FORM_SECTIONS.map((section) => (
        <div key={section.title}>
          <Divider orientation="horizontal" className="!mt-5 !mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              {section.title}
            </span>
          </Divider>
          <div className="grid grid-cols-2 gap-x-4">
            {section.fields.map(({ name, span }) => (
              <div
                key={name}
                className={span === 2 ? "col-span-2" : "col-span-1"}
              >
                {fieldMap.get(name)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Stat card component ───────────────────────────────────────

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
}

function StatCard({ label, value, sub, icon, iconBg }: StatCardProps) {
  return (
    <div className="rounded-2xl backdrop-blur-xl bg-white/60 dark:bg-slate-900/50 border border-white/70 dark:border-white/10 shadow-sm p-5 flex items-center gap-4">
      <div
        className={`flex items-center justify-center w-11 h-11 rounded-xl shrink-0 ${iconBg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5 m-0">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-800 dark:text-white leading-none m-0">
          {value}
        </p>
        {sub && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 m-0">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Constants ────────────────────────────────────────────────

const GENDER_COLOR: Record<string, string> = {
  male: "blue",
  female: "magenta",
  other: "purple",
  unknown: "default",
};

// ── Main component ────────────────────────────────────────────

function PatientsPage() {
  const [patients, setPatients] = useState<PatientRecord[]>(SEED);
  const [search, setSearch] = useState("");
  const [genderF, setGenderF] = useState("all");
  const [statusF, setStatusF] = useState("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<PatientRecord | null>(null);
  const [formData, setFormData] = useState<Partial<PatientRecord>>({});
  const [saving, setSaving] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: rjsf form ref
  const formRef = useRef<any>(null);
  const [msgApi, ctxHolder] = message.useMessage();

  // ── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return {
      total: patients.length,
      active: patients.filter((p) => p.active).length,
      recentVisit: patients.filter(
        (p) => p.lastVisit && new Date(p.lastVisit) >= cutoff,
      ).length,
      avgAge: Math.round(
        patients.reduce((s, p) => s + calcAge(p.birthDate), 0) /
          patients.length,
      ),
    };
  }, [patients]);

  // ── Filtered list ────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patients.filter((p) => {
      const matchQ =
        !q ||
        fullName(p).toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q);
      const matchG = genderF === "all" || p.gender === genderF;
      const matchS =
        statusF === "all" || (statusF === "active" ? p.active : !p.active);
      return matchQ && matchG && matchS;
    });
  }, [patients, search, genderF, statusF]);

  // ── Drawer actions ───────────────────────────────────────
  function openCreate() {
    setEditing(null);
    setFormData({ active: true });
    setDrawerOpen(true);
  }

  function openEdit(p: PatientRecord) {
    setEditing(p);
    setFormData({ ...p });
    setDrawerOpen(true);
  }

  function handleDelete(id: string) {
    setPatients((prev) => prev.filter((p) => p.id !== id));
    msgApi.success("Patient removed");
  }

  function handleSave(data: Partial<PatientRecord>) {
    setSaving(true);
    setTimeout(() => {
      if (editing) {
        setPatients((prev) =>
          prev.map((p) => (p.id === editing.id ? { ...p, ...data } : p)),
        );
        msgApi.success("Patient updated");
      } else {
        const next: PatientRecord = {
          ...(data as PatientRecord),
          id: `p-${Date.now()}`,
          mrn: data.mrn?.trim() || generateMRN(),
          lastVisit: new Date().toISOString().slice(0, 10),
        };
        setPatients((prev) => [next, ...prev]);
        msgApi.success("Patient created");
      }
      setSaving(false);
      setDrawerOpen(false);
    }, 350);
  }

  // ── Table columns ────────────────────────────────────────
  const columns: ColumnsType<PatientRecord> = [
    {
      title: "Patient",
      key: "patient",
      fixed: "left",
      width: 230,
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={36}
            style={{ backgroundColor: avatarColor(r.given), flexShrink: 0 }}
            className="font-semibold text-white text-sm"
          >
            {initials(r)}
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-gray-800 dark:text-gray-100 leading-tight truncate">
              {fullName(r)}
            </div>
            <Tag className="!m-0 !mt-0.5 !text-[10px] !px-1.5 !py-0 font-mono">
              {r.mrn}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: "Age / DOB",
      key: "dob",
      width: 120,
      sorter: (a, b) => a.birthDate.localeCompare(b.birthDate),
      render: (_, { birthDate }) => (
        <div>
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            {calcAge(birthDate)} yrs
          </span>
          <div className="text-xs text-gray-400 font-mono mt-0.5">
            {birthDate}
          </div>
        </div>
      ),
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
        { text: "Other", value: "other" },
        { text: "Unknown", value: "unknown" },
      ],
      onFilter: (v, r) => r.gender === v,
      render: (g: string) => (
        <Tag color={GENDER_COLOR[g] ?? "default"} className="capitalize">
          {g}
        </Tag>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      width: 200,
      render: (_, r) => (
        <div className="text-sm leading-relaxed">
          {r.phone && (
            <div className="text-gray-700 dark:text-gray-200">{r.phone}</div>
          )}
          {r.email && (
            <div className="text-xs text-gray-400 truncate max-w-[180px]">
              {r.email}
            </div>
          )}
          {!r.phone && !r.email && (
            <span className="text-gray-300 dark:text-gray-600">—</span>
          )}
        </div>
      ),
    },
    {
      title: "Location",
      key: "location",
      width: 140,
      render: (_, r) =>
        r.city ? (
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {[r.city, r.state].filter(Boolean).join(", ")}
          </span>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">—</span>
        ),
    },
    {
      title: "Blood",
      dataIndex: "bloodType",
      key: "bloodType",
      width: 80,
      render: (bt?: string) =>
        bt ? (
          <Tag color="red">{bt}</Tag>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">—</span>
        ),
    },
    {
      title: "Status",
      dataIndex: "active",
      key: "active",
      width: 100,
      filters: [
        { text: "Active", value: true },
        { text: "Inactive", value: false },
      ],
      onFilter: (v, r) => r.active === (v as boolean),
      render: (active: boolean) =>
        active ? (
          <Badge status="success" text="Active" />
        ) : (
          <Badge status="default" text="Inactive" />
        ),
    },
    {
      title: "Last Visit",
      dataIndex: "lastVisit",
      key: "lastVisit",
      width: 110,
      defaultSortOrder: "descend",
      sorter: (a, b) => (a.lastVisit ?? "").localeCompare(b.lastVisit ?? ""),
      render: (d?: string) =>
        d ? (
          <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
            {d}
          </span>
        ) : (
          <span className="text-gray-300 dark:text-gray-600">—</span>
        ),
    },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 76,
      render: (_, r) => (
        <div className="flex items-center gap-0.5">
          <Tooltip title="Edit patient">
            <Button
              type="text"
              size="small"
              icon={<Edit2 size={14} />}
              onClick={() => openEdit(r)}
            />
          </Tooltip>
          <Popconfirm
            title="Remove patient?"
            description="This action cannot be undone."
            onConfirm={() => handleDelete(r.id)}
            okText="Remove"
            okType="danger"
            placement="topRight"
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<Trash2 size={14} />}
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const tableProps: TableProps<PatientRecord> = {
    dataSource: filtered,
    columns,
    rowKey: "id",
    scroll: { x: 1160 },
    pagination: {
      pageSize: 10,
      showSizeChanger: true,
      showTotal: (total, [from, to]) => `${from}–${to} of ${total} patients`,
    },
    locale: {
      emptyText: (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="No patients match your filters"
        />
      ),
    },
    size: "middle",
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6 min-h-screen">
      {ctxHolder}

      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-white m-0 leading-tight">
            Patients
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 m-0">
            FHIR R4 · Patient registry
          </p>
        </div>
        <Button type="primary" icon={<Plus size={15} />} onClick={openCreate}>
          New Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Patients"
          value={stats.total}
          sub="registered records"
          icon={<Users size={20} className="text-blue-500" />}
          iconBg="bg-blue-50 dark:bg-blue-500/10"
        />
        <StatCard
          label="Active"
          value={stats.active}
          sub={`${stats.total - stats.active} inactive`}
          icon={<UserCheck size={20} className="text-green-500" />}
          iconBg="bg-green-50 dark:bg-green-500/10"
        />
        <StatCard
          label="Visits (30 days)"
          value={stats.recentVisit}
          sub="unique patients seen"
          icon={<Calendar size={20} className="text-purple-500" />}
          iconBg="bg-purple-50 dark:bg-purple-500/10"
        />
        <StatCard
          label="Average Age"
          value={`${stats.avgAge} yrs`}
          sub="across all patients"
          icon={<Stethoscope size={20} className="text-teal-500" />}
          iconBg="bg-teal-50 dark:bg-teal-500/10"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Input
          prefix={<Search size={14} className="text-gray-400" />}
          placeholder="Search by name, MRN, email, city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          allowClear
          className="max-w-xs"
        />
        <Select
          value={genderF}
          onChange={setGenderF}
          style={{ width: 134 }}
          options={[
            { value: "all", label: "All genders" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
            { value: "unknown", label: "Unknown" },
          ]}
        />
        <Select
          value={statusF}
          onChange={setStatusF}
          style={{ width: 134 }}
          options={[
            { value: "all", label: "All statuses" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
        />
        {(search || genderF !== "all" || statusF !== "all") && (
          <Text type="secondary" className="text-xs">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </Text>
        )}
      </div>

      {/* Table in glass card */}
      <div className="rounded-2xl overflow-hidden backdrop-blur-xl bg-white/60 dark:bg-slate-900/50 border border-white/70 dark:border-white/10 shadow-sm">
        <Table {...tableProps} />
      </div>

      {/* Create / Edit Drawer */}
      <Drawer
        title={editing ? `Edit — ${fullName(editing)}` : "New Patient"}
        width={600}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        destroyOnClose
        footer={
          <div className="flex justify-end gap-2">
            <Button onClick={() => setDrawerOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              loading={saving}
              icon={editing ? <Edit2 size={14} /> : <UserPlus size={14} />}
              onClick={() => formRef.current?.submit()}
            >
              {editing ? "Save Changes" : "Create Patient"}
            </Button>
          </div>
        }
      >
        <Form
          ref={formRef}
          schema={PATIENT_SCHEMA}
          uiSchema={PATIENT_UI_SCHEMA}
          formData={formData}
          validator={validator}
          templates={{ ObjectFieldTemplate: PatientFormTemplate }}
          onChange={({ formData: fd }) => setFormData(fd ?? {})}
          onSubmit={({ formData: fd }) => handleSave(fd ?? {})}
          noHtml5Validate
          showErrorList={false}
        >
          {/* Suppress RJSF's built-in submit button */}
          <div />
        </Form>
      </Drawer>
    </div>
  );
}
