import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  HelpCircle,
  FileText,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import SectionHeader from '../../components/common/SectionHeader';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import LoadingState from '../../components/common/LoadingState';
import ErrorAlert from '../../components/common/ErrorAlert';
import { SAMPLE_KNOWLEDGE_QUESTIONS } from '../../data/sampleData';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'assistant',
    text: "Hello! I am your Construction Knowledge & Code Assistant. You can ask me questions about building codes (IBC, ACI, AISC), OSHA safety regulations, concrete curing requirements, or structural failure diagnostics. How can I assist you on-site today?",
    timestamp: '10:00 AM',
  },
  {
    id: 2,
    sender: 'user',
    text: 'What are the permissible crack widths in reinforced concrete according to ACI 224R?',
    timestamp: '10:02 AM',
  },
  {
    id: 3,
    sender: 'assistant',
    text: `According to **ACI 224R-01 (Control of Cracking in Concrete Structures)**, the maximum tolerable crack widths under service loads are:

- **Dry air or protective membrane:** 0.41 mm (0.016 in.)
- **Humidity, moist air, soil:** 0.30 mm (0.012 in.)
- **Deicing chemicals:** 0.18 mm (0.007 in.)
- **Seawater and seawater spray:** 0.15 mm (0.006 in.)
- **Water-retaining structures:** 0.10 mm (0.004 in.)

For cracks exceeding these limits in exterior columns or retaining walls, non-destructive testing (such as ultrasonic pulse velocity) and epoxy injection are recommended.`,
    timestamp: '10:02 AM',
  },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [viewState, setViewState] = useState('normal');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputValue;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate LLM streaming latency
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Based on standard construction engineering codes and OSHA 1926 guidelines, ensure adequate shoring, proper PPE compliance, and follow ASTM C39 compressive testing procedures before loading the structure.";
      
      if (query.toLowerCase().includes('crane') || query.toLowerCase().includes('power')) {
        replyText = `**OSHA Standard 1926.1408 (Power line safety for cranes):**\n\n- For lines up to 50 kV: Minimum clearance is **10 feet (3.05 m)**.\n- For lines over 50 kV: Add 0.4 inches for each 1 kV over 50 kV, or maintain **20 feet** minimum buffer.\n- A designated dedicated spotter must be assigned whenever equipment operates within the boundary.`;
      } else if (query.toLowerCase().includes('curing') || query.toLowerCase().includes('weather')) {
        replyText = `**ACI 308R Guide to External Curing of Concrete:**\n\n- In hot or windy conditions, use continuous wet burlap or ASTM C309 curing compounds within 30 minutes of final finishing.\n- Avoid thermal shock when stripping forms—keep internal vs. surface temperature gradient under 20°C (36°F).`;
      }

      const botReply = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Construction Knowledge Assistant"
        subtitle="Specialized AI agent trained on building codes (ACI, IBC, AISC), OSHA standards, and engineering specifications"
        badgeText="Multimodal LLM"
        badgeVariant="blue"
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">UI Test Modes:</span>
            <select
              value={viewState}
              onChange={(e) => setViewState(e.target.value)}
              className="text-xs bg-slate-800 border border-slate-700 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden"
            >
              <option value="normal">Normal Chat</option>
              <option value="loading">Loading State</option>
              <option value="empty">Empty Chat State</option>
              <option value="error">Error State</option>
            </select>
          </div>
        }
      />

      {viewState === 'loading' && (
        <LoadingState
          message="Connecting to Multimodal LLM Assistant..."
          subtext="Loading construction knowledge embeddings and architectural code indexes"
        />
      )}

      {viewState === 'error' && (
        <ErrorAlert
          title="LLM Service Unavailable"
          message="Unable to communicate with the AI reasoning agent. (FastAPI backend will be added in Phase 2 & 4)."
          onRetry={() => setViewState('normal')}
          onDismiss={() => setViewState('normal')}
        />
      )}

      {viewState === 'empty' && (
        <EmptyState
          title="No Messages in History"
          description="Start a new conversation with the AI Construction Engineer."
          actionLabel="Load Starter Prompts"
          onAction={() => {
            setViewState('normal');
            setMessages(INITIAL_MESSAGES);
          }}
        />
      )}

      {viewState === 'normal' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chat Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-[650px] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    BuildIntel Assistant
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Phase 1 Demo UI • Multimodal LLM Pending
                  </div>
                </div>
              </div>

              <button
                onClick={() => setMessages(INITIAL_MESSAGES.slice(0, 1))}
                className="text-xs text-slate-400 hover:text-white p-1.5 rounded hover:bg-slate-800 flex items-center gap-1"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Clear Chat</span>
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-xs'
                        : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-xs whitespace-pre-line'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div
                      className={`text-[9px] mt-2 font-mono ${
                        msg.sender === 'user' ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center text-xs text-slate-400">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce delay-200" />
                    <span className="text-[11px] text-slate-400 ml-1">Analyzing code standard...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask any question about OSHA standards, concrete curing, or building codes..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-400 text-xs rounded-xl px-3.5 py-2.5 focus:border-amber-400 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Prompt Library Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Suggested Inquiries</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Click any prompt to instantly run a query against the knowledge assistant:
              </p>

              <div className="space-y-2">
                {SAMPLE_KNOWLEDGE_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>

            {/* Knowledge Base Scope Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xs text-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <FileText className="w-4 h-4" />
                <span>Integrated Standards Library</span>
              </div>
              <ul className="text-slate-400 space-y-1.5 pt-1">
                <li>• <strong>OSHA 1926</strong> — Safety & Health Regulations for Construction</li>
                <li>• <strong>ACI 318 / 224R</strong> — Building Code for Structural Concrete</li>
                <li>• <strong>AISC 360</strong> — Specification for Structural Steel Buildings</li>
                <li>• <strong>IBC 2024</strong> — International Building Code Provisions</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
