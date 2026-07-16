import { useState } from "react";
import { motion } from "motion/react";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  BarChart3,
  AlertCircle,
  FolderOpen,
  MessageSquare,
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react";
import { DashboardOverview } from "@/components/shared/dashboard/DashboardOverview";
import { CampaignStatus } from "@/components/shared/dashboard/CampaignStatus";
import { BudgetTracking } from "@/components/shared/dashboard/BudgetTracking";
import { Analytics } from "@/components/shared/dashboard/Analytics";
import { EscalationMatrix } from "@/components/shared/dashboard/EscalationMatrix";
import { FileManagement } from "@/components/shared/dashboard/FileManagement";
import { Communication } from "@/components/shared/dashboard/Communication";

type Section = "overview" | "status" | "budget" | "analytics" | "escalation" | "files" | "communication";

export function ClientDashboard() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: "overview" as Section, label: "Dashboard", icon: LayoutDashboard },
    { id: "status" as Section, label: "Campaign Status", icon: TrendingUp },
    { id: "budget" as Section, label: "Budget & Finance", icon: Wallet },
    { id: "analytics" as Section, label: "Analytics", icon: BarChart3 },
    { id: "escalation" as Section, label: "Escalation Matrix", icon: AlertCircle },
    { id: "files" as Section, label: "Files & Assets", icon: FolderOpen },
    { id: "communication" as Section, label: "Communication", icon: MessageSquare },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <DashboardOverview />;
      case "status":
        return <CampaignStatus />;
      case "budget":
        return <BudgetTracking />;
      case "analytics":
        return <Analytics />;
      case "escalation":
        return <EscalationMatrix />;
      case "files":
        return <FileManagement />;
      case "communication":
        return <Communication />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-[100dvh] flex flex-col p-4 md:p-6 lg:p-8">
      {/* Top Navigation Pill */}
      <header className="sticky top-4 z-50 flex items-center justify-between bg-white/60 backdrop-blur-xl border border-white/40 shadow-sm rounded-full px-4 lg:px-6 py-3 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-xl">V</span>
          </div>
          <span className="font-bold text-lg text-primary hidden md:block">CODEVATE</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/40 backdrop-blur-md rounded-full p-1 shadow-inner overflow-x-auto max-w-2xl">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center whitespace-nowrap gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-md"
                    : "text-foreground hover:bg-white/60 hover:text-primary"
                }`}
              >
                {isActive ? <item.icon className="w-4 h-4" /> : null}
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <button className="relative p-2 text-foreground hover:bg-white/60 rounded-full transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
          </button>
          
          <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center cursor-pointer border border-white/60 shadow-sm overflow-hidden">
            <img src="https://avatar.iran.liara.run/public/boy?username=saif" alt="saif" className="w-full h-full object-cover" />
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-white/60 rounded-full transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-4 top-24 z-40 bg-white/80 backdrop-blur-xl border border-white/40 shadow-lg rounded-[32px] p-4 flex flex-col gap-2 max-h-[70vh] overflow-y-auto">
          {menuItems.map((item) => {
             const isActive = activeSection === item.id;
             return (
               <button
                 key={item.id}
                 onClick={() => {
                   setActiveSection(item.id);
                   setMobileMenuOpen(false);
                 }}
                 className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-medium transition w-full text-left ${
                   isActive
                     ? "bg-primary text-white"
                     : "text-foreground hover:bg-white/60"
                 }`}
               >
                 <item.icon className="w-5 h-5" />
                 {item.label}
               </button>
             );
          })}
          <button
            className="flex items-center gap-3 px-4 py-3 mt-2 text-destructive hover:bg-red-50 rounded-2xl font-medium transition w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 w-full mx-auto relative z-10">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>
    </div>
  );
}

