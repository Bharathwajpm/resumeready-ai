import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface JobDescriptionInputProps {
  onTextChange: (text: string) => void;
}

export const JobDescriptionInput = ({ onTextChange }: JobDescriptionInputProps) => {
  const [text, setText] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    onTextChange(newText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="h-full neon-border hover:neon-glow transition-all duration-300 bg-card/95 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Briefcase className="h-5 w-5 text-primary" />
            💼 Job Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste the job description here..."
            value={text}
            onChange={handleChange}
            className="min-h-[300px] resize-none bg-input/50 border-primary/30 focus:border-primary text-foreground placeholder:text-muted-foreground"
          />
        </CardContent>
      </Card>
    </motion.div>
  );
};
