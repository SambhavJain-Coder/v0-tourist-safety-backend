import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, language = "English" } = await request.json()

    // Simulate AI response for now - will integrate with actual AI service later
    const responses = {
      English: {
        help: "I'm here to help you with tourist safety information. What do you need assistance with?",
        emergency:
          "In case of emergency, press the SOS button or call local emergency services. I can help guide you through the process.",
        location: "I can help you with location-based safety information and nearby emergency services.",
        default:
          "Hello! I'm your AI safety assistant. I can help with emergency procedures, local safety information, and general tourist guidance.",
      },
      Hindi: {
        help: "मैं पर्यटक सुरक्षा जानकारी के साथ आपकी सहायता करने के लिए यहाँ हूँ। आपको किस चीज़ में सहायता चाहिए?",
        emergency: "आपातकाल की स्थिति में, SOS बटन दबाएं या स्थानीय आपातकालीन सेवाओं को कॉल करें।",
        location: "मैं स्थान-आधारित सुरक्षा जानकारी और आस-पास की आपातकालीन सेवाओं के साथ आपकी सहायता कर सकता हूँ।",
        default:
          "नमस्ते! मैं आपका AI सुरक्षा सहायक हूँ। मैं आपातकालीन प्रक्रियाओं, स्थानीय सुरक्षा जानकारी और सामान्य पर्यटक मार्गदर्शन में सहायता कर सकता हूँ।",
      },
    }

    const langResponses = responses[language as keyof typeof responses] || responses["English"]

    let response = langResponses.default
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("help") || lowerMessage.includes("सहायता")) {
      response = langResponses.help
    } else if (lowerMessage.includes("emergency") || lowerMessage.includes("आपातकाल")) {
      response = langResponses.emergency
    } else if (lowerMessage.includes("location") || lowerMessage.includes("स्थान")) {
      response = langResponses.location
    }

    return NextResponse.json({
      message: response,
      timestamp: new Date().toISOString(),
      language,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
