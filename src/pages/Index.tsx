import { useState, useEffect } from "react";
import { ResumeUpload } from "@/components/ResumeUpload";
import { JobDescriptionInput } from "@/components/JobDescriptionInput";
import { AnalysisResults } from "@/components/AnalysisResults";
import { AIChatbot } from "@/components/AIChatbot";
import { Button } from "@/components/ui/button";
import { Loader2, Moon, Sun, Code2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import resumeAiBg from "@/assets/resume-ai-bg.jpg";
import resumeAiHeader from "@/assets/resume-ai-header.webp";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface AnalysisResult {
  jobFitScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  skillGapAnalysis: {
    skill: string;
    current: number;
    required: number;
  }[];
}

const Index = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const handleAnalyze = async () => {
    if (!resumeText || !jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please upload a resume and provide a job description.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    // Simulate progressive loading messages
    const messages = [
      "🔍 Analyzing resume...",
      "📊 Extracting skills and comparing job description...",
      "🤖 Generating AI insights...",
    ];
    
    let messageIndex = 0;
    setLoadingMessage(messages[0]);
    
    const messageInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % messages.length;
      setLoadingMessage(messages[messageIndex]);
    }, 2000);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText, jobDescription },
      });

      if (error) throw error;

      clearInterval(messageInterval);
      setResults(data);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error: any) {
      console.error("Analysis error:", error);
      clearInterval(messageInterval);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResumeText("");
    setJobDescription("");
    setResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{ backgroundImage: `url(${resumeAiBg})` }}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Banner */}
        <header className="text-center mb-8 relative">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 top-0 neon-border hover:neon-glow"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <div className="mb-6 flex justify-center">
            <img 
              src={resumeAiHeader} 
              alt="AI-Powered Resume Analyzer" 
              className="h-48 object-contain rounded-xl"
            />
          </div>
          
          <h1 
            onClick={scrollToTop}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4 cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            🧠 Smart Resume Analyzer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare your resume with job descriptions to get instant Job-Fit scores, 
            skill analysis, and personalized recommendations 🚀
          </p>
        </header>

        {/* Upload Section */}
        {!results && (
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <ResumeUpload onTextExtracted={setResumeText} />
            <JobDescriptionInput onTextChange={setJobDescription} />
          </div>
        )}

        {/* Action Buttons */}
        {!results && (
          <div className="flex flex-col items-center gap-4 mb-8">
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !resumeText || !jobDescription}
              size="lg"
              className="min-w-[200px] gradient-button text-white font-semibold"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  🔍 Analyzing...
                </>
              ) : (
                "🎯 Analyze Resume"
              )}
            </Button>
            
            {/* Loading Messages */}
            {isAnalyzing && (
              <div className="animate-fade-in text-center">
                <p className="text-lg font-medium text-primary animate-pulse">
                  {loadingMessage}
                </p>
                <div className="w-64 h-1 bg-muted rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-gradient-to-r from-primary to-accent animate-[slide-in-right_2s_ease-in-out_infinite]" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="space-y-6">
            <AnalysisResults results={results} />
            <div className="flex justify-center">
              <Button onClick={handleReset} variant="outline" size="lg">
                Analyze Another Resume
              </Button>
            </div>
          </div>
        )}

        {/* About / Tech Stack Section */}
        <div className="mt-16 mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />
          
          <Collapsible open={aboutOpen} onOpenChange={setAboutOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full neon-border hover:neon-glow flex items-center justify-between"
              >
                <span className="text-lg font-semibold">📚 About This Project</span>
                <Code2 className={`h-5 w-5 transition-transform ${aboutOpen ? 'rotate-180' : ''}`} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 animate-accordion-down">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl neon-border space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">🎯 What It Does</h3>
                  <p className="text-muted-foreground">
                    Smart Resume Analyzer uses advanced AI to compare your resume against job descriptions, 
                    providing instant insights on skill matches, gaps, and personalized recommendations to 
                    improve your application success rate.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">🛠️ Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Framer Motion', 'Recharts', 'jsPDF'].map((tech) => (
                      <span 
                        key={tech}
                        className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium neon-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">✨ Key Features</h3>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1">
                    <li>AI-powered resume analysis and skill matching</li>
                    <li>Interactive visualizations (Radar & Pie charts)</li>
                    <li>Personalized career recommendations</li>
                    <li>PDF report generation</li>
                    <li>AI chatbot for career guidance</li>
                    <li>Dark mode support</li>
                  </ul>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      
      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Index;
