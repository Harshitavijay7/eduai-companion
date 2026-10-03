import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { TopNav } from "@/components/top-nav";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

function AppLayout() {
  const isChat = useRouterState({ select: (state) => state.location.pathname === "/app/chat" });

  if (isChat) {
    return <main className="h-dvh min-h-0 w-full overflow-hidden bg-background"><Outlet /></main>;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <SidebarInset className="flex min-w-0 flex-1 flex-col bg-transparent">
          <TopNav />
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
