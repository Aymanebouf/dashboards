
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Grip, MoreHorizontal, Move, Pencil, Trash, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DraggableWidgetProps {
  id: string;
  title: string;
  onRemove: (id: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  className?: string;
  children: React.ReactNode;
}

const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  title,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  className,
  children
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (onDragStart) {
      onDragStart(e, id);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleTitleEdit = () => {
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    setIsEditing(false);
    // Here you would implement logic to save the new title
  };

  const handleTitleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <Card 
      className={cn(
        'dashboard-widget transition-all duration-300',
        isDragging ? 'opacity-50 border-dashed border-2 border-primary' : '',
        className
      )}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={onDragOver ? (e) => onDragOver(e) : undefined}
      onDrop={onDrop ? (e) => onDrop(e, id) : undefined}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-move">
        {isEditing ? (
          <div className="flex items-center space-x-2 w-full">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-base font-medium h-8"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={handleTitleSave} className="h-8 w-8">
              <Check size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleTitleCancel} className="h-8 w-8">
              <X size={16} />
            </Button>
          </div>
        ) : (
          <CardTitle className="text-base font-medium flex items-center">
            <Grip size={16} className="mr-2 text-muted-foreground" />
            <span>{title}</span>
          </CardTitle>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleTitleEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Modifier</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onRemove(id)}>
              <Trash className="mr-2 h-4 w-4" />
              <span>Supprimer</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pt-2">
        {children}
      </CardContent>
    </Card>
  );
};

export default DraggableWidget;
