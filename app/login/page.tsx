"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  const [studentName, setStudentName] = useState("")
  const [trustId, setTrustId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!studentName.trim() || !trustId.trim()) {
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      if (trustId.length !== 8 || !/^\d+$/.test(trustId)) {
        setError("Trust ID must be 8 digits")
        setIsLoading(false)
        return
      }

      // Call the login API to verify credentials from Supabase
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentName: studentName.trim(), trustId }),
      })

      const result = await response.json()

      if (!result.success) {
        setError("Invalid credentials. Please check your name and Trust ID.")
        setIsLoading(false)
        return
      }

      // Store student data in localStorage for session
      localStorage.setItem("pssUser", JSON.stringify(result.data))

      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-playfair font-bold text-lg text-primary block">PSS</span>
              <span className="text-xs text-muted-foreground">Social Welfare</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </nav>
      </header>

      {/* Login Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <Image
              src="/images/pss-logo.png"
              alt="PSS Logo"
              width={80}
              height={80}
              className="w-20 h-20 mx-auto mb-4"
            />
            <h1 className="font-playfair text-2xl font-bold text-foreground">PSS Login</h1>
            <p className="text-muted-foreground mt-2">Student & Chairman Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            {/* Student Name Field */}
            <div className="space-y-2">
              <label htmlFor="studentName" className="block text-sm font-medium text-foreground">
                Student Name
              </label>
              <Input
                id="studentName"
                type="text"
                placeholder="e.g., Praveen Kumar"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full border-border focus:border-primary"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">Enter your full name as registered</p>
            </div>

            {/* Trust ID Field */}
            <div className="space-y-2">
              <label htmlFor="trustId" className="block text-sm font-medium text-foreground">
                Trust ID
              </label>
              <Input
                id="trustId"
                type="text"
                placeholder="e.g., 23301054"
                value={trustId}
                onChange={(e) => setTrustId(e.target.value.replace(/\D/g, ""))}
                maxLength={8}
                className="w-full border-border focus:border-primary"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">8-digit Trust ID number</p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2"
            >
              {isLoading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-muted-foreground">Demo Credentials</span>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 space-y-2 text-sm">
            <p className="font-semibold text-blue-900">Try these credentials:</p>
            <div className="space-y-1 text-blue-800">
              <p>
                Name: <span className="font-mono font-bold">Sunkari Praveen Kumar</span>
              </p>
              <p>
                Trust ID: <span className="font-mono font-bold">23301054</span>
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Not registered yet?{" "}
            <Link href="/" className="text-primary hover:underline font-semibold">
              Contact PSS
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
