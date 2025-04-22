
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';

const ExternalDashboardEmbed = ({ url, title, height = '500px', apiKey }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Loading Grafana dashboard with URL:", url);
    console.log("Grafana API Key present:", !!apiKey);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [url, apiKey]);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-card-header">
        <div className="p-card-title">{title || "Dashboard Grafana"}</div>
      </div>
      <div className="p-card-body relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <i className="pi pi-spin pi-spinner mr-2"></i>
            <span>Chargement du dashboard Grafana...</span>
          </div>
        )}
        
        <div style={{ width: '100%', height: height, overflow: 'hidden' }}>
          <iframe
            src={url}
            title={title || "Grafana Dashboard"}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
            onLoad={() => {
              console.log("Grafana iframe loaded");
              setIsLoading(false);
            }}
            style={{
              border: 'none',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ExternalDashboardEmbed;

