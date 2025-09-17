import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const { lat, lng, accuracy, timestamp } = await request.json()

    // Create location tracking log
    const locationLog = {
      id: `location_${Date.now()}`,
      userId: user.userId,
      action: "LOCATION_UPDATE",
      timestamp: timestamp || new Date().toISOString(),
      metadata: {
        coordinates: { lat, lng },
        accuracy,
        userAgent: request.headers.get("user-agent"),
      },
      hash: `hash_${Date.now()}`,
      previousHash: `prev_${Date.now() - 1000}`,
    }

    // In production, this would:
    // 1. Store location in MongoDB with geospatial indexes
    // 2. Check geofence boundaries
    // 3. Trigger alerts if entering danger zones
    // 4. Update real-time location for emergency contacts
    // 5. Log to blockchain transaction system

    // Mock geofence check
    const geofences = [
      { name: "Hotel Safe Zone", center: { lat: 28.6139, lng: 77.209 }, radius: 500, type: "safe" },
      { name: "Construction Area", center: { lat: 28.6119, lng: 77.207 }, radius: 300, type: "danger" },
    ]

    const alerts = []
    for (const fence of geofences) {
      const distance = calculateDistance(lat, lng, fence.center.lat, fence.center.lng)
      if (distance <= fence.radius) {
        alerts.push({
          type: fence.type === "danger" ? "warning" : "info",
          message: `You are in ${fence.name}`,
          geofence: fence.name,
        })
      }
    }

    return NextResponse.json({
      success: true,
      locationLog,
      alerts,
      nearbyServices: [
        { type: "Police", distance: 1.2, eta: "3 min" },
        { type: "Hospital", distance: 1.5, eta: "5 min" },
        { type: "Fire Station", distance: 2.1, eta: "7 min" },
      ],
    })
  } catch (error) {
    console.error("Location tracking error:", error)
    return NextResponse.json({ error: "Failed to track location" }, { status: 500 })
  }
})

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3 // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
