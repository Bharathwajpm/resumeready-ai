import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Hi! Ask me about career advice or skills to improve." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    
    // Mock AI response
    setTimeout(() => {
      const responses = [
        "Consider learning cloud technologies like AWS or Azure to boost your profile.",
        "Practice coding challenges on LeetCode to improve your problem-solving skills.",
        "Add more projects to your portfolio showcasing real-world applications.",
        "Consider getting certified in your field to stand out to employers.",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setMessages((prev) => [...prev, { role: "assistant", content: randomResponse }]);
    }, 1000);

    setInput("");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 z-50"
          >
            <Card className="neon-border neon-glow bg-card/98 backdrop-blur-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="text-lg flex items-center gap-2 text-foreground">
                  🤖 Career AI Assistant
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hover:bg-primary/20">
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto space-y-3 mb-4 scrollbar-thin scrollbar-thumb-primary/50">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground ml-4 neon-border"
                          : "bg-gradient-to-r from-muted to-muted/80 mr-4 border border-primary/30"
                      }`}
                    >
                      <span className="mr-2">{msg.role === "user" ? "👤" : "🤖"}</span>
                      {msg.content}
                    </motion.div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask me anything... 💬"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="bg-input/50 border-primary/30 focus:border-primary text-foreground"
                  />
                  <Button size="icon" onClick={handleSend} className="gradient-button neon-border">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full gradient-button neon-glow"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </motion.div>
    </>
  );
};
