"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Home, Camera, CheckCircle2, Delete, AlertCircle } from "lucide-react"

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
  const dialButtons = [
    { num: "1", letters: "" },
    { num: "2", letters: "ABC" },
    { num: "3", letters: "DEF" },
    { num: "4", letters: "GHI" },
    { num: "5", letters: "JKL" },
    { num: "6", letters: "MNO" },
    { num: "7", letters: "PQRS" },
    { num: "8", letters: "TUV" },
    { num: "9", letters: "WXYZ" },
    { num: "*", letters: "" },
    { num: "0", letters: "+" },
    { num: "#", letters: "" },
  ]

  const handleDialPress = (value: string) => {
    if (value === "⌫") {
      setTrustId((prev) => prev.slice(0, -1))
    } else if (value !== "*" && value !== "#" && trustId.length < 15) {
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
      setError("") // clear error
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
          setError(data.error || "Face didn't matched. Please try again.")
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
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/images/pss-logo.png" alt="PSS Logo" width={40} height={40} className="w-10 h-10" />
            <div>
              <span className="font-bold text-lg text-gray-900 block">PSS Trust</span>
              <span className="text-xs text-gray-500">Daily Attendance</span>
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
      <main className="max-w-md mx-auto px-4 py-6">
        {step === "dialpad" && (
          <div className="space-y-6">
            <div className="text-center pt-8 pb-4">
              <div className="border-4 border-gray-800 rounded-lg px-6 py-4 mx-4 bg-gray-50">
                <div className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-wider min-h-[60px] flex items-center justify-center">
                  {trustId || <span className="opacity-0">0</span>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-4 px-4">
              {dialButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleDialPress(button.num)}
                  disabled={isLoading}
                  className="flex flex-col items-center justify-center h-20 rounded-full transition-all bg-blue-100 hover:bg-blue-200 active:bg-blue-300 disabled:opacity-50"
                >
                  <span className="text-3xl font-semibold text-blue-900">{button.num}</span>
                  {button.letters && (
                    <span className="text-[10px] text-blue-700 tracking-[0.2em] mt-0.5">{button.letters}</span>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 pt-4 px-4">
              {/* Spacer */}
              <div className="w-16" />

              <button
                onClick={handleVerifyTrustId}
                disabled={!trustId || isLoading}
                className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-lg"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                )}
              </button>

              <button
                onClick={() => handleDialPress("⌫")}
                disabled={!trustId || isLoading}
                className="w-16 h-16 flex items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
              >
                <Delete className="w-7 h-7" />
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2 mx-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <p className="text-center text-gray-500 text-sm">Enter your Trust ID and tap the green button to verify</p>
          </div>
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
                <div className="mt-2 text-sm text-gray-600">
                  Welcome, <span className="font-semibold text-green-600">{studentData.student_name}</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {attendanceType === "complete" ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-green-600 mb-2">Attendance Already Marked</p>
                  <p className="text-sm text-gray-500">You have completed both check-ins for today</p>
                  <Button onClick={handleReset} className="mt-6 bg-green-500 hover:bg-green-600">
                    Done
                  </Button>
                </div>
              ) : (
                <>
                  {/* Camera Preview with Circular Frame */}
                  <div className="relative aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      {!isCameraActive ? (
                        <div className="text-center">
                          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <Button onClick={startCamera} size="lg" className="bg-blue-500 hover:bg-blue-600">
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
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div
                              className={`w-72 h-80 rounded-[100px] border-4 transition-all duration-300 ${
                                faceDetected ? "border-green-500" : "border-red-500"
                              }`}
                              style={{
                                boxShadow: `0 0 0 9999px rgba(255, 255, 255, 0.4)`,
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
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
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
                      className="flex-1 bg-green-500 hover:bg-green-600"
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
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Attendance Marked Successfully!</h2>
              <p className="text-gray-600 mb-1">
                {attendanceType === "first-checkin"
                  ? "First check-in completed"
                  : "Second check-in completed - Full day attendance marked"}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {attendanceType === "first-checkin"
                  ? "Please check in again after 6 hours for full day attendance"
                  : "You have completed both check-ins for today"}
              </p>
              <div className="space-y-3">
                <Button onClick={handleReset} className="w-full bg-green-500 hover:bg-green-600">
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
