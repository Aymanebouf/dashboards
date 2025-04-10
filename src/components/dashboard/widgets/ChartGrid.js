
import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import ChartWidget from './ChartWidget';
import ExternalDashboardEmbed from './ExternalDashboardEmbed';

const ChartGrid = ({ charts, externalDashboardUrl }) => {
  // Debug log for incoming props
  useEffect(() => {
    console.log('ChartGrid received props:', {
      chartsCount: charts?.length,
      externalDashboardUrl,
      firstChartTitle: charts?.[0]?.title
    });
  }, [charts, externalDashboardUrl]);
  
  if (!charts || charts.length === 0) {
    return null;
  }

  // Finding the chart to replace (the first chart with the specific title)
  const chartToReplaceIndex = charts.findIndex(chart => 
    chart.title === 'Durée moyenne de présence par type d\'engin'
  );
  
  const shouldReplaceChart = chartToReplaceIndex !== -1 && externalDashboardUrl;

  // Log the replacement decision
  console.log('ChartGrid replacement decision:', {
    chartToReplaceIndex,
    shouldReplaceChart,
    externalDashboardUrl
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {charts.map((chart, index) => {
        // If this chart should be replaced with the external dashboard
        if (shouldReplaceChart && index === chartToReplaceIndex) {
          console.log(`Replacing chart at index ${index} with external dashboard`);
          return (
            <ExternalDashboardEmbed 
              key={`external-dashboard`}
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
