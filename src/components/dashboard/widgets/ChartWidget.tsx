
import React, { useState } from 'react';
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
import { ChevronDown, Download, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon } from 'lucide-react';

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

const ChartWidget: React.FC<ChartWidgetProps> = ({
  title,
  data,
  type = 'bar',
  colors = ['#1E88E5', '#E91E63', '#66BB6A'],
  height = 300,
  className = '',
  showControls = true
}) => {
  const [chartType, setChartType] = useState<ChartType>(type);
  
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
    <Card className={`h-full overflow-hidden dashboard-widget ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {showControls && (
          <div className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ChevronDown size={15} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setChartType('bar')}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Bar Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('line')}>
                  <LineChartIcon className="mr-2 h-4 w-4" />
                  <span>Line Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('area')}>
                  <LineChartIcon className="mr-2 h-4 w-4" />
                  <span>Area Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('pie')}>
                  <PieChartIcon className="mr-2 h-4 w-4" />
                  <span>Pie Chart</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setChartType('composed')}>
                  <BarChart2 className="mr-2 h-4 w-4" />
                  <span>Composed Chart</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => downloadCSV(data, title)}
            >
              <Download size={15} />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default ChartWidget;
