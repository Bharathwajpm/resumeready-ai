import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgress } from "./CircularProgress";
import { SkillRadarChart } from "./SkillRadarChart";
import { SkillPieChart } from "./SkillPieChart";
import { PDFDownload } from "./PDFDownload";
import { AnalysisResult } from "@/pages/Index";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Lightbulb, CheckCircle2, XCircle, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import undrawScreening from "@/assets/undraw-screening.svg";

interface AnalysisResultsProps {
  results: AnalysisResult;
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const [showRecommendations, setShowRecommendations] = useState(true);

  useEffect(() => {
    if (results.jobFitScore >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [results.jobFitScore]);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Results Header Image */}
        <div className="flex justify-center mb-6">
          <img 
            src={undrawScreening} 
            alt="Analysis Results" 
            className="h-32 object-contain opacity-80"
          />
        </div>

        {/* Job Fit Score */}
        <Card className="neon-border neon-glow bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2 text-foreground">
              🎯 Job Fit Score
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CircularProgress value={results.jobFitScore} text={`${results.jobFitScore}%`} />
          </CardContent>
        </Card>

        {/* AI Feedback */}
        <Card className="neon-border bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="h-5 w-5 text-primary" />
              🤖 AI Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-foreground font-medium">
                {results.jobFitScore >= 80
                  ? "🌟 Excellent match! Your profile aligns well with this position."
                  : results.jobFitScore >= 60
                  ? "💪 Good potential! Focus on developing the missing skills below."
                  : "🎯 Consider adding projects showcasing the required skills to strengthen your application."}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {results.missingSkills.length > 0 
                  ? `Adding ${results.missingSkills[0]} could improve your fit by ~${Math.min(10, 100 - results.jobFitScore)}%`
                  : "You have all the key skills for this role!"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skills Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="neon-border bg-card/95 backdrop-blur hover:shadow-lg hover:shadow-success/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                ✅ Matched Skills ({results.matchedSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.matchedSkills.map((skill, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-success/10 text-success border-success hover:bg-success/20 cursor-help"
                      >
                        🟢 {skill}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>🟢 You have this skill!</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="neon-border bg-card/95 backdrop-blur hover:shadow-lg hover:shadow-destructive/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                ❌ Missing Skills ({results.missingSkills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {results.missingSkills.map((skill, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger>
                      <Badge
                        variant="outline"
                        className="bg-destructive/10 text-destructive border-destructive hover:bg-destructive/20 cursor-help"
                      >
                        🔴 {skill}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>🔴 Consider learning this skill</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skill Distribution Pie Chart */}
        <Card className="neon-border bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              📊 Skill Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillPieChart
              matched={results.matchedSkills.length}
              missing={results.missingSkills.length}
            />
          </CardContent>
        </Card>

        {/* Skill Gap Analysis */}
        <Card className="neon-border bg-card/95 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              📈 Skill Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={results.skillGapAnalysis} />
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="neon-border bg-card/95 backdrop-blur">
          <CardHeader className="cursor-pointer" onClick={() => setShowRecommendations(!showRecommendations)}>
            <CardTitle className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                💡 Personalized Recommendations
              </span>
              {showRecommendations ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CardTitle>
          </CardHeader>
          {showRecommendations && (
            <CardContent>
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {results.suggestions.map((suggestion, index) => (
                  <motion.li
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <span className="text-primary text-xl">🧩</span>
                    <span className="text-sm text-foreground">{suggestion}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </CardContent>
          )}
        </Card>

        {/* PDF Download */}
        <div className="flex justify-center">
          <PDFDownload results={results} />
        </div>
      </motion.div>
    </TooltipProvider>
  );
};
