"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ChairmanLoginPage() {
  const [username, setUsername] = useState("") // changed email to username
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    setTimeout(() => {
      if (!username.trim() || !password.trim()) {
        // changed email to username
        setError("Please fill in all fields")
        setIsLoading(false)
        return
      }

      // Demo credentials
      if (username === "srinivas" && password === "srinivas123") {
        const chairmanData = {
          id: "chairman-1",
          username: username,
          fullName: "Dr (H.C) P Srinivas",
          role: "chairman",
          loginTime: new Date(),
        }
        localStorage.setItem("pssChairman", JSON.stringify(chairmanData))
        window.location.href = "/admin"
      } else {
        setError("Invalid username or password")
        setIsLoading(false)
      }
    }, 1000)
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
            <h1 className="font-playfair text-2xl font-bold text-foreground">Chairman Login</h1>
            <p className="text-muted-foreground mt-2">Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">{error}</div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-foreground">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border-border focus:border-primary"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-foreground">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-border focus:border-primary"
                disabled={isLoading}
              />
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
                Username: <span className="font-mono font-bold">srinivas</span>
              </p>
              <p>
                Password: <span className="font-mono font-bold">srinivas123</span>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            <Link href="/login" className="text-primary hover:underline font-semibold">
              Student Login
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
