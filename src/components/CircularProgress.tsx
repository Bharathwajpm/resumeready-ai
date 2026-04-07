import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface CircularProgressProps {
  value: number;
  text: string;
}

export const CircularProgress = ({ value, text }: CircularProgressProps) => {
  const getColor = (score: number) => {
    if (score >= 80) return "hsl(var(--success))";
    if (score >= 60) return "hsl(var(--warning))";
    return "hsl(var(--destructive))";
  };

  return (
    <div className="w-48 h-48 mx-auto">
      <CircularProgressbar
        value={value}
        text={text}
        styles={buildStyles({
          textSize: "24px",
          pathColor: getColor(value),
          textColor: "hsl(var(--foreground))",
          trailColor: "hsl(var(--muted))",
          pathTransitionDuration: 0.5,
        })}
      />
    </div>
  );
};
