
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';

const ExternalDashboardEmbed = ({ url, title, height = '500px', apiKey }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Loading Grafana dashboard with URL:", url);
    // Debug the URL and API key being used
    console.log("Grafana API Key:", apiKey ? "Present (hidden for security)" : "Missing");
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [url, apiKey]);

  // For debugging - let's log the full URL
  console.log("Full Grafana URL being used:", url);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-card-header">
        <div className="p-card-title">{title}</div>
      </div>
      <div className="p-card-body">
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <i className="pi pi-spin pi-spinner mr-2"></i>
            <span>Chargement du dashboard Grafana...</span>
          </div>
        )}
        <div 
          className={`iframe-container ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={{
            width: '100%',
            height: height,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'white'
          }}
        >
          <iframe
            src={url}
            title={title}
            width="100%"
            height={height}
            frameBorder="0"
            allowFullScreen
            onLoad={() => {
              console.log("Grafana iframe loaded");
              setIsLoading(false);
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: 'none'
            }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ExternalDashboardEmbed;
