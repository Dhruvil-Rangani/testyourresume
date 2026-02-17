import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface ScoreGaugeProps {
  score: number;
}

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score }) => {
  const data = [{ name: 'Score', value: score, fill: '#0d9488' }]; // teal-600 default

  // Determine color based on score
  let color = '#f43f5e'; // Rose-500
  if (score >= 50) color = '#f59e0b'; // Amber-500
  if (score >= 75) color = '#10b981'; // Emerald-500
  
  data[0].fill = color;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          innerRadius="80%" 
          outerRadius="100%" 
          barSize={10} 
          data={data} 
          startAngle={90} 
          endAngle={-270}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-4xl font-bold text-stone-800">{score}</span>
        <span className="text-sm font-medium text-stone-500">ATS Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;