
import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import ChartWidget from './ChartWidget';
import ExternalDashboardEmbed from './ExternalDashboardEmbed';

const ChartGrid = ({ charts, externalDashboardUrl, grafanaConfig }) => {
  // Debug log for incoming props
  useEffect(() => {
    console.log('ChartGrid received props:', {
      chartsCount: charts?.length,
      externalDashboardUrl,
      grafanaConfig: grafanaConfig ? 'present' : 'missing',
      firstChartTitle: charts?.[0]?.title
    });
  }, [charts, externalDashboardUrl, grafanaConfig]);
  
  if (!charts || charts.length === 0) {
    return null;
  }

  // Finding the chart to replace (the first chart with the specific title)
  const chartToReplaceIndex = charts.findIndex(chart => 
    chart.title === 'Durée moyenne de présence par type d\'engin'
  );
  
  const shouldReplaceChart = externalDashboardUrl && grafanaConfig;

  // Log the replacement decision
  console.log('ChartGrid replacement decision:', {
    chartToReplaceIndex,
    shouldReplaceChart,
    externalDashboardUrl
  });

  // Log explicit message about the Grafana embed
  if (shouldReplaceChart) {
    console.log('Will render Grafana dashboard with URL:', externalDashboardUrl);
  } else {
    console.log('Will NOT render Grafana dashboard. Missing URL or config');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Always render Grafana dashboard first, ensuring it's displayed */}
      {shouldReplaceChart && (
        <ExternalDashboardEmbed 
          key="external-grafana-dashboard"
          url={externalDashboardUrl} 
          title="Grafana Dashboard" 
          height="500px"
          apiKey={grafanaConfig?.apiKey}
        />
      )}
      
      {/* Then render all the regular charts, except the one that was replaced */}
      {charts.map((chart, index) => {
        // Skip the chart that was replaced by Grafana
        if (shouldReplaceChart && index === chartToReplaceIndex) {
          return null;
        }
        
        // Render regular chart
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
