import { type NextRequest, NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export const POST = requireAuth(async (request: NextRequest, user) => {
  try {
    const formData = await request.json()

    // Generate unique ID
    const idNumber = `TSI${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Create blockchain transaction log entry
    const transactionLog = {
      id: `tx_${Date.now()}`,
      userId: user.userId,
      action: "ID_GENERATION",
      timestamp: new Date().toISOString(),
      metadata: {
        idNumber,
        fullName: formData.fullName,
        nationality: formData.nationality,
        destination: formData.destination,
        passportNumber: formData.passportNumber,
      },
      hash: `hash_${Date.now()}`, // In production, this would be a proper hash chain
      previousHash: `prev_${Date.now() - 1000}`, // Link to previous transaction
    }

    // In production, this would:
    // 1. Store the ID data in MongoDB with geospatial indexes
    // 2. Create proper blockchain transaction
    // 3. Generate encrypted QR code
    // 4. Send confirmation email
    // 5. Log to append-only transaction system

    return NextResponse.json({
      id: idNumber,
      transactionLog,
      qrData: {
        id: idNumber,
        name: formData.fullName,
        nationality: formData.nationality,
        passport: formData.passportNumber,
        emergency: formData.emergencyPhone,
        destination: formData.destination,
        validUntil: formData.departureDate,
      },
      message: "Digital Tourist ID generated successfully",
    })
  } catch (error) {
    console.error("ID generation error:", error)
    return NextResponse.json({ error: "Failed to generate ID" }, { status: 500 })
  }
})
