import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    service: "Smart Tourist Safety System API",
    version: "1.0.0",
  })
}
