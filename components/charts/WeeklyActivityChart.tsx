'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ActivityData {
  day: string
  [key: string]: number | string // Dynamic keys for different subjects
}

interface WeeklyActivityChartProps {
  data: ActivityData[]
  subjects: { name: string; color: string }[]
}

export default function WeeklyActivityChart({ data, subjects }: WeeklyActivityChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="day"
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
            label={{ value: 'Games Played', angle: -90, position: 'insideLeft', style: { fill: '#9CA3AF' } }}
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
              stackId="a"
              fill={subject.color}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
