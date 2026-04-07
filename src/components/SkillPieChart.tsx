import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface SkillPieChartProps {
  matched: number;
  missing: number;
}

export const SkillPieChart = ({ matched, missing }: SkillPieChartProps) => {
  const data = [
    { name: "Matched Skills", value: matched },
    { name: "Missing Skills", value: missing },
  ];

  const COLORS = ["hsl(var(--success))", "hsl(var(--destructive))"];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
