
/**
 * Dashboard related types
 */

// Widget type definition
export type WidgetType = 'kpi' | 'chart' | 'table';

// Limited widget type for services that don't support table widgets
export type ServiceWidgetType = 'kpi' | 'chart';

// Chart type definition (can be used across the application)
export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'composed';

// Define the dashboard model structure here
export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: WidgetConfig[];
  lastModified?: Date;
  createdAt?: Date;
  userId?: string;
}

// Define dashboard configuration for controllers
export interface DashboardConfig {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  lastModified: Date;
}

// Define widget configuration structure
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  sourceData: string;
  size: [number, number]; // [columns, rows]
  position: [number, number]; // [x, y]
  config: any; // Specific configuration for the widget type
}

// For compatibility with the dashboardService
export interface ServiceWidgetConfig {
  id: string;
  type: ServiceWidgetType;
  title: string;
  sourceData: string;
  size: [number, number]; // [width, height]
  position: [number, number]; // [x, y]
  config?: any; // Config may be optional in some contexts
}

// For compatibility with the dashboardService
export interface ServiceDashboardConfig {
  id: string;
  name: string;
  widgets: ServiceWidgetConfig[];
  lastModified: Date;
}
