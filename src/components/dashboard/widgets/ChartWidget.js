
import React, { useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
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

const ChartWidget = ({
  title,
  data,
  type = 'bar',
  colors = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#3B82F6'],
  height = 300,
  className = '',
  showControls = true
}) => {
  const [chartType, setChartType] = useState(type);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const chartRef = useRef(null);
  const chartMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  
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
  
  const exportItems = [
    {
      label: 'CSV',
      icon: 'pi pi-download',
      command: () => downloadCSV(data, editedTitle || title)
    },
    {
      label: 'PDF',
      icon: 'pi pi-file-pdf',
      command: () => console.log('Export to PDF not implemented')
    }
  ];
  
  // Function to download CSV
  const downloadCSV = (data, filename) => {
    // CSV export logic (simplified)
    console.log('Exporting to CSV:', data, filename);
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
    <Card className={`h-full dashboard-widget ${className}`} ref={chartRef}>
      <Card.Header className="flex justify-between items-center pb-3">
        {isEditing ? (
          <InputText
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
            className="w-full"
            autoFocus
          />
        ) : (
          <div className="text-lg font-semibold">{editedTitle || title}</div>
        )}
        
        {showControls && (
          <div className="flex items-center space-x-2">
            <Button
              icon="pi pi-chart-bar"
              className="p-button-rounded p-button-outlined p-button-sm"
              onClick={(e) => chartMenuRef.current.toggle(e)}
            />
            <Menu model={chartTypeItems} popup ref={chartMenuRef} />
            
            <Button
              icon="pi pi-download"
              className="p-button-rounded p-button-outlined p-button-sm"
              onClick={(e) => exportMenuRef.current.toggle(e)}
            />
            <Menu model={exportItems} popup ref={exportMenuRef} />
            
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-outlined p-button-sm"
              onClick={() => setIsEditing(true)}
            />
            
            <Button
              icon="pi pi-trash"
              className="p-button-rounded p-button-outlined p-button-danger p-button-sm"
            />
          </div>
        )}
      </Card.Header>
      <Card.Body className="pt-3 pb-2 px-3">
        {renderChart()}
      </Card.Body>
    </Card>
  );
};

export default ChartWidget;
