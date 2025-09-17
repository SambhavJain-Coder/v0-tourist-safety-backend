"use client"

import { useState, useRef, useEffect } from "react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  language?: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your AI safety assistant. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
    { code: "bn", name: "বাংলা" },
    { code: "te", name: "తెలుగు" },
    { code: "mr", name: "मराठी" },
    { code: "ta", name: "தமிழ்" },
    { code: "gu", name: "ગુજરાતી" },
    { code: "kn", name: "ಕನ್ನಡ" },
    { code: "ml", name: "മലയാളം" },
    { code: "pa", name: "ਪੰਜਾਬੀ" },
    { code: "or", name: "ଓଡ଼ିଆ" },
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputText, selectedLanguage),
        sender: "bot",
        timestamp: new Date(),
        language: selectedLanguage,
      }
      setMessages((prev) => [...prev, botResponse])
      setIsLoading(false)

      // Text-to-speech for bot response
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(botResponse.text)
        utterance.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
        speechSynthesis.speak(utterance)
      }
    }, 1500)
  }

  const generateAIResponse = (input: string, language: string): string => {
    const responses = {
      en: {
        emergency:
          "I understand this is an emergency. I'm immediately alerting nearby authorities and emergency services. Stay calm and share your exact location.",
        location:
          "I can help you with location services. Please enable GPS for accurate positioning. I'll guide you to the nearest safe zone or tourist help center.",
        safety:
          "Your safety is our priority. Based on your location, the current safety score is high. I recommend staying in well-lit, populated areas.",
        default:
          "I'm here to help with your safety concerns. You can ask me about emergency services, safe locations, or report any incidents.",
      },
      hi: {
        emergency:
          "मैं समझता हूं कि यह एक आपातकाल है। मैं तुरंत नजदीकी अधिकारियों और आपातकालीन सेवाओं को सचेत कर रहा हूं। शांत रहें और अपना सटीक स्थान साझा करें।",
        location:
          "मैं आपको स्थान सेवाओं में मदद कर सकता हूं। कृपया सटीक स्थिति के लिए GPS सक्षम करें। मैं आपको निकटतम सुरक्षित क्षेत्र या पर्यटक सहायता केंद्र तक पहुंचाऊंगा।",
        safety:
          "आपकी सुरक्षा हमारी प्राथमिकता है। आपके स्थान के आधार पर, वर्तमान सुरक्षा स्कोर उच्च है। मैं अच्छी तरह से रोशनी वाले, आबादी वाले क्षेत्रों में रहने की सलाह देता हूं।",
        default:
          "मैं आपकी सुरक्षा संबंधी चिंताओं में मदद के लिए यहां हूं। आप मुझसे आपातकालीन सेवाओं, सुरक्षित स्थानों के बारे में पूछ सकते हैं या कोई घटना की रिपोर्ट कर सकते हैं।",
      },
    }

    const langResponses = responses[language as keyof typeof responses] || responses.en

    if (input.toLowerCase().includes("emergency") || input.toLowerCase().includes("help")) {
      return langResponses.emergency
    } else if (input.toLowerCase().includes("location") || input.toLowerCase().includes("where")) {
      return langResponses.location
    } else if (input.toLowerCase().includes("safe") || input.toLowerCase().includes("security")) {
      return langResponses.safety
    } else {
      return langResponses.default
    }
  }

  const startVoiceRecognition = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"

      recognition.onstart = () => {
        setIsListening(true)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setInputText(transcript)
        setIsListening(false)
      }

      recognition.onerror = () => {
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognition.start()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-t-xl p-6 border border-white/20 border-b-0">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">AI Safety Assistant</h1>
                <p className="text-emerald-200">Multilingual support • Voice enabled • 24/7 available</p>
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-slate-800">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/20 border-y-0 h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white border border-white/20"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/10 border border-white/20 rounded-lg px-4 py-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-b-xl p-6 border border-white/20 border-t-0">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Type your message or use voice input..."
                className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-300"
              />
              <button
                onClick={startVoiceRecognition}
                disabled={isListening}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isListening ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600"
                } text-white`}
              >
                {isListening ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                )}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setInputText("Emergency! I need immediate help!")}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-sm transition-colors"
              >
                🚨 Emergency
              </button>
              <button
                onClick={() => setInputText("Where is the nearest safe location?")}
                className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm transition-colors"
              >
                📍 Safe Location
              </button>
              <button
                onClick={() => setInputText("What is my current safety score?")}
                className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-sm transition-colors"
              >
                🛡️ Safety Score
              </button>
              <button
                onClick={() => setInputText("Show me nearby emergency services")}
                className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-full text-sm transition-colors"
              >
                🏥 Emergency Services
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
