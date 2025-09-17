"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Plus, MapPin, AlertTriangle, Trash2 } from "lucide-react"

interface GeofenceManagerProps {
  currentLocation?: { lat: number; lng: number } | null
}

interface Geofence {
  id: string
  name: string
  type: "safe_zone" | "danger_zone" | "custom"
  center: { lat: number; lng: number }
  radius: number
  active: boolean
  notifications: boolean
}

export function GeofenceManager({ currentLocation }: GeofenceManagerProps) {
  const [geofences, setGeofences] = useState<Geofence[]>([
    {
      id: "1",
      name: "Hotel Safe Zone",
      type: "safe_zone",
      center: { lat: 28.6139, lng: 77.209 },
      radius: 500,
      active: true,
      notifications: true,
    },
    {
      id: "2",
      name: "Construction Area",
      type: "danger_zone",
      center: { lat: 28.6119, lng: 77.207 },
      radius: 300,
      active: true,
      notifications: true,
    },
  ])

  const [isCreating, setIsCreating] = useState(false)
  const [newGeofence, setNewGeofence] = useState({
    name: "",
    type: "safe_zone" as const,
    radius: 500,
  })

  const createGeofence = () => {
    if (!currentLocation || !newGeofence.name) return

    const geofence: Geofence = {
      id: Date.now().toString(),
      name: newGeofence.name,
      type: newGeofence.type,
      center: currentLocation,
      radius: newGeofence.radius,
      active: true,
      notifications: true,
    }

    setGeofences([...geofences, geofence])
    setNewGeofence({ name: "", type: "safe_zone", radius: 500 })
    setIsCreating(false)
  }

  const toggleGeofence = (id: string) => {
    setGeofences(geofences.map((fence) => (fence.id === id ? { ...fence, active: !fence.active } : fence)))
  }

  const deleteGeofence = (id: string) => {
    setGeofences(geofences.filter((fence) => fence.id !== id))
  }

  const getGeofenceIcon = (type: string) => {
    switch (type) {
      case "safe_zone":
        return <Shield className="w-4 h-4 text-green-500" />
      case "danger_zone":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <MapPin className="w-4 h-4 text-blue-500" />
    }
  }

  const getGeofenceColor = (type: string) => {
    switch (type) {
      case "safe_zone":
        return "bg-green-100 text-green-800"
      case "danger_zone":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Geofence Management
            </CardTitle>
            <CardDescription>Create and manage location-based safety zones</CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Zone
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Create New Geofence */}
        {isCreating && (
          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-4">
              <h4 className="font-medium">Create New Geofence</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fence-name">Zone Name</Label>
                  <Input
                    id="fence-name"
                    value={newGeofence.name}
                    onChange={(e) => setNewGeofence({ ...newGeofence, name: e.target.value })}
                    placeholder="Enter zone name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fence-type">Zone Type</Label>
                  <Select
                    value={newGeofence.type}
                    onValueChange={(value: "safe_zone" | "danger_zone" | "custom") =>
                      setNewGeofence({ ...newGeofence, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="safe_zone">Safe Zone</SelectItem>
                      <SelectItem value="danger_zone">Danger Zone</SelectItem>
                      <SelectItem value="custom">Custom Zone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fence-radius">Radius (meters)</Label>
                  <Input
                    id="fence-radius"
                    type="number"
                    value={newGeofence.radius}
                    onChange={(e) => setNewGeofence({ ...newGeofence, radius: Number.parseInt(e.target.value) || 500 })}
                    min="50"
                    max="5000"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Center Location</Label>
                  <div className="text-sm text-muted-foreground">
                    {currentLocation
                      ? `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`
                      : "Location not available"}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={createGeofence} disabled={!newGeofence.name || !currentLocation}>
                  Create Zone
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Geofences */}
        <div className="space-y-3">
          {geofences.map((fence) => (
            <div key={fence.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div>{getGeofenceIcon(fence.type)}</div>
                <div>
                  <h4 className="font-medium text-sm">{fence.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className={getGeofenceColor(fence.type)}>
                      {fence.type.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{fence.radius}m radius</span>
                    {fence.active && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={fence.active ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleGeofence(fence.id)}
                >
                  {fence.active ? "Disable" : "Enable"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteGeofence(fence.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {geofences.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No geofences created yet</p>
            <p className="text-sm">Create your first safety zone to get started</p>
          </div>
        )}

        {/* Geofence Statistics */}
        {geofences.length > 0 && (
          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">{geofences.length}</div>
                <div className="text-xs text-muted-foreground">Total Zones</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">{geofences.filter((f) => f.active).length}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {geofences.filter((f) => f.type === "safe_zone").length}
                </div>
                <div className="text-xs text-muted-foreground">Safe Zones</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
