"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Zap, AlertTriangle } from "lucide-react"

interface Location {
  lat: number
  lng: number
  address: string
}

interface LiveMapProps {
  center?: Location
  isTracking: boolean
  userLocation?: Location
}

export function LiveMap({ center, isTracking, userLocation }: LiveMapProps) {
  const [mapView, setMapView] = useState<"normal" | "satellite" | "heatmap">("normal")

  // Mock data for demonstration
  const safeZones = [
    { id: 1, name: "Tourist Information Center", lat: 28.6129, lng: 77.2295, type: "safe" },
    { id: 2, name: "Police Station", lat: 28.6149, lng: 77.2085, type: "emergency" },
    { id: 3, name: "Hospital", lat: 28.6159, lng: 77.2105, type: "medical" },
  ]

  const alerts = [
    { id: 1, type: "warning", message: "Heavy traffic reported", lat: 28.6139, lng: 77.209 },
    { id: 2, type: "info", message: "Tourist event nearby", lat: 28.6119, lng: 77.207 },
  ]

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Live Location Map
            </CardTitle>
            <CardDescription>Real-time location tracking with safety zones and alerts</CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={mapView === "normal" ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView("normal")}
            >
              Normal
            </Button>
            <Button
              variant={mapView === "heatmap" ? "default" : "outline"}
              size="sm"
              onClick={() => setMapView("heatmap")}
            >
              <Zap className="w-4 h-4 mr-1" />
              Heatmap
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Map Container - In production, this would be Google Maps or Mapbox */}
        <div className="relative h-64 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden border">
          {/* Mock Map Background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-4 w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-blue-500 rounded-full"></div>
            <div className="absolute bottom-6 left-1/3 w-1 h-1 bg-red-500 rounded-full"></div>
            <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-yellow-500 rounded-full"></div>
          </div>

          {/* User Location Marker */}
          {isTracking && userLocation && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary/30 rounded-full animate-ping"></div>
              </div>
            </div>
          )}

          {/* Safe Zones */}
          {safeZones.map((zone) => (
            <div
              key={zone.id}
              className="absolute w-3 h-3 rounded-full border-2 border-white shadow-lg"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
                backgroundColor: zone.type === "safe" ? "#10b981" : zone.type === "emergency" ? "#ef4444" : "#3b82f6",
              }}
              title={zone.name}
            />
          ))}

          {/* Geofence Visualization */}
          {isTracking && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-32 h-32 border-2 border-primary/30 rounded-full"></div>
            </div>
          )}

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              +
            </Button>
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              -
            </Button>
            <Button size="sm" variant="secondary" className="w-8 h-8 p-0">
              <Navigation className="w-4 h-4" />
            </Button>
          </div>

          {/* Status Overlay */}
          <div className="absolute bottom-4 left-4">
            <Badge variant={isTracking ? "default" : "secondary"} className="bg-white/90 text-foreground">
              {isTracking ? "Live Tracking" : "Tracking Disabled"}
            </Badge>
          </div>
        </div>

        {/* Map Legend */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Emergency Services</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Medical Centers</span>
          </div>
        </div>

        {/* Current Location Info */}
        {userLocation && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5" />
              <div>
                <p className="font-medium text-sm">Current Location</p>
                <p className="text-xs text-muted-foreground">{userLocation.address}</p>
                <p className="text-xs text-muted-foreground">
                  Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Alerts */}
        {alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Nearby Alerts</h4>
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-2 p-2 bg-muted/30 rounded">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div className="text-xs">
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-muted-foreground">Just now</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
