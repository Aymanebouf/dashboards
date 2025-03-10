
import React, { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowUp, GripVertical, Settings, X, Maximize2, ChevronUp, ChevronDown } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { WidgetConfig } from '@/services/dashboardService';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const renderWidget = () => {
    if (type === 'kpi') {
      const trendValue = config.trend || "";
      const isPositive = trendValue.startsWith('+');
      
      return (
        <div className="h-full flex flex-col justify-center items-center pt-4">
          <div className="text-3xl font-bold mb-2 bg-gradient-to-br from-foreground to-foreground/80 bg-clip-text">
            {config.value}
          </div>
          {config.trend && (
            <Badge variant={isPositive ? "success" : "destructive"} className="flex items-center gap-1 py-1">
              {isPositive ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
              <span>{config.trend}</span>
            </Badge>
          )}
          <p className="text-sm text-muted-foreground mt-3 text-center px-2">
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
          height={isExpanded ? 300 : 200}
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
            snapshot.isDragging ? "z-10" : "",
            isExpanded ? "md:col-span-2 md:row-span-2" : ""
          )}
          style={{
            ...provided.draggableProps.style,
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Card className={cn(
            "h-full shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-border/40",
            snapshot.isDragging ? "ring-2 ring-primary shadow-xl scale-[1.02]" : "",
            isHovering && !snapshot.isDragging ? "scale-[1.01]" : "",
            isExpanded ? "col-span-2 row-span-2" : "",
            type === 'kpi' ? "bg-gradient-to-br from-card to-background" : "bg-card"
          )}>
            <CardHeader className={cn(
              "flex flex-row items-center justify-between pb-2",
              "border-b border-border/20"
            )}>
              <CardTitle className="text-sm font-medium flex items-center">
                {title}
                {!isEditing && type === 'chart' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 ml-2 hover:bg-background"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </Button>
                )}
              </CardTitle>
              {isEditing ? (
                <div className="flex space-x-1">
                  <div {...provided.dragHandleProps} className="cursor-move">
                    <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-background/80 text-muted-foreground hover:text-foreground">
                      <GripVertical size={14} />
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-background/80 text-muted-foreground hover:text-foreground"
                    onClick={() => onEdit(widget)}
                  >
                    <Settings size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 hover:bg-destructive/10 text-destructive hover:text-destructive/80"
                    onClick={() => onRemove(id)}
                  >
                    <X size={14} />
                  </Button>
                </div>
              ) : (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs font-normal bg-background/50 hover:bg-background transition-colors",
                    type === 'kpi' ? "text-primary/80" : "text-secondary/80"
                  )}
                >
                  {type === 'kpi' ? 'KPI' : config.type}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-2">
              {renderWidget()}
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default DraggableWidget;
