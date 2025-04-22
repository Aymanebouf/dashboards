
import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import ChartWidget from './ChartWidget';
import ExternalDashboardEmbed from './ExternalDashboardEmbed';

const ChartGrid = ({ charts, externalDashboardUrl, grafanaConfig }) => {
  useEffect(() => {
    console.log('ChartGrid received props:', {
      chartsCount: charts?.length,
      hasExternalUrl: !!externalDashboardUrl,
      hasGrafanaConfig: !!grafanaConfig,
      firstChartTitle: charts?.[0]?.title
    });
  }, [charts, externalDashboardUrl, grafanaConfig]);
  
  if (!charts || charts.length === 0) {
    return null;
  }

  const chartToReplaceIndex = charts.findIndex(chart => 
    chart.title === 'Durée moyenne de présence par type d\'engin'
  );

  const shouldReplaceChart = externalDashboardUrl && grafanaConfig;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {shouldReplaceChart && (
        <ExternalDashboardEmbed 
          key="grafana-dashboard"
          url={externalDashboardUrl} 
          title="Dashboard Grafana"
          height="500px"
          apiKey={grafanaConfig?.apiKey}
        />
      )}
      
      {charts.map((chart, index) => {
        if (shouldReplaceChart && index === chartToReplaceIndex) {
          return null;
        }
        
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

