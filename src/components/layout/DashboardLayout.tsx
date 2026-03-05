import { useState, useEffect } from "react";
import { ConfigProvider, Layout, Menu, Tag, Tooltip } from "antd";
import { theme as antdTheme } from "antd";
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
  Monitor,
  Moon,
  Pill,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Stethoscope,
  Sun,
  Syringe,
  TestTube2,
  UserCog,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "@tanstack/react-router";

const { Sider, Content } = Layout;

// ── Types ────────────────────────────────────────────────────
type AntdMenuItem = NonNullable<MenuProps["items"]>[number];
type ThemeMode = "light" | "dark" | "auto";

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

// ── Theme hook ───────────────────────────────────────────────
function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "auto";
    return (localStorage.getItem("theme") as ThemeMode) ?? "auto";
  });

  const [systemDark, setSystemDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isDark = mode === "dark" || (mode === "auto" && systemDark);

  const applyTheme = (next: ThemeMode) => {
    const resolved = next === "auto" ? (systemDark ? "dark" : "light") : next;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    if (next === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", next);
    root.style.colorScheme = resolved;
    localStorage.setItem("theme", next);
    setMode(next);
  };

  // Cycle: light → dark → auto → light
  const toggle = () => {
    const next: ThemeMode =
      mode === "light" ? "dark" : mode === "dark" ? "auto" : "light";
    applyTheme(next);
  };

  return { mode, isDark, toggle };
}

// ── Theme toggler button ─────────────────────────────────────
const THEME_META: Record<ThemeMode, { icon: React.ReactNode; label: string }> = {
  light: { icon: <Sun size={15} />,     label: "Light"  },
  dark:  { icon: <Moon size={15} />,    label: "Dark"   },
  auto:  { icon: <Monitor size={15} />, label: "System" },
};

function ThemeToggler({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) {
  const { icon, label } = THEME_META[mode];
  return (
    <Tooltip title={`${label} — click to cycle`} placement="bottomRight">
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle theme"
        className="
          flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer
          text-gray-500 dark:text-gray-300
          hover:bg-black/5 dark:hover:bg-white/10
          transition-colors duration-150
        "
      >
        {icon}
      </button>
    </Tooltip>
  );
}

// ── Glass panel shared tokens ────────────────────────────────
// Used with Antd's ConfigProvider to make internal backgrounds
// transparent so Tailwind glass classes take effect.
const GLASS_TOKENS: Parameters<typeof ConfigProvider>[0]["theme"] = {
  components: {
    Layout: {
      // Let the layout be see-through so the html gradient shows
      colorBgLayout: "transparent",
    },
    Menu: {
      itemBg: "transparent",
      subMenuItemBg: "rgba(0,0,0,0.025)",
      darkItemBg: "transparent",
      darkSubMenuItemBg: "rgba(255,255,255,0.04)",
    },
  },
};

// ── Component ────────────────────────────────────────────────
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode, isDark, toggle } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState<string[]>(() => {
    const parent = PARENT_KEY[location.pathname];
    return parent ? [parent] : [];
  });

  // Auto-expand parent submenu when route changes
  useEffect(() => {
    const parent = PARENT_KEY[location.pathname];
    if (parent && !openKeys.includes(parent)) {
      setOpenKeys((prev) => [...prev, parent]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ConfigProvider
      theme={{
        ...GLASS_TOKENS,
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout className="h-screen overflow-hidden">

        {/* ── Glass Sidebar ────────────────────────────── */}
        <Sider
          theme={isDark ? "dark" : "light"}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={240}
          collapsedWidth={64}
          className="
            h-screen sticky top-0 overflow-auto
            backdrop-blur-2xl
            border-r
            !bg-white/55 border-white/70
            dark:!bg-slate-950/45 dark:border-white/10
          "
        >
          {/* Top specular highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

          {/* Brand ─────────────────────────────────────── */}
          <div className="
            relative flex items-center gap-2.5 h-14 px-4
            shrink-0 overflow-hidden
            border-b border-black/5 dark:border-white/10
          ">
            {/* Logo mark */}
            <div className="
              flex items-center justify-center w-8 h-8 shrink-0
              rounded-xl
              bg-gradient-to-br from-teal-400 to-teal-600
              shadow-md shadow-teal-500/30
              ring-1 ring-teal-500/30 dark:ring-teal-400/20
            ">
              <HeartPulse size={15} color="white" strokeWidth={2.5} />
            </div>

            {!collapsed && (
              <div className="flex flex-col leading-none select-none">
                <span className="font-bold text-[15px] text-gray-800 dark:text-white/90 tracking-tight">
                  Clini
                </span>
                <span className="text-[9px] uppercase tracking-[0.12em] mt-0.5 font-semibold text-gray-400 dark:text-white/25">
                  FHIR R4
                </span>
              </div>
            )}
          </div>

          {/* Navigation menu ───────────────────────────── */}
          <Menu
            theme={isDark ? "dark" : "light"}
            mode="inline"
            selectedKeys={[location.pathname]}
            openKeys={collapsed ? [] : openKeys}
            onOpenChange={setOpenKeys}
            inlineCollapsed={collapsed}
            items={MENU_ITEMS}
            className="mt-1.5 !border-none"
            onSelect={({ key }) => {
              // biome-ignore lint/suspicious/noExplicitAny: routes added incrementally
              navigate({ to: key as any });
            }}
          />
        </Sider>

        {/* ── Main area ────────────────────────────────── */}
        <Layout className="flex flex-col h-full overflow-hidden">

          {/* ── Glass Header ─────────────────────────── */}
          <header className="
            relative sticky top-0 z-50
            flex items-center justify-between
            h-14 px-6
            backdrop-blur-xl
            border-b shadow-sm shadow-black/[0.04] dark:shadow-black/20
            bg-white/50 border-white/70
            dark:bg-slate-950/50 dark:border-white/10
          ">
            {/* Specular highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

            {/* Left slot — breadcrumbs / page title will live here */}
            <div />

            {/* Right slot — global actions */}
            <div className="flex items-center gap-1">
              <ThemeToggler mode={mode} onToggle={toggle} />
            </div>
          </header>

          {/* Page content */}
          <Content className="flex-1 overflow-y-auto">
            {children}
          </Content>

          {/* ── Glass Footer ─────────────────────────── */}
          <footer className="
            relative flex items-center justify-between flex-wrap gap-2
            px-6 py-2.5
            backdrop-blur-xl
            border-t
            bg-white/40 border-white/60
            dark:bg-slate-950/40 dark:border-white/10
          ">
            {/* Specular highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />

            {/* Left: copyright */}
            <span className="text-xs text-gray-400 dark:text-white/25">
              © {new Date().getFullYear()} Clini — All rights reserved
            </span>

            {/* Centre: compliance badges */}
            <div className="flex items-center gap-1.5">
              <Tag color="cyan"  className="!m-0 font-mono text-[11px]">HL7 FHIR® R4</Tag>
              <Tag color="green" className="!m-0 text-[11px]">Compliant</Tag>
            </div>

            {/* Right: version */}
            <span className="text-xs font-mono text-gray-400 dark:text-white/20">
              v0.1.0
            </span>
          </footer>

        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
