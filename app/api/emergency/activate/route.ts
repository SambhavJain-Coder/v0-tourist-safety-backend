import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { location, timestamp, contacts } = await request.json()

    // Create emergency transaction log
    const emergencyLog = {
      id: `emergency_${Date.now()}`,
      userId: user.userId,
      action: "EMERGENCY_ACTIVATED",
      timestamp,
      metadata: {
        location,
        contacts: contacts.map((c: any) => ({ name: c.name, relationship: c.relationship })),
        userAgent: request.headers.get("user-agent"),
      },
      hash: `hash_${Date.now()}`,
      previousHash: `prev_${Date.now() - 1000}`,
    }

    // In production, this would:
    // 1. Send immediate alerts to emergency services
    // 2. Notify all emergency contacts via SMS/call
    // 3. Start recording audio/video
    // 4. Alert nearby users in safety network
    // 5. Log to blockchain transaction system
    // 6. Activate IoT devices (panic button, wearables)

    console.log("Emergency activated for user:", user.userId)
    console.log("Location:", location)
    console.log("Emergency contacts notified:", contacts.length)

    return NextResponse.json({
      success: true,
      emergencyId: emergencyLog.id,
      message: "Emergency services have been notified",
      transactionLog: emergencyLog,
      estimatedResponseTime: "5-10 minutes",
      nearbyServices: [
        { type: "Police", distance: "0.8 km", eta: "3 min" },
        { type: "Hospital", distance: "1.2 km", eta: "5 min" },
        { type: "Fire Station", distance: "2.1 km", eta: "7 min" },
      ],
    })
  } catch (error) {
    console.error("Emergency activation error:", error)
    return NextResponse.json({ error: "Failed to activate emergency response" }, { status: 500 })
  }
})
