
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Grip, MoreHorizontal, Move, Pencil, Trash, X, Download } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

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

  const exportWidgetToPDF = () => {
    const widgetElement = document.getElementById(`widget-${id}`);
    if (!widgetElement) return;

    toast.info('Génération du PDF pour ce widget...');

    html2canvas(widgetElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Ajout d'un en-tête au PDF
      pdf.setFillColor(112, 86, 171); // Couleur LogiTag
      pdf.rect(0, 0, pdfWidth, 20, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(16);
      pdf.text(`${title}`, 14, 12);
      
      // Ajout d'informations supplémentaires
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.text(`Date: ${new Date().toLocaleDateString()}`, pdfWidth - 50, 30);
      pdf.text('Généré par: Système LogiTag', pdfWidth - 70, 35);
      
      // Ajout de l'image du widget
      pdf.addImage(imgData, 'PNG', 10, 40, pdfWidth - 20, pdfHeight - 20);
      
      // Ajout d'un pied de page
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('© 2023 LogiTag. Tous droits réservés.', pdfWidth / 2, pdfHeight + 30, { align: 'center' });
      
      pdf.save(`logitag-widget-${title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`);
      
      toast.success('PDF généré avec succès!');
    });
  };

  return (
    <Card 
      id={`widget-${id}`}
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
        
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={exportWidgetToPDF}
          >
            <Download size={16} />
          </Button>
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
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {children}
      </CardContent>
    </Card>
  );
};

export default DraggableWidget;
