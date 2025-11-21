"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Menu, X, ChevronLeft } from "lucide-react"

interface SidebarNavProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  const [isOpen, setIsOpen] = useState(true)

  const navItems = [
    { id: "details", label: "Details", icon: "📋" },
    { id: "scholarships", label: "Scholarships", icon: "🎓" },
    { id: "mentorship", label: "Mentorship", icon: "👥" },
    { id: "resources", label: "Resources", icon: "📚" },
    { id: "career", label: "Career Support", icon: "💼" },
    { id: "support", label: "Support", icon: "💬" },
  ]

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-30 bg-primary text-white p-2 rounded-lg"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:relative top-0 left-0 h-screen bg-white border-r border-border transition-all duration-300 z-20 flex flex-col",
          isOpen ? "w-64 md:w-64" : "w-0 md:w-20",
          "md:top-[73px]",
        )}
      >
        {/* Collapse Button - Desktop Only */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex items-center justify-center h-12 border-b border-border hover:bg-muted transition-colors"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft className={cn("w-5 h-5 text-primary transition-transform", !isOpen && "rotate-180")} />
        </button>

        {/* Navigation Items */}
        <nav className={cn("flex-1 p-4 space-y-2 overflow-y-auto", !isOpen && "md:p-0 md:space-y-0")}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id)
                setIsOpen(false)
              }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3",
                "md:flex-col md:items-center md:gap-1 md:py-4 md:px-2",
                !isOpen && "md:rounded-none",
                activeTab === item.id
                  ? "bg-primary text-white font-semibold md:bg-blue-100 md:text-primary"
                  : "text-foreground hover:bg-muted md:hover:bg-muted",
              )}
              title={!isOpen ? item.label : ""}
            >
              <span className={cn("text-lg md:text-2xl", !isOpen && "md:text-xl")}>{item.icon}</span>
              <span className={cn("md:hidden text-sm", !isOpen && "hidden")}>{item.label}</span>
              {isOpen && (
                <span className="hidden md:inline text-xs font-medium text-center leading-tight">{item.label}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 md:hidden z-10 mt-20" onClick={() => setIsOpen(false)} />}
    </>
  )
}
