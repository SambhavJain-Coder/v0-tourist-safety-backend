import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Mock user database - in production, this would be a real database
const mockUsers = [
  {
    id: "1",
    email: "tourist@example.com",
    password: "password123",
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
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      password, // In production, this would be hashed
      name,
      role: "tourist", // Default role
    }

    mockUsers.push(newUser)

    // Generate JWT token
    const token = sign(
      {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Create transaction log entry (simulated)
    const transactionLog = {
      id: `tx_${Date.now()}`,
      userId: newUser.id,
      action: "REGISTER",
      timestamp: new Date().toISOString(),
      metadata: {
        email: newUser.email,
        userAgent: request.headers.get("user-agent"),
      },
      hash: `hash_${Date.now()}`, // In production, this would be a proper hash chain
    }

    return NextResponse.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
      transactionLog,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
