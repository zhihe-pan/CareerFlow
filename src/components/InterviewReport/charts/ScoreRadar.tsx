import { 
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, ResponsiveContainer 
} from 'recharts';

const data = [
  { subject: '技术深度', A: 85, fullMark: 100 },
  { subject: '逻辑思维', A: 90, fullMark: 100 },
  { subject: '沟通表达', A: 75, fullMark: 100 },
  { subject: '岗位匹配度', A: 88, fullMark: 100 },
  { subject: '情绪控制', A: 95, fullMark: 100 },
];

export const ScoreRadar = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
          />
          <Radar
            name="Score"
            dataKey="A"
            stroke="hsl(var(--primary-glow))"
            fill="hsl(var(--primary-glow))"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
