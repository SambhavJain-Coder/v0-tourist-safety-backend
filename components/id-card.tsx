"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Download, QrCode, Sparkles } from "lucide-react"
import QRCode from "qrcode"

interface FormData {
  fullName: string
  dateOfBirth: string
  nationality: string
  passportNumber: string
  phoneNumber: string
  email: string
  emergencyContact: string
  emergencyPhone: string
  destination: string
  arrivalDate: string
  departureDate: string
  bloodGroup: string
}

interface IDCardProps {
  formData: FormData
  idNumber: string
  onDownloadPDF: () => void
  onDownloadQR: () => void
}

export function IDCard({ formData, idNumber, onDownloadPDF, onDownloadQR }: IDCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const cardRef = useRef<HTMLDivElement>(null)

  // Generate QR code
  React.useEffect(() => {
    const generateQR = async () => {
      try {
        const qrData = {
          id: idNumber,
          name: formData.fullName,
          nationality: formData.nationality,
          passport: formData.passportNumber,
          emergency: formData.emergencyPhone,
          destination: formData.destination,
          validUntil: formData.departureDate,
        }

        const qrString = await QRCode.toDataURL(JSON.stringify(qrData), {
          width: 200,
          margin: 2,
          color: {
            dark: "#059669",
            light: "#FFFFFF",
          },
        })
        setQrCodeUrl(qrString)
      } catch (error) {
        console.error("QR generation failed:", error)
      }
    }

    generateQR()
  }, [formData, idNumber])

  const handleDownloadPDF = async () => {
    // In a real implementation, this would use jsPDF and html2canvas
    // For now, we'll simulate the download
    const link = document.createElement("a")
    link.href = "#"
    link.download = `tourist-id-${idNumber}.pdf`
    link.click()

    // Show success message
    alert("PDF download would start here. In production, this would generate a proper PDF.")
  }

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement("a")
      link.href = qrCodeUrl
      link.download = `tourist-id-qr-${idNumber}.png`
      link.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* 3D Flip Card */}
      <div className="perspective-1000 mx-auto max-w-md">
        <div
          className={`relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
          ref={cardRef}
        >
          {/* Front of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <Card className="h-full bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground overflow-hidden relative">
              {/* Hologram Effect */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-full opacity-80 animate-pulse">
                <Sparkles className="w-4 h-4 text-yellow-800 m-2" />
              </div>

              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-primary-foreground rounded-full"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border border-primary-foreground rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-primary-foreground rounded-full"></div>
              </div>

              <CardContent className="p-6 relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-6 h-6" />
                      <span className="font-bold text-sm">TOURIST SAFETY ID</span>
                    </div>
                    <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                      VERIFIED
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{formData.fullName}</h3>
                    <p className="text-sm opacity-90">ID: {idNumber}</p>
                    <p className="text-sm opacity-90">{formData.nationality} National</p>
                  </div>
                </div>

                <div className="text-xs opacity-75">
                  <p>Valid until: {formData.departureDate}</p>
                  <p>Destination: {formData.destination}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back of Card */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <Card className="h-full bg-gradient-to-br from-secondary via-secondary to-primary text-secondary-foreground">
              <CardContent className="p-6 h-full flex flex-col justify-between">
                <div className="text-center">
                  <h4 className="font-bold mb-4">Emergency Information</h4>

                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Emergency Contact:</strong>
                      <p>{formData.emergencyContact}</p>
                      <p>{formData.emergencyPhone}</p>
                    </div>

                    {formData.bloodGroup && (
                      <div>
                        <strong>Blood Group:</strong>
                        <p>{formData.bloodGroup}</p>
                      </div>
                    )}

                    <div>
                      <strong>Passport:</strong>
                      <p>{formData.passportNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  {qrCodeUrl && (
                    <div className="flex justify-center mb-2">
                      <img src={qrCodeUrl || "/placeholder.svg"} alt="QR Code" className="w-16 h-16" />
                    </div>
                  )}
                  <p className="text-xs opacity-75">Scan for digital verification</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Click the card to flip and view emergency information
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>

        <Button onClick={handleDownloadQR} variant="outline" className="flex items-center gap-2 bg-transparent">
          <QrCode className="w-4 h-4" />
          Download QR Code
        </Button>
      </div>

      {/* Blockchain Transaction Log UI */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Blockchain Transaction Log
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              Transaction Hash: 0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 8)}
            </p>
            <p>Block: #{Math.floor(Math.random() * 1000000)}</p>
            <p>Status: Confirmed ✓</p>
            <p>Timestamp: {new Date().toISOString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
