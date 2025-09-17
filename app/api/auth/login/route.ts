import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock user database - in production, this would be a real database
const mockUsers = [
  {
    id: "1",
    email: "tourist@example.com",
    password: "password123", // In production, this would be hashed
    name: "John Tourist",
    role: "tourist",
  },
  {
    id: "2",
    email: "police@example.com",
    password: "police123",
    name: "Officer Smith",
    role: "police",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user in mock database
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Create transaction log entry (simulated)
    const transactionLog = {
      id: `tx_${Date.now()}`,
      userId: user.id,
      action: "LOGIN",
      timestamp: new Date().toISOString(),
      metadata: {
        email: user.email,
        userAgent: request.headers.get("user-agent"),
      },
      hash: `hash_${Date.now()}`, // In production, this would be a proper hash chain
    }

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      transactionLog,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
