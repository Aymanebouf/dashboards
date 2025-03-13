
import React, { useRef } from 'react';
import { 
  BarChart, 
  LineChart, 
  AreaChart, 
  PieChart, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis,
  Area, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ResponsiveContainer, 
  Pie, 
  Cell
} from 'recharts';
import { ChartType } from '@/models/chart';

interface PrimeChartDisplayProps {
  type: ChartType;
  data: any[];
  colors: string[];
  height: number;
}

const PrimeChartDisplay: React.FC<PrimeChartDisplayProps> = ({
  type,
  data,
  colors,
  height
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  
  const renderChart = () => {
    const keys = Object.keys(data[0]).filter(key => key !== 'name');
    
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <YAxis tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px', 
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {keys.map((key, index) => (
                <Bar 
                  key={key} 
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  radius={[4, 4, 0, 0]}
                  barSize={32}
                  animationDuration={1500}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <YAxis tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px', 
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {keys.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  strokeWidth={3}
                  dot={{ r: 6, fill: colors[index % colors.length], strokeWidth: 2 }}
                  activeDot={{ r: 8, strokeWidth: 0 }} 
                  animationDuration={1500}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <defs>
                {keys.map((key, index) => (
                  <linearGradient key={`gradient-${key}`} id={`colorGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors[index % colors.length]} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={colors[index % colors.length]} stopOpacity={0.1}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <YAxis tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px', 
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {keys.map((key, index) => (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  fill={`url(#colorGradient${index})`}
                  stroke={colors[index % colors.length]} 
                  strokeWidth={2}
                  animationDuration={1500}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        // Transforming data for pie chart
        const pieData = keys.map(key => ({
          name: key,
          value: data.reduce((sum, item) => sum + (item[key] || 0), 0)
        }));
        
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                fill="#8884d8"
                paddingAngle={3}
                dataKey="value"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                animationDuration={1500}
                animationBegin={0}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colors[index % colors.length]} 
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px', 
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <YAxis tick={{ fill: '#64748B' }} axisLine={{ stroke: '#CBD5E1', strokeWidth: 1 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '8px', 
                  border: '1px solid rgba(203, 213, 225, 0.5)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }} 
              />
              <Legend wrapperStyle={{ paddingTop: 10 }} />
              {keys.map((key, index) => {
                // Alternating between line and bar
                return index % 2 === 0 ? (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={colors[index % colors.length]} 
                    radius={[4, 4, 0, 0]} 
                    barSize={24}
                    animationDuration={1500}
                  />
                ) : (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]} 
                    strokeWidth={3}
                    dot={{ r: 5, fill: colors[index % colors.length], strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <div ref={chartRef} className="chart-container p-4 surface-card rounded-xl">
      {renderChart()}
    </div>
  );
};

export default PrimeChartDisplay;
