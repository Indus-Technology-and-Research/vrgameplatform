'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface DataPoint {
  date: string
  [key: string]: number | string // Dynamic keys for different subjects
}

interface ScoreTrendChartProps {
  data: DataPoint[]
  subjects: { name: string; color: string }[]
}

export default function ScoreTrendChart({ data, subjects }: ScoreTrendChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="date"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            domain={[0, 100]}
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
            <Line
              key={subject.name}
              type="monotone"
              dataKey={subject.name}
              stroke={subject.color}
              strokeWidth={2}
              dot={{ fill: subject.color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
