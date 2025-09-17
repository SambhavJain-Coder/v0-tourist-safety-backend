"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AuthGuard } from "@/components/auth-guard"
import { SafetyScoreMeter } from "@/components/safety-score-meter"
import { LiveMap } from "@/components/live-map"
import { SOSButton } from "@/components/sos-button"
import { ActivityTimeline } from "@/components/activity-timeline"
import { AlertsFeed } from "@/components/alerts-feed"
import { ChatbotSidebar } from "@/components/chatbot-sidebar"
import FloatingChatButton from "@/components/floating-chat-button"
import { Shield, MapPin, Clock, Settings, User, Phone, Navigation, Heart, Wifi, Battery } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  currentLocation?: {
    lat: number
    lng: number
    address: string
  }
  safetyScore: number
  isTracking: boolean
  emergencyContacts: Array<{
    name: string
    phone: string
    relationship: string
  }>
}

export default function TouristDashboard() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Simulate fetching user profile
    const mockProfile: UserProfile = {
      id: "user_123",
      name: "John Tourist",
      email: "john@example.com",
      avatar: "/diverse-user-avatars.png",
      currentLocation: {
        lat: 28.6139,
        lng: 77.209,
        address: "New Delhi, India",
      },
      safetyScore: 85,
      isTracking: true,
      emergencyContacts: [
        { name: "Jane Tourist", phone: "+1-555-0123", relationship: "Spouse" },
        { name: "Emergency Services", phone: "112", relationship: "Emergency" },
      ],
    }

    setUserProfile(mockProfile)

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const toggleTracking = () => {
    if (userProfile) {
      setUserProfile({
        ...userProfile,
        isTracking: !userProfile.isTracking,
      })
    }
  }

  if (!userProfile) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    )
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
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Tourist Safety Dashboard</h1>
                  <p className="text-sm text-muted-foreground">Welcome back, {userProfile.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Status Indicators */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">Online</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery className="w-4 h-4 text-green-500" />
                    <span className="text-muted-foreground">85%</span>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>

                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-8 space-y-6">
              {/* Welcome Card with Avatar */}
              <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-foreground mb-1">
                        Good{" "}
                        {currentTime.getHours() < 12
                          ? "Morning"
                          : currentTime.getHours() < 18
                            ? "Afternoon"
                            : "Evening"}
                        , {userProfile.name}!
                      </h2>
                      <p className="text-muted-foreground mb-2">
                        You're currently in {userProfile.currentLocation?.address}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <MapPin className="w-3 h-3 mr-1" />
                          Location Tracked
                        </Badge>
                        <span className="text-muted-foreground">
                          <Clock className="w-4 h-4 inline mr-1" />
                          {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Score and Quick Actions */}
              <div className="grid md:grid-cols-2 gap-6">
                <SafetyScoreMeter score={userProfile.safetyScore} />

                <Card className="bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Navigation className="w-5 h-5 text-primary" />
                      Location Tracking
                    </CardTitle>
                    <CardDescription>
                      {userProfile.isTracking
                        ? "Your location is being monitored for safety"
                        : "Location tracking is disabled"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Real-time Tracking</span>
                      <Button
                        variant={userProfile.isTracking ? "default" : "outline"}
                        size="sm"
                        onClick={toggleTracking}
                      >
                        {userProfile.isTracking ? "Enabled" : "Disabled"}
                      </Button>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      <p>Last updated: {currentTime.toLocaleTimeString()}</p>
                      <p>Accuracy: ±5 meters</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Live Map */}
              <LiveMap
                center={userProfile.currentLocation}
                isTracking={userProfile.isTracking}
                userLocation={userProfile.currentLocation}
              />

              {/* Activity Timeline */}
              <ActivityTimeline />
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* SOS Emergency Button */}
              <SOSButton emergencyContacts={userProfile.emergencyContacts} userLocation={userProfile.currentLocation} />

              {/* Emergency Contacts */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-primary" />
                    Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {userProfile.emergencyContacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">{contact.relationship}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Phone className="w-3 h-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Health Status */}
              <Card className="bg-card/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Heart Rate</span>
                    <Badge variant="secondary">72 BPM</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Activity Level</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Check</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </div>
                </CardContent>
              </Card>

              {/* Alerts Feed */}
              <AlertsFeed />
            </div>
          </div>
        </div>

        {/* Floating Chat Button */}
        <FloatingChatButton />

        {/* Chatbot Sidebar */}
        <ChatbotSidebar isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </AuthGuard>
  )
}
