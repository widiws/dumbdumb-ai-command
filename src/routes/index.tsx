import { createFileRoute } from "@tanstack/react-router";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DashboardContent } from "@/components/DashboardContent";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DumbDumb Corp AI — Command Center" },
      { name: "description", content: "AI Corporation Command Center untuk mengelola agent AI, task otomatis, trading bot, dan workflow bisnis dalam satu dashboard." },
      { property: "og:title", content: "DumbDumb Corp AI — Command Center" },
      { property: "og:description", content: "Build. Monitor. Automate. Pusat kendali pasukan AI-mu." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <DashboardHeader />
        <DashboardContent />
      </div>
    </div>
  );
}
