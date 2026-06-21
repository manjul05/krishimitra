"use client";

import { FormEvent, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedSection } from "./AnimatedSection";

type Message = {
  role: "user" | "bot";
  text: string;
};

const suggestedChips = [
  "मौसम सलाह",
  "गेहूं उर्वरक",
  "कीट नियंत्रण",
  "Soil health",
];

const botResponses: { match: RegExp; reply: string }[] = [
  {
    match: /मौसम|weather|rain|barish|सलाह/i,
    reply:
      "अगले 3 दिनों में हल्की बारिश की संभावना है। गेहूं के लिए सिंचाई कम करें और नाइट्रोजन खाद से बचें।",
  },
  {
    match: /fertilizer|wheat|gehun|गेहूं|उर्वरक|खाद/i,
    reply:
      "गेहूं की फसल में टिलering स्टेज पर प्रति एकड़ 50 kg यूरिया split doses में दें। खाद डालने से पहले मिट्टी में नमी सुनिश्चित करें।",
  },
  {
    match: /pest|insect|keeda|कीट|नियंत्रण/i,
    reply:
      "पहले कीट की पहचान करें — एफिड्स के लिए नीम का तेल (3%) प्रभावी है। तना छेदक के लिए फेरोमोन ट्रैप लगाएं।",
  },
  {
    match: /soil|मिट्टी|health/i,
    reply:
      "Healthy soil needs pH 6.0–7.0. Add organic compost (5 tons/acre) and get soil tested every 2 years. Rotate crops to maintain nitrogen levels.",
  },
  {
    match: /disease|blight|rust|fungal/i,
    reply:
      "Upload a clear photo on our Detect page for instant diagnosis. Early detection improves recovery rates by up to 80%.",
  },
];

function getBotReply(input: string): string {
  for (const { match, reply } of botResponses) {
    if (match.test(input)) return reply;
  }
  return "I'm your KrishiMitra assistant! Ask about crop diseases, fertilizers, weather advice, or pest control — I can help in Hindi and English.";
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3">
      <span className="km-typing-dot h-2 w-2 rounded-full bg-km-green-muted" />
      <span className="km-typing-dot h-2 w-2 rounded-full bg-km-green-muted" />
      <span className="km-typing-dot h-2 w-2 rounded-full bg-km-green-muted" />
    </div>
  );
}

export default function ChatPreview() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Namaste! 🌾 I'm your AI farming assistant. Ask me anything about crops, weather, or pest control — in Hindi or English.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: getBotReply(trimmed) },
      ]);
      setIsTyping(false);
      setTimeout(scrollToBottom, 50);
    }, 1200);

    setTimeout(scrollToBottom, 50);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <AnimatedSection
      id="ai-chat"
      className="px-4 py-16 md:px-10 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="AI Assistant"
          title="Ask Your AI Farming Assistant"
          subtitle="Try a live preview — type a question or tap a suggestion below. Supports Hindi and English."
        />

        <motion.div
          className="mx-auto max-w-2xl overflow-hidden rounded-2xl km-glass shadow-xl shadow-km-green/5"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 border-b border-km-border/40 bg-km-green-light/30 px-5 py-4 dark:border-km-green/15 dark:bg-km-green/10">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg shadow-sm dark:bg-km-green-dark/60">
              🌾
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-km-dark dark:text-km-green-light">
                KrishiMitra AI
              </p>
              <p className="flex items-center gap-1.5 text-xs km-text-muted">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-km-green" />
                Online · Hindi & English
              </p>
            </div>
          </div>

          <div className="flex h-72 flex-col gap-3 overflow-y-auto bg-gray-50/50 p-4 dark:bg-km-green-dark/10">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-sm bg-km-green text-white shadow-sm"
                      : "rounded-bl-sm border border-km-border/40 bg-white km-text-primary shadow-sm dark:border-km-green/15 dark:bg-km-green-dark/40"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-km-border/40 bg-white shadow-sm dark:border-km-green/15 dark:bg-km-green-dark/40">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="border-t border-km-border/40 bg-white/80 px-4 py-3 dark:border-km-green/15 dark:bg-km-green-dark/20">
            <div className="mb-3 flex flex-wrap gap-2">
              {suggestedChips.map((chip) => (
                <motion.button
                  key={chip}
                  type="button"
                  onClick={() => sendMessage(chip)}
                  disabled={isTyping}
                  className="rounded-full border border-km-border/60 bg-km-green-light/60 px-3 py-1 text-xs font-medium text-km-green transition-colors hover:border-km-green/30 hover:bg-km-hero-end disabled:opacity-50 dark:border-km-green/20 dark:bg-km-green/10"
                  whileTap={{ scale: 0.95 }}
                >
                  {chip}
                </motion.button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your farming question..."
                disabled={isTyping}
                className="flex-1 rounded-xl border border-km-border/60 bg-gray-50/50 px-4 py-2.5 text-sm outline-none transition-colors focus:border-km-green focus:bg-white focus:ring-2 focus:ring-km-green/15 disabled:opacity-50 dark:border-km-green/20 dark:bg-km-green-dark/20 dark:focus:bg-km-green-dark/30"
              />
              <motion.button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="rounded-xl bg-km-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-km-green/20 transition-all hover:bg-km-green-dark disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                Send
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
