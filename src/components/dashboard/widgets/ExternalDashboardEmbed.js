
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';

const ExternalDashboardEmbed = ({ url, title, height = '500px' }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log("Loading Grafana dashboard with URL:", url);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [url]);

  // Construction de l'URL avec l'en-tête Authorization
  const finalUrl = url;

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
            src={finalUrl}
            title={title}
            width="100%"
            height={height}
            frameBorder="0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
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
