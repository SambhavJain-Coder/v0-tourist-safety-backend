import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export const DELETE = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const alertId = params.id

    // In production, this would delete the alert from the database
    console.log(`[v0] Dismissing alert ${alertId} for user ${user.userId}`)

    return NextResponse.json({
      success: true,
      message: "Alert dismissed",
      alertId,
    })
  } catch (error) {
    console.error("Dismiss alert error:", error)
    return NextResponse.json({ error: "Failed to dismiss alert" }, { status: 500 })
  }
})
