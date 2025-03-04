
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Move, Settings } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { WidgetConfig } from '@/services/dashboardService';

interface DraggableWidgetProps {
  widget: WidgetConfig;
  index: number;
  onRemove: (widgetId: string) => void;
  onEdit: (widget: WidgetConfig) => void;
  isEditing: boolean;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  widget,
  index,
  onRemove,
  onEdit,
  isEditing
}) => {
  const { id, type, title, config } = widget;
  
  const renderWidget = () => {
    if (type === 'kpi') {
      return (
        <div className="h-full flex flex-col justify-center">
          <div className="text-2xl font-bold">{config.value}</div>
          {config.trend && (
            <p className="text-xs text-muted-foreground">
              {config.trend.startsWith('+') ? (
                <span className="text-green-500">{config.trend}</span>
              ) : (
                <span className="text-red-500">{config.trend}</span>
              )} par rapport au mois dernier
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {config.description}
          </p>
        </div>
      );
    } else if (type === 'chart') {
      return (
        <ChartWidget
          title=""
          data={config.data}
          type={config.type}
          colors={config.colors}
          height={200}
          showControls={false}
        />
      );
    }
    return null;
  };

  return (
    <Draggable draggableId={id} index={index} isDragDisabled={!isEditing}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`relative ${snapshot.isDragging ? 'z-10' : ''}`}
          style={{
            ...provided.draggableProps.style,
          }}
        >
          <Card className={`h-full shadow-md hover:shadow-lg transition-shadow duration-300 ${snapshot.isDragging ? 'ring-2 ring-primary' : ''}`}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {isEditing && (
                <div className="flex space-x-1">
                  <div {...provided.dragHandleProps} className="cursor-move">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Move size={14} />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6"
                    onClick={() => onEdit(widget)}
                  >
                    <Settings size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive"
                    onClick={() => onRemove(id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {renderWidget()}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableWidget;
