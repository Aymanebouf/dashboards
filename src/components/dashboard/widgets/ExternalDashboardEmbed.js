
import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';

const ExternalDashboardEmbed = ({ url, title, height = '500px' }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set a timeout to hide loading state after a reasonable time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [url]);

  console.log("Rendering external dashboard with URL:", url);

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
      <div className="p-card-header">
        <div className="p-card-title">{title}</div>
      </div>
      <div className="p-card-body">
        {isLoading && (
          <div className="flex items-center justify-center p-4">
            <i className="pi pi-spin pi-spinner mr-2"></i>
            <span>Chargement du dashboard externe...</span>
          </div>
        )}
        <div className={`iframe-container ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <iframe
            src={url}
            title={title}
            width="100%"
            height={height}
            frameBorder="0"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </div>
    </Card>
  );
};

export default ExternalDashboardEmbed;
