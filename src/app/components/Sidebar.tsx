import { motion } from "motion/react";
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  BarChart3,
  Brain,
  LogOut,
} from "lucide-react";
import { LogoLockup } from "./LogoLockup";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const navItems = [
  { id: "projects", icon: LayoutDashboard, label: "Projects" },
  { id: "teams", icon: Users, label: "Teams" },
  { id: "insights", icon: BarChart3, label: "Insights" },
];

export function Sidebar({ currentPage, onNavigate, onLogout }: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-[rgba(0,0,0,0.08)] flex flex-col h-screen">
      <div className="p-6 border-b border-[rgba(0,0,0,0.08)]">
        <LogoLockup size="sm" />
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || 
            (currentPage.startsWith("project-") && item.id === "projects");
          
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                isActive
                  ? "text-[#2D4B9E] bg-[#EEF2FF]"
                  : "text-[#6B7280] hover:bg-[#F8F9FA]"
              }`}
              whileHover={{ x: 2 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#2D4B9E] rounded-r"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                />
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gradient-to-r from-[#EEF2FF] to-[#F3E8FF] rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-[#5B75D8] to-[#8B5CF6] rounded-full flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1A1D2E]">AI Memory Active</p>
            <p className="text-xs text-[#6B7280]">Learning enabled</p>
          </div>
        </div>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#6B7280] hover:bg-[#F8F9FA] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
