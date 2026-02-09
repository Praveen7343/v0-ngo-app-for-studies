"use client"

import { useState, useEffect } from "react"
import { SettingsNav } from "@/components/settings-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("appearance")
  const { theme, setTheme } = useTheme()
  const [fontSize, setFontSize] = useState("medium")
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const pssUser = localStorage.getItem("pssUser")
    if (pssUser) {
      setUser(JSON.parse(pssUser))
    }

    // Load font size from localStorage
    const savedFontSize = localStorage.getItem("pssFontSize") || "medium"
    setFontSize(savedFontSize)
    applyFontSize(savedFontSize)
  }, [])

  const applyFontSize = (size: string) => {
    const root = document.documentElement
    if (size === "small") root.style.fontSize = "14px"
    else if (size === "large") root.style.fontSize = "18px"
    else root.style.fontSize = "16px"
  }

  const handleFontSizeChange = (value: string) => {
    setFontSize(value)
    applyFontSize(value)
    localStorage.setItem("pssFontSize", value)
    toast.success("Font settings updated")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8">
        <aside>
          <SettingsNav activeSection={activeSection} setActiveSection={setActiveSection} />
        </aside>

        <div className="space-y-6">
          {activeSection === "appearance" && (
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how PSS Trust looks on your device.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Theme</Label>
                    <p className="text-sm text-muted-foreground">Switch between light and dark mode.</p>
                  </div>
                  <Select value={theme || "system"} onValueChange={(value) => {
                    setTheme(value)
                    toast.success(`Theme changed to ${value}`)
                  }}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "password" && (
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Keep your account secure with a strong password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
                <Button className="w-full md:w-auto">Update Password</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Additional security measures for your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Biometric Login</Label>
                    <p className="text-sm text-muted-foreground">Enable FaceID or Fingerprint authentication.</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between border-t pt-6">
                  <div className="space-y-0.5">
                    <Label>Session Timeout</Label>
                    <p className="text-sm text-muted-foreground">Automatically logout after inactivity.</p>
                  </div>
                  <Select defaultValue="30">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "font" && (
            <Card>
              <CardHeader>
                <CardTitle>Font Settings</CardTitle>
                <CardDescription>Adjust text size for better readability.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Text Size</Label>
                    <p className="text-sm text-muted-foreground">Make text smaller or larger across the app.</p>
                  </div>
                  <Select value={fontSize} onValueChange={handleFontSizeChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium (Default)</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "privacy" && (
            <Card>
              <CardHeader>
                <CardTitle>Privacy and Permissions</CardTitle>
                <CardDescription>Manage how we use your data and device sensors.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Camera Access</Label>
                    <p className="text-sm text-muted-foreground">Required for face-verified attendance.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">Granted</span>
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  </div>
                </div>
                <div className="border-t pt-6">
                  <Label>Data Usage Information</Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    We only store your face signature for attendance purposes. Your data is encrypted and never shared
                    with third parties.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
