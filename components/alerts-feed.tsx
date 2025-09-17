"use client"

import React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, AlertTriangle, Info, CheckCircle, X } from "lucide-react"

interface Alert {
  id: string
  type: "emergency" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: Date
  location?: string
  isRead: boolean
}

export function AlertsFeed() {
  const [alerts, setAlerts] = React.useState<Alert[]>([
    {
      id: "1",
      type: "warning",
      title: "Weather Alert",
      message: "Heavy rainfall expected in your area. Plan indoor activities.",
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      location: "New Delhi",
      isRead: false,
    },
    {
      id: "2",
      type: "info",
      title: "Tourist Event",
      message: "Cultural festival happening at India Gate. Great photo opportunity!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      location: "India Gate",
      isRead: false,
    },
    {
      id: "3",
      type: "success",
      title: "Safety Check",
      message: "Your safety score has improved to 85/100. Great job!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      location: "NH-1",
      isRead: true,
    },
    {
      id: "4",
      type: "emergency",
      title: "Traffic Alert",
      message: "Road closure on NH-1. Alternative routes suggested.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      location: "NH-1",
      isRead: true,
    },
  ])

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch("/api/alerts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          if (data.alerts) {
            const apiAlerts = data.alerts.map((alert: any) => ({
              ...alert,
              timestamp: new Date(alert.timestamp),
            }))
            setAlerts((prev) => [...apiAlerts, ...prev.filter((a) => !apiAlerts.find((api: any) => api.id === a.id))])
          }
        }
      } catch (error) {
        console.error("[v0] Failed to fetch alerts:", error)
      }
    }

    fetchAlerts()

    const interval = setInterval(fetchAlerts, 30000)
    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "info":
        return <Info className="w-4 h-4 text-blue-500" />
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      case "success":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const markAsRead = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}/read`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))
    } catch (error) {
      console.error("[v0] Failed to mark alert as read:", error)
      setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)))
    }
  }

  const dismissAlert = async (alertId: string) => {
    try {
      await fetch(`/api/alerts/${alertId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      setAlerts(alerts.filter((alert) => alert.id !== alertId))
    } catch (error) {
      console.error("[v0] Failed to dismiss alert:", error)
      setAlerts(alerts.filter((alert) => alert.id !== alertId))
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

  const unreadCount = alerts.filter((alert) => !alert.isRead).length

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Safety Alerts
          </div>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              {unreadCount} new
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Real-time safety and location alerts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No alerts at the moment</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border transition-all ${getAlertColor(alert.type)} ${
                !alert.isRead ? "border-l-4" : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-0.5">{getAlertIcon(alert.type)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-medium text-sm ${!alert.isRead ? "font-semibold" : ""}`}>{alert.title}</h4>
                      {!alert.isRead && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                    </div>

                    <p className="text-sm text-muted-foreground mb-2">{alert.message}</p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatTimeAgo(alert.timestamp)}</span>
                      {alert.location && (
                        <>
                          <span>•</span>
                          <span>{alert.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!alert.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => markAsRead(alert.id)}
                      title="Mark as read"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => dismissAlert(alert.id)}
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}

        {alerts.length > 0 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-xs">
              View all alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
