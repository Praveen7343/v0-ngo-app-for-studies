import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { trustId } = await request.json()

    if (!trustId) {
      return NextResponse.json({ error: "Trust ID is required" }, { status: 400 })
    }

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, student_name, trust_id, email_id")
      .eq("trust_id", trustId)
      .maybeSingle()

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found with this Trust ID" }, { status: 404 })
    }

    const today = new Date().toISOString().split("T")[0]

    const { data: attendanceRecords, error: attendanceError } = await supabase
      .from("daily_attendance")
      .select("check_in_time, check_in_type")
      .eq("student_id", student.id)
      .gte("check_in_time", `${today}T00:00:00`)
      .lte("check_in_time", `${today}T23:59:59`)
      .order("check_in_time", { ascending: false })

    let attendanceType: "first-checkin" | "second-checkin" | "complete" = "first-checkin"
    let lastCheckIn = null

    if (attendanceRecords && attendanceRecords.length > 0) {
      const firstCheckIn = attendanceRecords.find((r) => r.check_in_type === "first")
      const secondCheckIn = attendanceRecords.find((r) => r.check_in_type === "second")

      if (secondCheckIn) {
        attendanceType = "complete"
      } else if (firstCheckIn) {
        const firstCheckInTime = new Date(firstCheckIn.check_in_time)
        const hoursSinceFirstCheckIn = (Date.now() - firstCheckInTime.getTime()) / (1000 * 60 * 60)

        if (hoursSinceFirstCheckIn >= 6) {
          attendanceType = "second-checkin"
        } else {
          attendanceType = "complete" // Too early for second check-in
        }
        lastCheckIn = firstCheckInTime.toISOString()
      }
    }

    return NextResponse.json({
      student,
      attendanceType,
      lastCheckIn,
    })
  } catch (error) {
    console.error("Error verifying Trust ID:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
