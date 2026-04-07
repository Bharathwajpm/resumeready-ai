import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface SkillData {
  skill: string;
  current: number;
  required: number;
}

interface SkillRadarChartProps {
  data: SkillData[];
}

export const SkillRadarChart = ({ data }: SkillRadarChartProps) => {
  const chartConfig = {
    current: {
      label: "Your Level",
      color: "hsl(var(--chart-1))",
    },
    required: {
      label: "Required Level",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="skill" 
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />
          <Radar
            name="Your Level"
            dataKey="current"
            stroke="hsl(var(--chart-1))"
            fill="hsl(var(--chart-1))"
            fillOpacity={0.6}
          />
          <Radar
            name="Required Level"
            dataKey="required"
            stroke="hsl(var(--chart-2))"
            fill="hsl(var(--chart-2))"
            fillOpacity={0.6}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};
