
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChartWidget from './ChartWidget';

interface ChartData {
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'composed';
  data: any[];
  colors: string[];
}

interface ChartGridProps {
  charts: ChartData[];
}

const ChartGrid: React.FC<ChartGridProps> = ({ charts }) => {
  if (!charts || charts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        <Card key={index} className="shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border-none">
          <CardHeader className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-b border-border/20">
            <CardTitle className="text-lg font-medium">{chart.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ChartWidget
              title=""
              data={chart.data}
              type={chart.type}
              colors={chart.colors}
              height={320}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChartGrid;
