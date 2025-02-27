
import React from 'react';
import { X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableWidgetProps {
  id: string;
  title: string;
  children: React.ReactNode;
  onRemove: (id: string) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  isEditMode?: boolean;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  title,
  children,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  isEditMode = false
}) => {
  return (
    <div
      className={cn(
        "h-full rounded-lg overflow-hidden shadow-sm border transition-all",
        isEditMode && "shadow-md border-dashed hover:border-primary cursor-grab active:cursor-grabbing"
      )}
      draggable={isEditMode}
      onDragStart={(e) => onDragStart(e, id)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
    >
      {isEditMode && (
        <div className="flex items-center justify-between p-2 bg-muted/50">
          <div className="flex items-center text-sm text-muted-foreground">
            <GripVertical size={18} className="mr-2" />
            {title}
          </div>
          <button 
            onClick={() => onRemove(id)}
            className="p-1 rounded-full hover:bg-red-100 text-red-500"
          >
            <X size={16} />
          </button>
        </div>
      )}
      <div className="h-full">{children}</div>
    </div>
  );
};

export default DraggableWidget;
