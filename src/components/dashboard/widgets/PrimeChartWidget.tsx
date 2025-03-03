
import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { 
  BarChart, 
  LineChart, 
  AreaChart, 
  PieChart, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis,
  Area, 
  Tooltip, 
  Legend, 
  CartesianGrid, 
  ResponsiveContainer, 
  Pie, 
  Cell
} from 'recharts';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

type ChartType = 'bar' | 'line' | 'area' | 'pie' | 'composed';

interface ChartWidgetProps {
  title: string;
  data: any[];
  type?: ChartType;
  colors?: string[];
  height?: number;
  className?: string;
  showControls?: boolean;
}

// Fonctions utilitaires pour exporter les données
const downloadCSV = (data: any[], filename: string) => {
  // Obtenir les en-têtes
  const headers = Object.keys(data[0]);
  
  // Créer les lignes de données
  const csvRows = [];
  
  // Ajouter les en-têtes
  csvRows.push(headers.join(','));
  
  // Ajouter les lignes de données
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return `"${val}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // Combiner en une seule chaîne CSV
  const csvString = csvRows.join('\n');
  
  // Créer un lien de téléchargement
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
  a.download = `${filename}.csv`;
  a.click();
};

// Fonction pour télécharger en PDF
const downloadPDF = async (elementRef: React.RefObject<HTMLDivElement>, filename: string) => {
  if (!elementRef.current) return;
  
  try {
    const canvas = await html2canvas(elementRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });
    
    const imgWidth = 280;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Erreur lors de la génération du PDF:", error);
  }
};

const PrimeChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  data,
  type = 'bar',
  colors = ['#1E88E5', '#E91E63', '#66BB6A'],
  height = 300,
  className = '',
  showControls = true
}) => {
  const [chartType, setChartType] = useState<ChartType>(type);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const chartRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<Menu>(null);
  const downloadMenuRef = useRef<Menu>(null);
  
  const handleSaveEdit = () => {
    setIsEditing(false);
  };
  
  const chartTypeItems = [
    {
      label: 'Bar Chart',
      icon: 'pi pi-chart-bar',
      command: () => setChartType('bar')
    },
    {
      label: 'Line Chart',
      icon: 'pi pi-chart-line',
      command: () => setChartType('line')
    },
    {
      label: 'Area Chart',
      icon: 'pi pi-chart-line',
      command: () => setChartType('area')
    },
    {
      label: 'Pie Chart',
      icon: 'pi pi-chart-pie',
      command: () => setChartType('pie')
    },
    {
      label: 'Composed Chart',
      icon: 'pi pi-chart-bar',
      command: () => setChartType('composed')
    }
  ];
  
  const downloadItems = [
    {
      label: 'CSV',
      icon: 'pi pi-download',
      command: () => downloadCSV(data, editedTitle || title)
    },
    {
      label: 'PDF',
      icon: 'pi pi-file-pdf',
      command: () => downloadPDF(chartRef, editedTitle || title)
    }
  ];
  
  const renderChart = () => {
    const keys = Object.keys(data[0]).filter(key => key !== 'name');
    
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Line 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  stroke={colors[index % colors.length]} 
                  activeDot={{ r: 8 }} 
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => (
                <Area 
                  key={key} 
                  type="monotone" 
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  stroke={colors[index % colors.length]} 
                  fillOpacity={0.3}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        // Transforming data for pie chart
        const pieData = keys.map(key => ({
          name: key,
          value: data.reduce((sum, item) => sum + (item[key] || 0), 0)
        }));
        
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {keys.map((key, index) => {
                // Alternating between line and bar
                return index % 2 === 0 ? (
                  <Bar key={key} dataKey={key} fill={colors[index % colors.length]} />
                ) : (
                  <Line 
                    key={key} 
                    type="monotone" 
                    dataKey={key} 
                    stroke={colors[index % colors.length]} 
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  const headerContent = (
    <div className="flex justify-content-between align-items-center">
      {isEditing ? (
        <InputText
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleSaveEdit}
          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
          className="w-full mr-3"
          autoFocus
        />
      ) : (
        <h3 className="text-xl font-medium m-0">{editedTitle || title}</h3>
      )}
      
      {showControls && (
        <div className="flex gap-2">
          <Button 
            icon="pi pi-cog" 
            rounded 
            text 
            aria-label="Chart options"
            onClick={(e) => menuRef.current?.toggle(e)}
          />
          <Menu model={chartTypeItems} popup ref={menuRef} />
          
          <Button 
            icon="pi pi-download" 
            rounded 
            text 
            aria-label="Download options"
            onClick={(e) => downloadMenuRef.current?.toggle(e)}
          />
          <Menu model={downloadItems} popup ref={downloadMenuRef} />
          
          <Button 
            icon="pi pi-pencil" 
            rounded 
            text 
            aria-label="Edit title"
            onClick={() => setIsEditing(true)}
          />
          
          <Button 
            icon="pi pi-trash" 
            rounded 
            text 
            severity="danger" 
            aria-label="Delete widget"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className={`h-full overflow-hidden ${className}`} ref={chartRef}>
      <Card header={headerContent} className="h-full">
        <div className="p-2">
          {renderChart()}
        </div>
      </Card>
    </div>
  );
};

export default PrimeChartWidget;
