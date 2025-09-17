import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export const POST = requireAuth(async (request: NextRequest, user, { params }: { params: { id: string } }) => {
  try {
    const alertId = params.id

    // In production, this would update the alert status in the database
    console.log(`[v0] Marking alert ${alertId} as read for user ${user.userId}`)

    return NextResponse.json({
      success: true,
      message: "Alert marked as read",
      alertId,
    })
  } catch (error) {
    console.error("Mark alert as read error:", error)
    return NextResponse.json({ error: "Failed to mark alert as read" }, { status: 500 })
  }
})
