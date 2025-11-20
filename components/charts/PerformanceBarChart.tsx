'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PerformanceData {
  difficulty: string
  [key: string]: number | string // Dynamic keys for different subjects
}

interface PerformanceBarChartProps {
  data: PerformanceData[]
  subjects: { name: string; color: string }[]
}

export default function PerformanceBarChart({ data, subjects }: PerformanceBarChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="difficulty"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
            label={{ value: 'Average Score', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6'
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '14px', color: '#D1D5DB' }}
          />
          {subjects.map(subject => (
            <Bar
              key={subject.name}
              dataKey={subject.name}
              fill={subject.color}
              radius={[8, 8, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
