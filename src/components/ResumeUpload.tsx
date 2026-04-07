import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import undrawResume from "@/assets/undraw-resume.svg";

interface ResumeUploadProps {
  onTextExtracted: (text: string) => void;
}

export const ResumeUpload = ({ onTextExtracted }: ResumeUploadProps) => {
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("pdf") && !file.type.includes("text")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a PDF or text file.",
        variant: "destructive",
      });
      return;
    }

    setFileName(file.name);
    setIsProcessing(true);

    try {
      let text = "";

      if (file.type.includes("text")) {
        text = await file.text();
      } else if (file.type.includes("pdf")) {
        text = await file.text();
      }

      if (text.trim()) {
        onTextExtracted(text);
        toast({
          title: "Resume Uploaded",
          description: "Your resume has been successfully processed.",
        });
      } else {
        throw new Error("Could not extract text from file");
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to process the resume. Please try again.",
        variant: "destructive",
      });
      setFileName("");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full neon-border hover:neon-glow transition-all duration-300 bg-card/95 backdrop-blur relative overflow-hidden">
        <div className="absolute top-4 right-4 opacity-20">
          <img src={undrawResume} alt="" className="h-16 w-16" />
        </div>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="h-5 w-5 text-primary" />
            📤 Upload Resume
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg hover:shadow-primary/20"
            style={{ borderColor: 'hsl(var(--neon-glow) / 0.5)' }}
            onClick={() => document.getElementById("resume-upload")?.click()}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Processing resume...</p>
              </div>
            ) : fileName ? (
              <div className="flex flex-col items-center gap-2">
                <FileText className="h-8 w-8 text-primary" />
                <p className="text-sm font-medium text-foreground">{fileName}</p>
                <p className="text-xs text-muted-foreground">Click to upload a different file</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">PDF or TXT (max 10MB)</p>
              </div>
            )}
          </div>
          <input
            id="resume-upload"
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          {fileName && (
            <Button 
              variant="outline" 
              className="w-full neon-border hover:bg-primary/10" 
              onClick={() => {
                setFileName("");
                onTextExtracted("");
              }}
            >
              Clear
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
