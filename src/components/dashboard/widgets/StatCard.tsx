
import React from 'react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  total?: string;
  progress?: number;
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'gray';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  title,
  value,
  total,
  progress = 100,
  color = 'blue',
  className,
}) => {
  const colorVariants = {
    blue: {
      bg: 'bg-logitag-blue/10',
      text: 'text-logitag-blue',
      progressBar: 'bg-logitag-blue'
    },
    red: {
      bg: 'bg-logitag-red/10',
      text: 'text-logitag-red',
      progressBar: 'bg-logitag-red'
    },
    green: {
      bg: 'bg-logitag-green/10',
      text: 'text-logitag-green',
      progressBar: 'bg-logitag-green'
    },
    yellow: {
      bg: 'bg-logitag-yellow/10',
      text: 'text-logitag-yellow',
      progressBar: 'bg-logitag-yellow'
    },
    purple: {
      bg: 'bg-logitag-primary/10',
      text: 'text-logitag-primary',
      progressBar: 'bg-logitag-primary'
    },
    gray: {
      bg: 'bg-gray-200',
      text: 'text-gray-700',
      progressBar: 'bg-gray-500'
    }
  };

  return (
    <div className={cn('dashboard-card', className)}>
      <div className="stat-card">
        <div className="flex items-center mb-4">
          <div className={cn("p-3 rounded-full mr-3", colorVariants[color].bg)}>
            <div className={cn("w-10 h-10 flex items-center justify-center", colorVariants[color].text)}>
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        
        <div className="mt-auto">
          <Progress 
            value={progress} 
            className="h-2 mb-2"
            indicatorClassName={colorVariants[color].progressBar}
          />
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold text-lg">{value}</span>
            {total && <span className="text-muted-foreground">{total}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
