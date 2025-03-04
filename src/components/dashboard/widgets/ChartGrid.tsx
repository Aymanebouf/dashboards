
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {charts.map((chart, index) => (
        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>{chart.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartWidget
              title=""
              data={chart.data}
              type={chart.type}
              colors={chart.colors}
              height={300}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChartGrid;
