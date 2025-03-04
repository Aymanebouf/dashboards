
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICard {
  title: string;
  value: string;
  trend?: string | null;
  description: string;
}

interface KPICardGridProps {
  cards: KPICard[];
}

const KPICardGrid: React.FC<KPICardGridProps> = ({ cards }) => {
  if (!cards || cards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            {card.trend && (
              <p className="text-xs text-muted-foreground">
                {card.trend.startsWith('+') ? (
                  <span className="text-green-500">{card.trend}</span>
                ) : (
                  <span className="text-red-500">{card.trend}</span>
                )} par rapport au mois dernier
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KPICardGrid;
