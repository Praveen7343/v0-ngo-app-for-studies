"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface UserData {
  studentName: string
  trustId: string
  fatherName?: string
  motherName?: string
  dateOfBirth?: string
  gender?: string
  mobileNumber?: string
  emailId?: string
  address?: string
  qualification?: string
  branch?: string
  pin?: string
  ssc?: {
    schoolName: string
    board: string
    yearOfPassing: string
    percentage: string
  }
  diploma?: {
    collegeName: string
    branch: string
    yearOfStudying: string
    pinNumber: string
    percentage: string
  }
}

export default function EditProfilePage() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [formData, setFormData] = useState<UserData | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem("pssUser")
    if (!userStr) {
      window.location.href = "/login"
      return
    }
    const userData = JSON.parse(userStr)
    setUser(userData)
    setFormData(userData)
    setIsLoading(false)
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    section?: string,
    field?: string,
  ) => {
    if (!formData) return

    const { name, value } = e.target

    if (section && field) {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section as keyof UserData],
          [field]: value,
        },
      } as UserData)
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSave = () => {
    if (!formData) return
    setIsSaving(true)
    setTimeout(() => {
      localStorage.setItem("pssUser", JSON.stringify(formData))
      alert("Profile updated successfully!")
      window.location.href = "/dashboard"
    }, 500)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!formData) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border sticky top-0 z-40">
        <nav className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">Back to Dashboard</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="font-playfair text-3xl font-bold text-foreground mb-2">Edit Profile</h1>
          <p className="text-muted-foreground mb-8">Update your academic details and personal information</p>

          {/* Section 1: Personal Details */}
          <div className="mb-10 pb-8 border-b border-border">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-6">1. Personal Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Student Name</label>
                <Input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Trust ID</label>
                <Input
                  type="text"
                  name="trustId"
                  value={formData.trustId}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Father's Name</label>
                <Input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName || ""}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  placeholder="Enter father's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mother's Name</label>
                <Input
                  type="text"
                  name="motherName"
                  value={formData.motherName || ""}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  placeholder="Enter mother's name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                <Input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mobile Number</label>
                <Input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber || ""}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email ID</label>
                <Input
                  type="email"
                  name="emailId"
                  value={formData.emailId || ""}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  placeholder="Enter email address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="border-border focus:border-primary"
                  placeholder="Enter your address"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Details */}
          <div className="mb-10">
            <h2 className="font-playfair text-xl font-bold text-foreground mb-6">2. Academic Details (Year-Wise)</h2>

            {/* SSC / 10th Class */}
            <div className="mb-10 pb-8 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">SSC / 10th Class</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">School Name</label>
                  <Input
                    type="text"
                    placeholder="Enter school name"
                    value={formData.ssc?.schoolName || ""}
                    onChange={(e) => handleInputChange(e, "ssc", "schoolName")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Board</label>
                  <Input
                    type="text"
                    placeholder="e.g., CBSE, State Board"
                    value={formData.ssc?.board || ""}
                    onChange={(e) => handleInputChange(e, "ssc", "board")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Year of Passing</label>
                  <Input
                    type="text"
                    placeholder="e.g., 2020"
                    value={formData.ssc?.yearOfPassing || ""}
                    onChange={(e) => handleInputChange(e, "ssc", "yearOfPassing")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Percentage/CGPA</label>
                  <Input
                    type="text"
                    placeholder="e.g., 85%"
                    value={formData.ssc?.percentage || ""}
                    onChange={(e) => handleInputChange(e, "ssc", "percentage")}
                    className="border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Diploma */}
            <div className="pb-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">Diploma</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">College Name</label>
                  <Input
                    type="text"
                    placeholder="Enter college name"
                    value={formData.diploma?.collegeName || ""}
                    onChange={(e) => handleInputChange(e, "diploma", "collegeName")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Branch</label>
                  <Input
                    type="text"
                    placeholder="e.g., Cyber Security"
                    value={formData.diploma?.branch || ""}
                    onChange={(e) => handleInputChange(e, "diploma", "branch")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Year of Studying</label>
                  <Input
                    type="text"
                    placeholder="e.g., Final Year"
                    value={formData.diploma?.yearOfStudying || ""}
                    onChange={(e) => handleInputChange(e, "diploma", "yearOfStudying")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">PIN Number</label>
                  <Input
                    type="text"
                    placeholder="e.g., 23054-cps-050"
                    value={formData.diploma?.pinNumber || ""}
                    onChange={(e) => handleInputChange(e, "diploma", "pinNumber")}
                    className="border-border focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Percentage (Till Now)</label>
                  <Input
                    type="text"
                    placeholder="e.g., 78%"
                    value={formData.diploma?.percentage || ""}
                    onChange={(e) => handleInputChange(e, "diploma", "percentage")}
                    className="border-border focus:border-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-border">
            <Button variant="outline" asChild className="bg-transparent">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
