
import React from 'react';
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {shouldReplaceFirstChart ? (
        <ExternalDashboardEmbed 
          url={externalDashboardUrl} 
          title={firstChart.title} 
        />
      ) : null}

      {charts.map((chart, index) => {
        // Skip the first chart if it's being replaced
        if (index === 0 && shouldReplaceFirstChart) {
          return null;
        }
        
        return (
          <Card 
            key={index} 
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
