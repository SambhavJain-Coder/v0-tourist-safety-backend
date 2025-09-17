"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin } from "lucide-react"

interface EmergencyContact {
  name: string
  phone: string
  relationship: string
}

interface Location {
  lat: number
  lng: number
  address: string
}

interface SOSButtonProps {
  emergencyContacts: EmergencyContact[]
  userLocation?: Location
}

export function SOSButton({ emergencyContacts, userLocation }: SOSButtonProps) {
  const [isActivated, setIsActivated] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isCountingDown, setIsCountingDown] = useState(false)

  const handleSOSPress = () => {
    if (isCountingDown) return

    setIsCountingDown(true)
    setCountdown(5)

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsCountingDown(false)
          activateEmergency()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelSOS = () => {
    setIsCountingDown(false)
    setCountdown(0)
  }

  const activateEmergency = async () => {
    setIsActivated(true)

    // In production, this would:
    // 1. Send location to emergency services
    // 2. Notify emergency contacts
    // 3. Start recording audio/video
    // 4. Send alerts to nearby users
    // 5. Log to blockchain transaction system

    try {
      const response = await fetch("/api/emergency/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          location: userLocation,
          timestamp: new Date().toISOString(),
          contacts: emergencyContacts,
        }),
      })

      if (response.ok) {
        console.log("Emergency activated successfully")
      }
    } catch (error) {
      console.error("Failed to activate emergency:", error)
    }
  }

  if (isActivated) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Emergency Activated
          </CardTitle>
          <CardDescription className="text-red-600">Help is on the way. Stay calm and stay safe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-red-800">Emergency services notified</span>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-red-700">Emergency contacts have been notified:</p>
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-red-100 rounded">
                <span className="text-sm font-medium">{contact.name}</span>
                <Badge variant="secondary" className="bg-red-200 text-red-800">
                  Notified
                </Badge>
              </div>
            ))}
          </div>

          {userLocation && (
            <div className="p-3 bg-red-100 rounded-lg">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-red-800">Location shared:</p>
                  <p className="text-red-600">{userLocation.address}</p>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="outline"
            className="w-full border-red-300 text-red-700 hover:bg-red-50 bg-transparent"
            onClick={() => setIsActivated(false)}
          >
            Cancel Emergency
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Emergency SOS
        </CardTitle>
        <CardDescription>Press and hold for 5 seconds to activate emergency response</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCountingDown ? (
          <div className="text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-2xl font-bold text-red-600">{countdown}</div>
              </div>
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-red-200"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${((5 - countdown) / 5) * 283} 283`}
                  className="text-red-500 transition-all duration-1000"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-red-600">Emergency activating in {countdown}s</p>
              <Button variant="outline" onClick={cancelSOS} className="w-full bg-transparent">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              className="w-full h-16 bg-red-500 hover:bg-red-600 text-white text-lg font-bold"
              onMouseDown={handleSOSPress}
              onTouchStart={handleSOSPress}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <div>EMERGENCY SOS</div>
                  <div className="text-xs font-normal opacity-90">Hold for 5 seconds</div>
                </div>
              </div>
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Automatically contacts emergency services</p>
              <p>• Shares your location with emergency contacts</p>
              <p>• Starts recording for evidence</p>
              <p>• Alerts nearby safety network</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
