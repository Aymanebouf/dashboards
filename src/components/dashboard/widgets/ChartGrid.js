
import React from 'react';
import { Card } from 'primereact/card';
import ChartWidget from './ChartWidget';

const ChartGrid = ({ charts }) => {
  if (!charts || charts.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map((chart, index) => (
        <Card 
          key={index} 
          className="shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border-none"
          title={chart.title}
          pt={{
            header: { className: 'bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-b border-border/20' },
            title: { className: 'text-lg font-medium' }
          }}
        >
          <ChartWidget
            title=""
            data={chart.data}
            type={chart.type}
            colors={chart.colors}
            height={320}
          />
        </Card>
      ))}
    </div>
  );
};

export default ChartGrid;
