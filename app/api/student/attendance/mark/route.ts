import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { trustId, faceImage, attendanceType } = await request.json()

    if (!trustId || !faceImage || !attendanceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const { data: student, error: studentError } = await supabase
      .from("students")
      .select("id, student_name")
      .eq("trust_id", trustId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const checkInType = attendanceType === "first-checkin" ? "first" : "second"
    const status = attendanceType === "second-checkin" ? "full-day" : "half-day"

    const { error: insertError } = await supabase.from("daily_attendance").insert({
      student_id: student.id,
      trust_id: trustId,
      check_in_time: new Date().toISOString(),
      check_in_type: checkInType,
      face_image: faceImage,
      status: status,
    })

    if (insertError) {
      console.error("Error inserting attendance:", insertError)
      return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Attendance marked successfully",
      attendanceType,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
