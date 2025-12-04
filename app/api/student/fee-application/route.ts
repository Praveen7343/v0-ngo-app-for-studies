import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: Request) {
  try {
    const { studentId, trustId, formData, voucherData } = await request.json()

    if (!studentId || !trustId || !formData || !voucherData) {
      return NextResponse.json(
        { error: "Student ID, Trust ID, form data, and voucher data are required" },
        { status: 400 },
      )
    }

    const feeTypes = []
    if (formData.semFee) feeTypes.push("Sem Fee")
    if (formData.provisions) feeTypes.push("Provisions")
    if (formData.others) feeTypes.push("Others")
    const feeType = feeTypes.join(", ") || "General Request"

    // Insert fee application into database with all form and voucher data
    const { data, error } = await supabase
      .from("fee_applications")
      .insert({
        student_id: studentId,
        trust_id: trustId,
        fee_type: feeType,
        amount: voucherData.amount ? Number.parseFloat(voucherData.amount) : null,
        reason: voucherData.being || formData.contribution || "Fee Application",
        supporting_document: formData.letterImage || null,
        status: "pending",
        form_data: formData,
        voucher_data: voucherData,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error("Fee application error:", error)
      return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Fee application submitted successfully",
      application: data,
    })
  } catch (error) {
    console.error("Fee application error:", error)
    return NextResponse.json({ error: "An error occurred while submitting the application" }, { status: 500 })
  }
}
