"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation, Phone, MapPin, Clock, Wifi, Battery } from "lucide-react"

interface LocationServicesProps {
  currentLocation?: { lat: number; lng: number } | null
}

interface NearbyService {
  id: string
  name: string
  type: "emergency" | "medical" | "police" | "transport"
  distance: number
  eta: string
  phone?: string
  available: boolean
}

export function LocationServices({ currentLocation }: LocationServicesProps) {
  const [locationAccuracy, setLocationAccuracy] = useState<number>(5)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [nearbyServices, setNearbyServices] = useState<NearbyService[]>([])
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (currentLocation && !isTracking) {
      startLocationTracking()
    }
  }, [currentLocation])

  const startLocationTracking = async () => {
    if (!currentLocation) return

    setIsTracking(true)

    try {
      const response = await fetch("/api/location/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          lat: currentLocation.lat,
          lng: currentLocation.lng,
          accuracy: locationAccuracy,
          timestamp: new Date().toISOString(),
        }),
      })

      if (response.ok) {
        const data = await response.json()

        if (data.nearbyServices) {
          const services: NearbyService[] = data.nearbyServices.map((service: any, index: number) => ({
            id: `service-${index}`,
            name:
              service.type === "Police"
                ? "Central Police Station"
                : service.type === "Hospital"
                  ? "AIIMS Emergency"
                  : service.type === "Fire Station"
                    ? "Fire Station"
                    : "Metro Station",
            type:
              service.type === "Police"
                ? "police"
                : service.type === "Hospital"
                  ? "medical"
                  : service.type === "Fire Station"
                    ? "emergency"
                    : "transport",
            distance: service.distance,
            eta: service.eta,
            phone:
              service.type === "Police"
                ? "+91-11-2334-5678"
                : service.type === "Hospital"
                  ? "+91-11-2659-8700"
                  : service.type === "Fire Station"
                    ? "101"
                    : undefined,
            available: true,
          }))
          setNearbyServices(services)
        }

        if (data.alerts && data.alerts.length > 0) {
          data.alerts.forEach((alert: any) => {
            console.log(`[v0] Geofence alert: ${alert.message}`)
          })
        }
      }
    } catch (error) {
      console.error("[v0] Location tracking failed:", error)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setLocationAccuracy(Math.random() * 10 + 3) // 3-13 meters
      setLastUpdate(new Date())

      if (isTracking && currentLocation) {
        startLocationTracking()
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [isTracking, currentLocation])

  const enableLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          console.log("[v0] Location enabled:", newLocation)
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
        },
      )
    }
  }

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "police":
        return "🚔"
      case "medical":
        return "🏥"
      case "emergency":
        return "🚒"
      case "transport":
        return "🚇"
      default:
        return "📍"
    }
  }

  const getServiceColor = (type: string) => {
    switch (type) {
      case "police":
        return "bg-blue-100 text-blue-800"
      case "medical":
        return "bg-red-100 text-red-800"
      case "emergency":
        return "bg-orange-100 text-orange-800"
      case "transport":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Location Status */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Location Status
          </CardTitle>
          <CardDescription>Current GPS and connectivity information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentLocation ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">GPS Signal</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {isTracking ? "Tracking" : "Strong"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accuracy</span>
                <span className="text-sm text-muted-foreground">±{locationAccuracy.toFixed(1)}m</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Update</span>
                <span className="text-sm text-muted-foreground">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {lastUpdate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Coordinates</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {currentLocation.lat.toFixed(4)}, {currentLocation.lng.toFixed(4)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Connected</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="w-4 h-4 text-green-500" />
                  <span className="text-sm">85%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <MapPin className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Location not available</p>
              <Button size="sm" variant="outline" className="mt-2 bg-transparent" onClick={enableLocation}>
                Enable Location
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Services */}
      <Card className="bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Emergency Services
          </CardTitle>
          <CardDescription>Nearby emergency and essential services</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {nearbyServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-lg">{getServiceIcon(service.type)}</div>
                <div>
                  <h4 className="font-medium text-sm">{service.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getServiceColor(service.type)}>
                      {service.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {service.distance}km • {service.eta}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {service.available && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Available
                  </Badge>
                )}
                {service.phone && (
                  <Button size="sm" variant="outline" className="h-8 bg-transparent">
                    <Phone className="w-3 h-3 mr-1" />
                    Call
                  </Button>
                )}
              </div>
            </div>
          ))}

          <div className="pt-2 border-t">
            <Button variant="outline" className="w-full bg-transparent" size="sm">
              View All Services
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
