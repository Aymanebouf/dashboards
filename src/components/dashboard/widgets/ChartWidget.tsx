
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
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
import { ChevronDown, Download, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, FileText, Trash2, Edit3 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { ChartType } from '@/models/chart';

type Props = {
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

const ChartWidget: React.FC<Props> = ({
  title,
  data,
  type = 'bar',
  colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'],
  height = 300,
  className = '',
  showControls = true
}) => {
  const [chartType, setChartType] = useState<ChartType>(type);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const chartRef = useRef<HTMLDivElement>(null);
  
  const handleSaveEdit = () => {
    setIsEditing(false);
  };
  
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

  return (
    <Card className={`h-full overflow-hidden dashboard-widget ${className} bg-gradient-to-br from-white/80 to-white/40 dark:from-slate-900/90 dark:to-slate-800/70 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl transition-all duration-300 hover:shadow-lg`} ref={chartRef}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 bg-gradient-to-r from-indigo-50/40 to-violet-50/40 dark:from-indigo-950/20 dark:to-violet-950/20">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            className="text-lg font-semibold border-b-2 border-indigo-300 dark:border-indigo-700 bg-transparent focus:outline-none focus:border-indigo-500 dark:focus:border-indigo-500 w-full px-1 py-1 rounded"
            autoFocus
          />
        ) : (
          <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white/90">{editedTitle || title}</CardTitle>
        )}
        {showControls && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <ChevronDown size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg p-1.5">
                <DropdownMenuItem onClick={() => setChartType('bar')} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <BarChart2 className="mr-2 h-4 w-4 text-emerald-500" />
                  <span>Bar Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('line')} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <LineChartIcon className="mr-2 h-4 w-4 text-violet-500" />
                  <span>Line Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('area')} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <LineChartIcon className="mr-2 h-4 w-4 text-blue-500" />
                  <span>Area Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('pie')} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <PieChartIcon className="mr-2 h-4 w-4 text-amber-500" />
                  <span>Pie Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('composed')} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <BarChart2 className="mr-2 h-4 w-4 text-rose-500" />
                  <span>Composed Chart</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                  <Download size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg rounded-lg p-1.5">
                <DropdownMenuItem onClick={() => downloadCSV(data, editedTitle || title)} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <Download className="mr-2 h-4 w-4 text-blue-500" />
                  <span>CSV</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadPDF(chartRef, editedTitle || title)} className="flex items-center cursor-pointer rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors py-1.5">
                  <FileText className="mr-2 h-4 w-4 text-rose-500" />
                  <span>PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={15} className="text-violet-500" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/90 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-red-600 rounded-lg"
            >
              <Trash2 size={15} className="text-slate-400 hover:text-red-500 transition-colors" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-3 pb-2 px-3">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartWidget;
