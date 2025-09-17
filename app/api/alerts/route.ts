import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export const GET = requireAuth(async (request: NextRequest, user) => {
  try {
    // Mock real-time alerts - in production, this would fetch from database
    const alerts = [
      {
        id: `alert_${Date.now()}_1`,
        type: "warning",
        title: "Geofence Alert",
        message: "You are approaching a construction zone. Exercise caution.",
        timestamp: new Date().toISOString(),
        location: "Construction Area",
        isRead: false,
      },
      {
        id: `alert_${Date.now()}_2`,
        type: "info",
        title: "Safety Update",
        message: "Your current area has a safety score of 87%. Stay alert.",
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        location: "Current Location",
        isRead: false,
      },
    ]

    return NextResponse.json({
      success: true,
      alerts,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Alerts fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
})
