
import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import ChartWidget from './ChartWidget';
import ExternalDashboardEmbed from './ExternalDashboardEmbed';

const ChartGrid = ({ charts, externalDashboardUrl }) => {
  if (!charts || charts.length === 0) {
    return null;
  }

  // Check if we need to replace the first chart with an external dashboard
  const firstChart = charts[0];
  const shouldReplaceFirstChart = externalDashboardUrl && firstChart && firstChart.title === 'Durée moyenne de présence par type d\'engin';

  // Debug log to verify we have what we need
  useEffect(() => {
    console.log('ChartGrid rendering with:', {
      externalDashboardUrl,
      shouldReplaceFirstChart,
      firstChartTitle: firstChart?.title
    });
  }, [externalDashboardUrl, shouldReplaceFirstChart, firstChart]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map((chart, index) => {
        // If it's the first chart and meets the replacement criteria, show the external dashboard
        if (index === 0 && shouldReplaceFirstChart) {
          console.log("Rendering external dashboard instead of first chart");
          return (
            <ExternalDashboardEmbed 
              key={`external-${index}`}
              url={externalDashboardUrl} 
              title={chart.title} 
              height="400px"
            />
          );
        }
        
        // Otherwise, render the regular chart
        return (
          <Card 
            key={`chart-${index}`} 
            className="shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden rounded-xl border-none"
            title={chart.title}
            pt={{
              header: { className: 'bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-b border-border/20' },
              title: { className: 'text-lg font-medium' }
            }}
          >
            <div className="p-card-body">
              <ChartWidget
                title=""
                data={chart.data}
                type={chart.type}
                colors={chart.colors}
                height={320}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ChartGrid;
