import { 
  LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

const data = [
  { name: 'Q1', wpm: 120, stability: 95 },
  { name: 'Q2', wpm: 145, stability: 88 },
  { name: 'Q3', wpm: 130, stability: 92 },
  { name: 'Q4', wpm: 160, stability: 75 },
  { name: 'Q5', wpm: 140, stability: 90 },
];

export const BehavioralTimeline = () => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(10, 10, 15, 0.9)', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: 'white'
            }} 
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Line 
            type="monotone" 
            name="语速 (WPM)"
            dataKey="wpm" 
            stroke="hsl(var(--primary-glow))" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'hsl(var(--primary-glow))' }}
            activeDot={{ r: 6 }} 
          />
          <Line 
            type="monotone" 
            name="情绪稳定度"
            dataKey="stability" 
            stroke="hsl(var(--accent))" 
            strokeWidth={3}
            dot={{ r: 4, fill: 'hsl(var(--accent))' }}
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
