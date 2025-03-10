
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, GripVertical, Settings, X } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { WidgetConfig } from '@/services/dashboardService';
import { cn } from '@/lib/utils';

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
  const [isHovering, setIsHovering] = useState(false);
  
  const renderWidget = () => {
    if (type === 'kpi') {
      const trendValue = config.trend || "";
      const isPositive = trendValue.startsWith('+');
      
      return (
        <div className="h-full flex flex-col justify-center items-center pt-4">
          <div className="text-3xl font-bold mb-2">{config.value}</div>
          {config.trend && (
            <div className={cn(
              "trend-badge",
              isPositive ? "trend-badge-positive" : "trend-badge-negative"
            )}>
              {isPositive ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
              <span>{config.trend}</span>
            </div>
          )}
          <p className="text-sm text-muted-foreground mt-2 text-center">
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
          className={cn(
            "relative transition-all duration-300",
            snapshot.isDragging ? "z-10" : ""
          )}
          style={{
            ...provided.draggableProps.style,
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Card className={cn(
            "h-full shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border-border/40 widget-theme-glass",
            snapshot.isDragging ? "ring-2 ring-primary shadow-xl scale-[1.02]" : "",
            isHovering && !snapshot.isDragging ? "scale-[1.01]" : ""
          )}>
            <CardHeader className="pb-2 flex flex-row items-center justify-between widget-header-modern">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              {isEditing && (
                <div className="flex space-x-1">
                  <div {...provided.dragHandleProps} className="cursor-move">
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-primary/10 text-muted-foreground hover:text-foreground">
                      <GripVertical size={14} />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-primary/10 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(widget)}
                  >
                    <Settings size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-destructive/10 text-destructive"
                    onClick={() => onRemove(id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {renderWidget()}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableWidget;
