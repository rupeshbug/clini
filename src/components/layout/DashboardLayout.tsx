import { useState, useEffect } from "react";
import { Layout, Menu, Tag } from "antd";
import type { MenuProps } from "antd";
import {
  Activity,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardList,
  FileText,
  FlaskConical,
  HeartPulse,
  LayoutDashboard,
  Pill,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  Syringe,
  TestTube2,
  UserCog,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";

const { Sider, Content } = Layout;

// ── Types ────────────────────────────────────────────────────
type AntdMenuItem = NonNullable<MenuProps["items"]>[number];

// ── Menu item factory ────────────────────────────────────────
function nav(
  key: string,
  label: string,
  icon: React.ReactNode,
  children?: AntdMenuItem[],
): AntdMenuItem {
  return { key, label, icon, children } as AntdMenuItem;
}

// ── Navigation tree (FHIR resource-aligned) ──────────────────
const MENU_ITEMS: MenuProps["items"] = [
  nav("/", "Dashboard", <LayoutDashboard size={16} />),
  nav("/patients", "Patients", <Users size={16} />),

  { type: "divider" },

  nav("clinical", "Clinical", <Stethoscope size={16} />, [
    nav("/encounters", "Encounters", <CalendarDays size={16} />),    // Encounter
    nav("/conditions", "Conditions", <HeartPulse size={16} />),      // Condition
    nav("/observations", "Observations", <Activity size={16} />),    // Observation
    nav("/procedures", "Procedures", <Syringe size={16} />),         // Procedure
  ]),

  nav("medications", "Medications", <Pill size={16} />, [
    nav("/prescriptions", "Prescriptions", <ClipboardList size={16} />),   // MedicationRequest
    nav("/medications/catalog", "Drug Catalog", <BookOpen size={16} />),   // Medication
  ]),

  nav("diagnostics", "Diagnostics", <FlaskConical size={16} />, [
    nav("/reports", "Lab Reports", <TestTube2 size={16} />),         // DiagnosticReport
    nav("/documents", "Documents", <FileText size={16} />),          // DocumentReference
  ]),

  { type: "divider" },

  nav("care-team", "Care Team", <UserCog size={16} />, [
    nav("/practitioners", "Practitioners", <Stethoscope size={16} />),  // Practitioner
    nav("/organizations", "Organizations", <Building2 size={16} />),    // Organization
  ]),

  nav("admin", "Administration", <Settings size={16} />, [
    nav("/audit", "Audit Log", <ShieldCheck size={16} />),               // AuditEvent
    nav("/settings", "Settings", <SlidersHorizontal size={16} />),
  ]),
];

// ── Map leaf path → parent submenu key ───────────────────────
const PARENT_KEY: Record<string, string> = {
  "/encounters": "clinical",
  "/conditions": "clinical",
  "/observations": "clinical",
  "/procedures": "clinical",
  "/prescriptions": "medications",
  "/medications/catalog": "medications",
  "/reports": "diagnostics",
  "/documents": "diagnostics",
  "/practitioners": "care-team",
  "/organizations": "care-team",
  "/audit": "admin",
  "/settings": "admin",
};

// ── Component ────────────────────────────────────────────────
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const parent = PARENT_KEY[location.pathname];
    return parent ? [parent] : [];
  });

  // Auto-expand parent submenu on route change
  useEffect(() => {
    const parent = PARENT_KEY[location.pathname];
    if (parent && !openKeys.includes(parent)) {
      setOpenKeys((prev) => [...prev, parent]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <Layout className="min-h-screen">

      {/* ── Sidebar ─────────────────────────────────────── */}
      <Sider
        theme="dark"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={240}
        collapsedWidth={64}
        className="overflow-auto h-screen sticky top-0"
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 h-14 px-4 shrink-0 overflow-hidden border-b border-white/10">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500 shrink-0">
            <HeartPulse size={15} color="white" strokeWidth={2.5} />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-bold text-white text-[15px]">Clini</span>
              <span className="text-[9px] text-white/30 uppercase tracking-widest mt-0.5">
                FHIR R4
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          openKeys={collapsed ? [] : openKeys}
          onOpenChange={setOpenKeys}
          inlineCollapsed={collapsed}
          items={MENU_ITEMS}
          className="mt-1.5"
          onSelect={({ key }) => {
            // biome-ignore lint/suspicious/noExplicitAny: routes added incrementally
            navigate({ to: key as any });
          }}
        />
      </Sider>

      {/* ── Main area ───────────────────────────────────── */}
      <Layout className="flex flex-col min-h-screen">
        <Content className="flex-1">
          {children}
        </Content>

        {/* ── Footer ──────────────────────────────────────── */}
        <footer className="flex items-center justify-between flex-wrap gap-2 px-6 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <span className="text-xs text-gray-400 dark:text-gray-600">
            © {new Date().getFullYear()} Clini — All rights reserved
          </span>

          <div className="flex items-center gap-1.5">
            <Tag color="cyan" className="!m-0 font-mono text-[11px]">
              HL7 FHIR® R4
            </Tag>
            <Tag color="green" className="!m-0 text-[11px]">
              Compliant
            </Tag>
          </div>

          <span className="text-xs text-gray-400 dark:text-gray-600 font-mono">
            v0.1.0
          </span>
        </footer>
      </Layout>
    </Layout>
  );
}
