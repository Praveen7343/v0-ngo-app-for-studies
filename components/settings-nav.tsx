"use client"

import { cn } from "@/lib/utils"
import { Palette, Lock, ShieldCheck, Type, Eye, LogOut } from "lucide-react"

const settingsOptions = [
  { id: "appearance", label: "Appearance", icon: Palette, description: "Theme and colors" },
  { id: "password", label: "Change Password", icon: Lock, description: "Update your security" },
  { id: "security", label: "Security", icon: ShieldCheck, description: "Session and biometrics" },
  { id: "font", label: "Font Settings", icon: Type, description: "Size and style" },
  { id: "privacy", label: "Privacy", icon: Eye, description: "Data and permissions" },
]

interface SettingsNavProps {
  activeSection: string
  setActiveSection: (id: string) => void
}

export function SettingsNav({ activeSection, setActiveSection }: SettingsNavProps) {
  return (
    <nav className="space-y-1">
      {settingsOptions.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors",
            activeSection === item.id
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <div className="text-left">
            <p className="font-semibold">{item.label}</p>
            <p
              className={cn(
                "text-[10px] mt-0.5",
                activeSection === item.id ? "text-primary-foreground/80" : "text-muted-foreground",
              )}
            >
              {item.description}
            </p>
          </div>
        </button>
      ))}
      <div className="pt-4 mt-4 border-t border-border">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-semibold">Logout from all devices</span>
        </button>
      </div>
    </nav>
  )
}
