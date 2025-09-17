"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AuthGuard } from "@/components/auth-guard"
import { AdvancedMap } from "@/components/advanced-map"
import { LocationServices } from "@/components/location-services"
import { GeofenceManager } from "@/components/geofence-manager"
import { MapPin, Navigation, Search, Layers, Zap, Shield, AlertTriangle, Users, Camera, Phone } from "lucide-react"

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

export default function MapsPage() {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [mapView, setMapView] = useState<"normal" | "satellite" | "heatmap">("normal")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [isTracking, setIsTracking] = useState(true)
  const [nearbyLocations, setNearbyLocations] = useState<MapLocation[]>([])

  // Mock locations data
  const locations: MapLocation[] = [
    {
      id: "1",
      lat: 28.6129,
      lng: 77.2295,
      name: "India Gate",
      type: "tourist",
      description: "Historic war memorial and popular tourist destination",
      rating: 4.5,
      distance: 0.8,
    },
    {
      id: "2",
      lat: 28.6149,
      lng: 77.2085,
      name: "Central Police Station",
      type: "police",
      description: "24/7 emergency services available",
      distance: 1.2,
    },
    {
      id: "3",
      lat: 28.6159,
      lng: 77.2105,
      name: "All India Institute of Medical Sciences",
      type: "medical",
      description: "Premier medical facility with emergency services",
      rating: 4.8,
      distance: 1.5,
    },
    {
      id: "4",
      lat: 28.6139,
      lng: 77.209,
      name: "Tourist Information Center",
      type: "safe_zone",
      description: "Official tourist assistance and information",
      rating: 4.2,
      distance: 0.3,
    },
    {
      id: "5",
      lat: 28.6119,
      lng: 77.207,
      name: "Construction Zone",
      type: "danger",
      description: "Avoid this area - ongoing construction work",
      distance: 0.9,
    },
  ]

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Geolocation error:", error)
          // Fallback to Delhi coordinates
          setCurrentLocation({ lat: 28.6139, lng: 77.209 })
        },
      )
    }

    // Filter nearby locations
    setNearbyLocations(locations.filter((loc) => (loc.distance || 0) < 2))
  }, [])

  const filteredLocations = locations.filter((location) => {
    const matchesSearch = location.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = selectedFilter === "all" || location.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const getLocationIcon = (type: string) => {
    switch (type) {
      case "safe_zone":
        return <Shield className="w-4 h-4 text-green-500" />
      case "emergency":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "medical":
        return <Phone className="w-4 h-4 text-blue-500" />
      case "tourist":
        return <Camera className="w-4 h-4 text-purple-500" />
      case "police":
        return <Users className="w-4 h-4 text-blue-600" />
      case "danger":
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const getLocationColor = (type: string) => {
    switch (type) {
      case "safe_zone":
        return "bg-green-100 text-green-800"
      case "emergency":
        return "bg-red-100 text-red-800"
      case "medical":
        return "bg-blue-100 text-blue-800"
      case "tourist":
        return "bg-purple-100 text-purple-800"
      case "police":
        return "bg-blue-100 text-blue-800"
      case "danger":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
        {/* Header */}
        <header className="bg-card/50 backdrop-blur-sm border-b border-border/50 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Interactive Safety Map</h1>
                  <p className="text-sm text-muted-foreground">Real-time location tracking and safety zones</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={isTracking ? "default" : "secondary"}>
                  {isTracking ? "Live Tracking" : "Tracking Off"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsTracking(!isTracking)}
                  className="flex items-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  {isTracking ? "Stop" : "Start"} Tracking
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Sidebar - Controls and Locations */}
            <div className="lg:col-span-4 space-y-6">
              {/* Search and Filters */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    Search & Filter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="safe_zone">Safe Zones</SelectItem>
                      <SelectItem value="emergency">Emergency Services</SelectItem>
                      <SelectItem value="medical">Medical Centers</SelectItem>
                      <SelectItem value="tourist">Tourist Attractions</SelectItem>
                      <SelectItem value="police">Police Stations</SelectItem>
                      <SelectItem value="danger">Danger Zones</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2">
                    <Button
                      variant={mapView === "normal" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapView("normal")}
                      className="flex-1"
                    >
                      <Layers className="w-4 h-4 mr-1" />
                      Normal
                    </Button>
                    <Button
                      variant={mapView === "satellite" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapView("satellite")}
                      className="flex-1"
                    >
                      <Camera className="w-4 h-4 mr-1" />
                      Satellite
                    </Button>
                    <Button
                      variant={mapView === "heatmap" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setMapView("heatmap")}
                      className="flex-1"
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Heatmap
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Locations */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-primary" />
                    Nearby Locations
                  </CardTitle>
                  <CardDescription>Points of interest within 2km</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {filteredLocations.slice(0, 6).map((location) => (
                    <div key={location.id} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <div className="mt-1">{getLocationIcon(location.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{location.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{location.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary" className={getLocationColor(location.type)}>
                                {location.type.replace("_", " ")}
                              </Badge>
                              {location.distance && (
                                <span className="text-xs text-muted-foreground">{location.distance}km away</span>
                              )}
                            </div>
                          </div>
                          {location.rating && <div className="text-xs text-muted-foreground">⭐ {location.rating}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Location Services */}
              <LocationServices currentLocation={currentLocation} />
            </div>

            {/* Main Map Area */}
            <div className="lg:col-span-8 space-y-6">
              <AdvancedMap
                center={currentLocation}
                locations={filteredLocations}
                mapView={mapView}
                isTracking={isTracking}
                userLocation={currentLocation}
              />

              {/* Geofence Manager */}
              <GeofenceManager currentLocation={currentLocation} />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
