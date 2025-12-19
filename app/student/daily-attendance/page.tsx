"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Camera, CheckCircle2, Clock, Delete, AlertCircle } from "lucide-react"

type Step = "dialpad" | "face-capture" | "success"
type AttendanceType = "first-checkin" | "second-checkin" | "complete"

export default function DailyAttendancePage() {
  const [step, setStep] = useState<Step>("dialpad")
  const [trustId, setTrustId] = useState("")
  const [studentData, setStudentData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isCapturing, setIsCapturing] = useState(false)
  const [attendanceType, setAttendanceType] = useState<AttendanceType>("first-checkin")
  const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Dial pad buttons
  const dialButtons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"]

  const handleDialPress = (value: string) => {
    if (value === "⌫") {
      setTrustId((prev) => prev.slice(0, -1))
    } else if (value && trustId.length < 15) {
      setTrustId((prev) => prev + value)
    }
  }

  const handleVerifyTrustId = async () => {
    if (!trustId.trim()) {
      setError("Please enter your Trust ID")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/student/attendance/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trustId: trustId.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Student not found")
        return
      }

      setStudentData(data.student)
      setAttendanceType(data.attendanceType)
      setLastCheckInTime(data.lastCheckIn ? new Date(data.lastCheckIn) : null)
      setStep("face-capture")
    } catch {
      setError("Failed to verify Trust ID. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
        // Simulate face detection after 2 seconds
        setTimeout(() => setFaceDetected(true), 2000)
      }
    } catch (err) {
      setError("Unable to access camera. Please grant camera permissions.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsCapturing(true)
    const canvas = canvasRef.current
    const video = videoRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.drawImage(video, 0, 0)
      const imageData = canvas.toDataURL("image/jpeg")

      // Submit attendance
      try {
        const response = await fetch("/api/student/attendance/mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trustId: trustId.trim(),
            faceImage: imageData,
            attendanceType,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to mark attendance")
          setIsCapturing(false)
          return
        }

        stopCamera()
        setStep("success")
      } catch {
        setError("Failed to mark attendance. Please try again.")
      } finally {
        setIsCapturing(false)
      }
    }
  }

  const handleReset = () => {
    setStep("dialpad")
    setTrustId("")
    setStudentData(null)
    setError("")
    setFaceDetected(false)
    stopCamera()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-bold text-lg text-primary block">PSS Trust</span>
              <span className="text-xs text-muted-foreground">Daily Attendance</span>
            </div>
          </Link>
          <Link href="/">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {step === "dialpad" && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Mark Your Attendance</CardTitle>
              <CardDescription>Enter your Trust ID to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Trust ID Display */}
              <div className="bg-gray-100 rounded-lg p-6 text-center">
                <div className="text-3xl font-mono font-bold text-primary min-h-[48px] flex items-center justify-center">
                  {trustId || "Enter Trust ID"}
                </div>
              </div>

              {/* Dialpad */}
              <div className="grid grid-cols-3 gap-3">
                {dialButtons.map((button, index) => (
                  <button
                    key={index}
                    onClick={() => handleDialPress(button)}
                    disabled={!button || isLoading}
                    className={`h-16 rounded-lg text-xl font-semibold transition-all ${
                      button === "⌫"
                        ? "bg-red-100 text-red-600 hover:bg-red-200 active:scale-95"
                        : button
                          ? "bg-white border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary active:scale-95"
                          : "invisible"
                    } disabled:opacity-50`}
                  >
                    {button === "⌫" ? <Delete className="w-6 h-6 mx-auto" /> : button}
                  </button>
                ))}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <Button onClick={handleVerifyTrustId} className="w-full h-12 text-base" disabled={!trustId || isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === "face-capture" && (
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Face Verification</CardTitle>
              <CardDescription>
                {attendanceType === "first-checkin"
                  ? "Take your first check-in for today"
                  : attendanceType === "second-checkin"
                    ? "Take your second check-in (6+ hours elapsed)"
                    : "You have already completed both check-ins today"}
              </CardDescription>
              {studentData && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Welcome, <span className="font-semibold text-primary">{studentData.student_name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {attendanceType === "complete" ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-600 mb-2">Attendance Already Marked</p>
                  <p className="text-sm text-muted-foreground">You have completed both check-ins for today</p>
                  <Button onClick={handleReset} className="mt-6">
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  {/* Camera Preview with Circular Frame */}
                  <div className="relative aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      {!isCameraActive ? (
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <Button onClick={startCamera} size="lg">
                            <Camera className="w-5 h-5 mr-2" />
                            Start Camera
                          </Button>
                        </div>
                      ) : (
                        <>
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                          {/* Circular overlay */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                              className={`w-72 h-72 rounded-full border-8 transition-colors duration-300 ${
                                faceDetected ? "border-green-500" : "border-white"
                              }`}
                              style={{
                                boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`,
                              }}
                            />
                          </div>
                          {faceDetected && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4" />
                              Face Detected
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button
                      onClick={captureImage}
                      className="flex-1"
                      disabled={!isCameraActive || !faceDetected || isCapturing}
                    >
                      {isCapturing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Capture & Mark Attendance
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {step === "success" && (
          <Card className="shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Attendance Marked Successfully!</h2>
              <p className="text-muted-foreground mb-1">
                {attendanceType === "first-checkin"
                  ? "First check-in completed"
                  : "Second check-in completed - Full day attendance marked"}
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                {attendanceType === "first-checkin"
                  ? "Please check in again after 6 hours for full day attendance"
                  : "You have completed both check-ins for today"}
              </p>
              <div className="space-y-3">
                <Button onClick={handleReset} className="w-full">
                  Mark Another Attendance
                </Button>
                <Link href="/">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
