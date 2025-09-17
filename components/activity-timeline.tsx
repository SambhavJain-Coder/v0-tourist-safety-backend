"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, Shield, Phone, MessageCircle, Camera } from "lucide-react"

interface TimelineEvent {
  id: string
  type: "location" | "safety" | "communication" | "emergency" | "system"
  title: string
  description: string
  timestamp: Date
  status?: "success" | "warning" | "error" | "info"
}

export function ActivityTimeline() {
  const events: TimelineEvent[] = [
    {
      id: "1",
      type: "location",
      title: "Location Updated",
      description: "Arrived at New Delhi Railway Station",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      status: "success",
    },
    {
      id: "2",
      type: "safety",
      title: "Safety Check Completed",
      description: "All safety parameters within normal range",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: "success",
    },
    {
      id: "3",
      type: "communication",
      title: "Emergency Contact Sync",
      description: "Emergency contacts updated and verified",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: "info",
    },
    {
      id: "4",
      type: "system",
      title: "Digital ID Generated",
      description: "Tourist safety ID created and blockchain verified",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: "success",
    },
    {
      id: "5",
      type: "location",
      title: "Geofence Alert",
      description: "Entered monitored tourist area - Red Fort vicinity",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      status: "info",
    },
  ]

  const getEventIcon = (type: string) => {
    switch (type) {
      case "location":
        return <MapPin className="w-4 h-4" />
      case "safety":
        return <Shield className="w-4 h-4" />
      case "communication":
        return <MessageCircle className="w-4 h-4" />
      case "emergency":
        return <Phone className="w-4 h-4" />
      case "system":
        return <Camera className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      case "info":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Activity Timeline
        </CardTitle>
        <CardDescription>Recent safety and location activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              {/* Timeline Line */}
              {index < events.length - 1 && <div className="absolute left-6 top-8 w-0.5 h-8 bg-border"></div>}

              <div className="flex items-start gap-4">
                {/* Event Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <div className="text-primary">{getEventIcon(event.type)}</div>
                </div>

                {/* Event Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{event.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(event.timestamp)}
                      </span>
                      {event.status && (
                        <Badge variant="secondary" className={getStatusColor(event.status)}>
                          {event.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-6 text-center">
          <button className="text-sm text-primary hover:underline">View complete activity log</button>
        </div>
      </CardContent>
    </Card>
  )
}
