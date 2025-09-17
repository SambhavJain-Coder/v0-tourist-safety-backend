"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Shield, TrendingUp } from "lucide-react"

interface SafetyScoreMeterProps {
  score: number
}

export function SafetyScoreMeter({ score }: SafetyScoreMeterProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "bg-green-100 text-green-800" }
    if (score >= 60) return { label: "Good", color: "bg-yellow-100 text-yellow-800" }
    return { label: "Needs Attention", color: "bg-red-100 text-red-800" }
  }

  const status = getScoreStatus(score)

  return (
    <Card className="bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Safety Score
        </CardTitle>
        <CardDescription>Your current safety rating based on multiple factors</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Radial Progress Meter */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-32 h-32">
            {/* Background Circle */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted/30"
              />
              {/* Progress Circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 314} 314`}
                className={getScoreColor(score)}
              />
            </svg>

            {/* Score Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</div>
                <div className="text-xs text-muted-foreground">out of 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="text-center">
          <Badge className={status.color}>{status.label}</Badge>
        </div>

        {/* Score Factors */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Location Safety</span>
            <div className="flex items-center gap-2">
              <Progress value={85} className="w-16 h-2" />
              <span className="text-xs text-muted-foreground">85%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Emergency Preparedness</span>
            <div className="flex items-center gap-2">
              <Progress value={90} className="w-16 h-2" />
              <span className="text-xs text-muted-foreground">90%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Health Monitoring</span>
            <div className="flex items-center gap-2">
              <Progress value={80} className="w-16 h-2" />
              <span className="text-xs text-muted-foreground">80%</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span>Communication Status</span>
            <div className="flex items-center gap-2">
              <Progress value={95} className="w-16 h-2" />
              <span className="text-xs text-muted-foreground">95%</span>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium">Improvement Tip</p>
              <p className="text-muted-foreground">
                Share your location with emergency contacts to boost your safety score.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
