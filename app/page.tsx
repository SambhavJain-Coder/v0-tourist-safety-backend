"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, MapPin, MessageCircle, Users, AlertTriangle, Globe } from "lucide-react"
import Link from "next/link"
import FloatingChatButton from "@/components/floating-chat-button"

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const languages = [
    "English",
    "Hindi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Kannada",
    "Malayalam",
    "Odia",
    "Punjabi",
    "Assamese",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section with Particle Background Effect */}
      <div className="relative overflow-hidden">
        {/* Animated Background Particles */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-accent rounded-full animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-primary/50 rounded-full animate-pulse delay-300"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent/70 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Language Selector */}
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg p-2 border">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Shield className="w-20 h-20 text-primary" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">AI</span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl font-bold text-foreground mb-6 text-balance">
              Smart Tourist Safety
              <span className="text-primary block">Monitoring System</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
              Advanced AI-powered platform ensuring tourist safety through real-time monitoring, digital ID management,
              and instant emergency response capabilities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/id-generator">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                  Generate Tourist ID
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                  Tourist Dashboard
                </Button>
              </Link>
              <Link href="/maps">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent">
                  Interactive Maps
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              <Badge variant="secondary" className="px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Blockchain Secured
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Real-time Tracking
              </Badge>
              <Badge variant="secondary" className="px-4 py-2">
                <MessageCircle className="w-4 h-4 mr-2" />
                AI Assistant
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Comprehensive Safety Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform combines cutting-edge technology with user-friendly design to provide unparalleled tourist
            safety solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Digital ID Card */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Digital ID Generation</CardTitle>
              <CardDescription>
                Secure blockchain-based digital IDs with QR codes and PDF export capabilities
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Live Maps */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Live Maps & Geofencing</CardTitle>
              <CardDescription>
                Real-time location tracking with geofencing alerts and safety zone monitoring
              </CardDescription>
            </CardHeader>
          </Card>

          {/* AI Chatbot */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>AI Safety Assistant</CardTitle>
              <CardDescription>Multilingual AI chatbot providing instant help and emergency guidance</CardDescription>
            </CardHeader>
          </Card>

          {/* Emergency Response */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Emergency Response</CardTitle>
              <CardDescription>Instant SOS alerts with automated emergency service notifications</CardDescription>
            </CardHeader>
          </Card>

          {/* Police Dashboard */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Police Dashboard</CardTitle>
              <CardDescription>
                Comprehensive monitoring tools for law enforcement with real-time alerts
              </CardDescription>
            </CardHeader>
          </Card>

          {/* IoT Integration */}
          <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CardHeader className="relative z-10">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <div className="w-6 h-6 bg-accent rounded-full animate-pulse"></div>
              </div>
              <CardTitle>IoT Monitoring</CardTitle>
              <CardDescription>Wearable device integration for health monitoring and automatic alerts</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card/30 backdrop-blur-sm border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            © 2024 Smart Tourist Safety System. Powered by AI and Blockchain Technology.
          </p>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <FloatingChatButton />
    </div>
  )
}
