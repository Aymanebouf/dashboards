
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
    if (!trend) return '';
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
    <div className="p-2">
      <div className="flex justify-content-between mb-3">
        <div>
          <div className="text-500 font-medium mb-1">{title}</div>
          <div className="text-900 font-bold text-xl">{value}</div>
        </div>
        {icon && (
          <div className={`flex align-items-center justify-content-center border-round w-3rem h-3rem ${color !== 'secondary' ? 'text-white' : ''}`} style={{ backgroundColor: 'var(--primary-color)' }}>
            {icon}
          </div>
        )}
      </div>
      
      {trend !== undefined && (
        <div className="flex align-items-center">
          <Tag severity={getTrendColor()} icon={getTrendIcon()}>
            {formatTrend()}
          </Tag>
          {trendLabel && <span className="text-sm text-500 ml-2">{trendLabel}</span>}
        </div>
      )}
      
      {progress !== undefined && (
        <div className="mt-3">
          <ProgressBar value={progress} showValue={false} style={{ height: '0.5rem' }} />
          <div className="flex justify-content-between mt-1">
            <span className="text-xs text-500">Progress</span>
            <span className="text-xs text-700">{progress}%</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Card className={`h-full ${className}`} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      {cardContent}
    </Card>
  );
};

export default PrimeStatCard;
