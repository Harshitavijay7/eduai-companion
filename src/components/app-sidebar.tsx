import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Upload, Library, MessageSquare, FileText, ListChecks,
  Layers, Trophy, ScanText, Sigma, Code2, BarChart3, History, Settings, LogOut,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";

const main = [
  { title: "Dashboard", url: "/app", icon: LayoutDashboard, exact: true },
  { title: "Upload PDF", url: "/app/upload", icon: Upload },
  { title: "My Library", url: "/app/library", icon: Library },
  { title: "AI Chat", url: "/app/chat", icon: MessageSquare },
];
const generate = [
  { title: "Notes", url: "/app/notes", icon: FileText },
  { title: "MCQs", url: "/app/mcqs", icon: ListChecks },
  { title: "Flashcards", url: "/app/flashcards", icon: Layers },
  { title: "Quiz", url: "/app/quiz", icon: Trophy },
];
const tools = [
  { title: "OCR", url: "/app/ocr", icon: ScanText },
  { title: "Formula Extractor", url: "/app/formulas", icon: Sigma },
  { title: "Code Extractor", url: "/app/code", icon: Code2 },
];
const insights = [
  { title: "Analytics", url: "/app/analytics", icon: BarChart3 },
  { title: "History", url: "/app/history", icon: History },
  { title: "Settings", url: "/app/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });

  const isActive = (url: string, exact?: boolean) =>
    exact ? path === url : path === url || path.startsWith(url + "/");

  const renderGroup = (label: string, items: typeof main) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/70">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url, item.exact);
            return (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link to={item.url} className={`flex items-center gap-3 rounded-lg transition ${active ? "gradient-bg text-white shadow-md" : "hover:bg-sidebar-accent"}`}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="text-sm">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-3">
        <Logo compact={collapsed} />
      </SidebarHeader>
      <SidebarContent className="px-2">
        {renderGroup("Overview", main)}
        {renderGroup("Generate", generate)}
        {renderGroup("Tools", tools)}
        {renderGroup("Insights", insights)}
      </SidebarContent>
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout">
              <Link to="/login" className="flex items-center gap-3 rounded-lg hover:bg-sidebar-accent">
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="text-sm">Logout</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
