
import React from 'react';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { ProgressBar } from 'primereact/progressbar';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  progress?: number;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
  className?: string;
}

const PrimeStatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
  progress,
  color = 'primary',
  className = ''
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'primary': return 'bg-primary text-white';
      case 'secondary': return 'bg-surface border-primary-200 border-1';
      case 'success': return 'bg-green-100 text-green-900';
      case 'info': return 'bg-blue-100 text-blue-900';
      case 'warning': return 'bg-yellow-100 text-yellow-900';
      case 'danger': return 'bg-red-100 text-red-900';
      default: return 'bg-primary text-white';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'secondary';
    return trend > 0 ? 'success' : 'danger';
  };

  const getTrendIcon = () => {
    if (!trend) return '';
    return trend > 0 ? 'pi pi-arrow-up' : 'pi pi-arrow-down';
  };

  const formatTrend = () => {
    if (!trend) return '';
    const sign = trend > 0 ? '+' : '';
    return `${sign}${trend}%`;
  };

  const cardContent = (
    <div className="p-3">
      <div className="flex justify-content-between align-items-center mb-3">
        <div>
          <div className="text-500 font-medium mb-1">{title}</div>
          <div className="text-900 font-bold text-2xl">{value}</div>
        </div>
        {icon && (
          <div className={`flex align-items-center justify-content-center border-round-xl shadow-1 w-3rem h-3rem ${color !== 'secondary' ? 'text-white' : 'text-primary'}`} 
               style={{ backgroundColor: color === 'secondary' ? 'var(--surface-card)' : `var(--${color === 'primary' ? 'primary' : color}-500)` }}>
            {icon}
          </div>
        )}
      </div>
      
      {trend !== undefined && (
        <div className="flex align-items-center">
          <Tag severity={getTrendColor()} icon={getTrendIcon()} className="px-2 py-1">
            {formatTrend()}
          </Tag>
          {trendLabel && <span className="text-xs text-500 ml-2">{trendLabel}</span>}
        </div>
      )}
      
      {progress !== undefined && (
        <div className="mt-3">
          <ProgressBar value={progress} showValue={false} 
                      style={{ 
                        height: '0.5rem', 
                        borderRadius: '0.25rem',
                        background: 'var(--surface-200)'
                      }} 
                      className="mb-1"
                      pt={{
                        value: { 
                          style: { 
                            background: `var(--${color === 'primary' ? 'primary' : color}-500)`, 
                            borderRadius: '0.25rem' 
                          }
                        }
                      }}
          />
          <div className="flex justify-content-between">
            <span className="text-xs text-500">Progress</span>
            <span className="text-xs text-700 font-medium">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className={`h-full ${className} shadow-2 border-round-xl`}>
      {cardContent}
    </Card>
  );
};

export default PrimeStatCard;
