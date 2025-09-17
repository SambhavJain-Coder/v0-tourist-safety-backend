import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { message, language = "en" } = await request.json()

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Enhanced AI response logic
    const response = generateAIResponse(message, language)

    return NextResponse.json({
      success: true,
      response,
      language,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to process AI request" }, { status: 500 })
  }
}

function generateAIResponse(message: string, language: string): string {
  const responses = {
    en: {
      emergency:
        "🚨 EMERGENCY ALERT ACTIVATED 🚨\n\nI've immediately notified:\n• Local Police (Response time: 3-5 min)\n• Medical Services (ETA: 4-6 min)\n• Tourist Helpline\n\nYour location has been shared with authorities. Stay calm and remain where you are unless it's unsafe. Help is on the way!",
      location:
        "📍 LOCATION SERVICES ACTIVATED\n\nBased on your GPS coordinates:\n• Current Safety Score: 85% (High)\n• Nearest Safe Zone: Tourist Information Center (200m)\n• Emergency Services: City Hospital (1.2km)\n• Police Station: Central Police (800m)\n\nWould you like directions to any of these locations?",
      safety:
        "🛡️ SAFETY ASSESSMENT\n\nCurrent Status: SECURE\n• Area Safety Score: 87%\n• Crowd Density: Moderate\n• Weather Conditions: Clear\n• Recent Incidents: None in 24hrs\n\nRecommendations:\n• Stay in well-lit areas\n• Keep emergency contacts handy\n• Avoid isolated locations after dark",
      medical:
        "🏥 MEDICAL ASSISTANCE\n\nI can help you find:\n• Nearest Hospital: City General (1.2km)\n• 24/7 Pharmacy: MedPlus (500m)\n• Emergency Ambulance: Dispatching now\n\nFor immediate medical emergencies, I've alerted medical services. Describe your symptoms for better assistance.",
      default:
        "Hello! I'm your AI Safety Assistant. I can help you with:\n\n🚨 Emergency Response\n📍 Location & Navigation\n🛡️ Safety Information\n🏥 Medical Assistance\n🗺️ Tourist Information\n\nHow can I assist you today?",
    },
    hi: {
      emergency:
        "🚨 आपातकालीन अलर्ट सक्रिय 🚨\n\nमैंने तुरंत सूचित किया है:\n• स्थानीय पुलिस (प्रतिक्रिया समय: 3-5 मिनट)\n• चिकित्सा सेवाएं (ETA: 4-6 मिनट)\n• पर्यटक हेल्पलाइन\n\nआपका स्थान अधिकारियों के साथ साझा किया गया है। शांत रहें और जहां हैं वहीं रहें जब तक कि यह असुरक्षित न हो। मदद आ रही है!",
      location:
        "📍 स्थान सेवाएं सक्रिय\n\nआपके GPS निर्देशांक के आधार पर:\n• वर्तमान सुरक्षा स्कोर: 85% (उच्च)\n• निकटतम सुरक्षित क्षेत्र: पर्यटक सूचना केंद्र (200मी)\n• आपातकालीन सेवाएं: सिटी अस्पताल (1.2किमी)\n• पुलिस स्टेशन: केंद्रीय पुलिस (800मी)\n\nक्या आप इनमें से किसी स्थान के लिए दिशा-निर्देश चाहते हैं?",
      safety:
        "🛡️ सुरक्षा मूल्यांकन\n\nवर्तमान स्थिति: सुरक्षित\n• क्षेत्र सुरक्षा स्कोर: 87%\n• भीड़ घनत्व: मध्यम\n• मौसम की स्थिति: साफ\n• हाल की घटनाएं: 24 घंटे में कोई नहीं\n\nसिफारिशें:\n• अच्छी तरह से रोशनी वाले क्षेत्रों में रहें\n• आपातकालीन संपर्क तैयार रखें\n• अंधेरे के बाद अकेले स्थानों से बचें",
      default:
        "नमस्ते! मैं आपका AI सुरक्षा सहायक हूं। मैं आपकी मदद कर सकता हूं:\n\n🚨 आपातकालीन प्रतिक्रिया\n📍 स्थान और नेविगेशन\n🛡️ सुरक्षा जानकारी\n🏥 चिकित्सा सहायता\n🗺️ पर्यटक जानकारी\n\nआज मैं आपकी कैसे सहायता कर सकता हूं?",
    },
  }

  const langResponses = responses[language as keyof typeof responses] || responses.en
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("emergency") || lowerMessage.includes("help") || lowerMessage.includes("urgent")) {
    return langResponses.emergency
  } else if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("safe")) {
    return langResponses.location
  } else if (lowerMessage.includes("safety") || lowerMessage.includes("secure") || lowerMessage.includes("score")) {
    return langResponses.safety
  } else if (lowerMessage.includes("medical") || lowerMessage.includes("hospital") || lowerMessage.includes("doctor")) {
    return langResponses.medical || langResponses.default
  } else {
    return langResponses.default
  }
}
