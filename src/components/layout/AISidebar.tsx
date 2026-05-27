import { useState } from 'react'
import { X, Send, Bot, User } from 'lucide-react'

interface AISidebarProps {
  onClose: () => void
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function AISidebar({ onClose }: AISidebarProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Welcome to SiteGeiste AI. I\'m Kimi, your workspace assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I received: "${input}". This is a placeholder response. In production, this will connect to the Kimi API for real responses.`,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1000)
  }

  return (
    <aside className="w-80 bg-njz-bg-elevated border-l border-njz-border flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="h-14 border-b border-njz-border flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-njz-accent-teal" />
          <span className="font-semibold text-njz-text">Kimi AI</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-njz-bg-overlay text-njz-text-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'assistant'
                ? 'bg-njz-accent-teal/20'
                : 'bg-njz-accent-purple/20'
            }`}>
              {msg.role === 'assistant'
                ? <Bot className="w-4 h-4 text-njz-accent-teal" />
                : <User className="w-4 h-4 text-njz-accent-purple" />
              }
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
              msg.role === 'assistant'
                ? 'bg-njz-bg-overlay text-njz-text'
                : 'bg-njz-accent-teal text-white'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-njz-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Kimi..."
            className="flex-1 bg-njz-bg border border-njz-border rounded-lg px-3 py-2 text-sm text-njz-text placeholder:text-njz-text-subtle focus:outline-none focus:border-njz-accent-teal/50"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-njz-accent-teal rounded-lg text-white hover:bg-njz-accent-teal/80 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}