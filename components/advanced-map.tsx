"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, AlertTriangle, Users, Camera, Phone, Shield } from "lucide-react"

interface MapLocation {
  id: string
  lat: number
  lng: number
  name: string
  type: "safe_zone" | "emergency" | "medical" | "tourist" | "police" | "danger"
  description: string
  rating?: number
  distance?: number
}

interface AdvancedMapProps {
  center?: { lat: number; lng: number } | null
  locations: MapLocation[]
  mapView: "normal" | "satellite" | "heatmap"
  isTracking: boolean
  userLocation?: { lat: number; lng: number } | null
}

export function AdvancedMap({ center, locations, mapView, isTracking, userLocation }: AdvancedMapProps) {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [heatmapData, setHeatmapData] = useState<Array<{ lat: number; lng: number; intensity: number }>>([])
  const [realTimeData, setRealTimeData] = useState<any>(null)

  useEffect(() => {
    const fetchLocationData = async () => {
      if (!userLocation) return

      try {
        const response = await fetch("/api/location/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            lat: userLocation.lat,
            lng: userLocation.lng,
            accuracy: 5,
            timestamp: new Date().toISOString(),
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setRealTimeData(data)
          console.log("[v0] Real-time location data updated:", data)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch location data:", error)
      }
    }

    if (isTracking) {
      fetchLocationData()
      const interval = setInterval(fetchLocationData, 30000) // Update every 30 seconds
      return () => clearInterval(interval)
    }
  }, [isTracking, userLocation])

  useEffect(() => {
    // Generate mock heatmap data for safety zones
    const mockHeatmapData = [
      { lat: 28.6129, lng: 77.2295, intensity: 0.8 }, // India Gate - high safety
      { lat: 28.6149, lng: 77.2085, intensity: 0.9 }, // Police Station - very high safety
      { lat: 28.6159, lng: 77.2105, intensity: 0.85 }, // Hospital - high safety
      { lat: 28.6139, lng: 77.209, intensity: 0.75 }, // Tourist Center - good safety
      { lat: 28.6119, lng: 77.207, intensity: 0.3 }, // Construction Zone - low safety
    ]
    setHeatmapData(mockHeatmapData)
  }, [])

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "safe_zone":
        return <Shield className="w-3 h-3 text-green-500" />
      case "emergency":
        return <AlertTriangle className="w-3 h-3 text-red-500" />
      case "medical":
        return <Phone className="w-3 h-3 text-blue-500" />
      case "tourist":
        return <Camera className="w-3 h-3 text-purple-500" />
      case "police":
        return <Users className="w-3 h-3 text-blue-600" />
      case "danger":
        return <AlertTriangle className="w-3 h-3 text-red-600" />
      default:
        return <MapPin className="w-3 h-3" />
    }
  }

  const getMarkerPosition = (location: MapLocation) => {
    // Convert lat/lng to percentage position on the mock map
    const latRange = [28.61, 28.62]
    const lngRange = [77.2, 77.23]

    const x = ((location.lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * 100
    const y = ((latRange[1] - location.lat) / (latRange[1] - latRange[0])) * 100

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  const getUserPosition = () => {
    if (!userLocation) return { x: 50, y: 50 }

    const latRange = [28.61, 28.62]
    const lngRange = [77.2, 77.23]

    const x = ((userLocation.lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * 100
    const y = ((latRange[1] - userLocation.lat) / (latRange[1] - latRange[0])) * 100

    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Interactive Safety Map
            </CardTitle>
            <CardDescription>
              {mapView === "heatmap"
                ? "Safety heatmap showing risk levels"
                : mapView === "satellite"
                  ? "Satellite view with location markers"
                  : "Standard map view with safety zones"}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isTracking ? "default" : "secondary"}>{isTracking ? "Live" : "Static"}</Badge>
            <Badge variant="outline">{locations.length} locations</Badge>
            {realTimeData?.alerts && realTimeData.alerts.length > 0 && (
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                {realTimeData.alerts.length} alerts
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Interactive Map Container */}
        <div className="relative h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg overflow-hidden border">
          {/* Map Background Based on View */}
          {mapView === "satellite" && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 opacity-80"></div>
          )}

          {mapView === "heatmap" && (
            <div className="absolute inset-0">
              {heatmapData.map((point, index) => {
                const position = getMarkerPosition({
                  id: `heat-${index}`,
                  lat: point.lat,
                  lng: point.lng,
                  name: "",
                  type: "safe_zone",
                  description: "",
                })
                return (
                  <div
                    key={index}
                    className="absolute w-16 h-16 rounded-full"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: `rgba(${point.intensity > 0.7 ? "34, 197, 94" : point.intensity > 0.5 ? "234, 179, 8" : "239, 68, 68"}, ${point.intensity * 0.3})`,
                      boxShadow: `0 0 20px rgba(${point.intensity > 0.7 ? "34, 197, 94" : point.intensity > 0.5 ? "234, 179, 8" : "239, 68, 68"}, ${point.intensity * 0.5})`,
                    }}
                  />
                )
              })}
            </div>
          )}

          {/* Grid Lines for Reference */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gray-400"></div>
            <div className="absolute top-0 left-1/2 w-px h-full bg-gray-400"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gray-400"></div>
            <div className="absolute top-1/4 left-0 w-full h-px bg-gray-400"></div>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-400"></div>
            <div className="absolute top-3/4 left-0 w-full h-px bg-gray-400"></div>
          </div>

          {/* User Location Marker */}
          {isTracking && userLocation && (
            <div
              className="absolute z-20"
              style={{
                left: `${getUserPosition().x}%`,
                top: `${getUserPosition().y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary/30 rounded-full animate-ping"></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded whitespace-nowrap">
                  You are here
                </div>
              </div>
            </div>
          )}

          {/* Location Markers */}
          {locations.map((location) => {
            const position = getMarkerPosition(location)
            return (
              <div
                key={location.id}
                className="absolute z-10 cursor-pointer"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => setSelectedLocation(location)}
              >
                <div className="relative group">
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                      location.type === "safe_zone"
                        ? "bg-green-500"
                        : location.type === "danger"
                          ? "bg-red-500"
                          : location.type === "medical"
                            ? "bg-blue-500"
                            : location.type === "police"
                              ? "bg-blue-600"
                              : location.type === "tourist"
                                ? "bg-purple-500"
                                : "bg-gray-500"
                    }`}
                  >
                    {getLocationIcon(location.type)}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                      {location.name}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Geofence Circles */}
          {isTracking && userLocation && (
            <>
              <div
                className="absolute border-2 border-primary/30 rounded-full pointer-events-none"
                style={{
                  left: `${getUserPosition().x}%`,
                  top: `${getUserPosition().y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "120px",
                  height: "120px",
                }}
              />
              <div
                className="absolute border border-primary/20 rounded-full pointer-events-none"
                style={{
                  left: `${getUserPosition().x}%`,
                  top: `${getUserPosition().y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "200px",
                  height: "200px",
                }}
              />
            </>
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

          {/* Compass */}
          <div className="absolute top-4 left-4">
            <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-xs font-bold">N</div>
              <div className="absolute w-1 h-4 bg-red-500 rounded-full transform -translate-y-1"></div>
            </div>
          </div>

          {/* Scale */}
          <div className="absolute bottom-4 left-4 bg-white/90 px-2 py-1 rounded text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-0.5 bg-black"></div>
              <span>500m</span>
            </div>
          </div>
        </div>

        {/* Real-time Alerts from API */}
        {realTimeData?.alerts && realTimeData.alerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Active Geofence Alerts:</h4>
            {realTimeData.alerts.map((alert: any, index: number) => (
              <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                <AlertTriangle className="w-4 h-4 text-yellow-600 inline mr-2" />
                {alert.message}
              </div>
            ))}
          </div>
        )}

        {/* Selected Location Info */}
        {selectedLocation && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getLocationIcon(selectedLocation.type)}</div>
                  <div>
                    <h4 className="font-medium">{selectedLocation.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{selectedLocation.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="secondary"
                        className={
                          selectedLocation.type === "safe_zone"
                            ? "bg-green-100 text-green-800"
                            : selectedLocation.type === "danger"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                        }
                      >
                        {selectedLocation.type.replace("_", " ")}
                      </Badge>
                      {selectedLocation.distance && (
                        <span className="text-sm text-muted-foreground">{selectedLocation.distance}km away</span>
                      )}
                      {selectedLocation.rating && (
                        <span className="text-sm text-muted-foreground">⭐ {selectedLocation.rating}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Navigation className="w-4 h-4 mr-1" />
                    Directions
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setSelectedLocation(null)}>
                    ✕
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Map Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Your Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Zones</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Medical Centers</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Police Stations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Tourist Attractions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Danger Zones</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
