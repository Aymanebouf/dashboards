
/**
 * Dashboard related types
 */

// Widget type definition
export type WidgetType = 'kpi' | 'chart' | 'table';

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

// Define widget configuration structure
export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  size: [number, number]; // [columns, rows]
  position?: [number, number]; // [x, y] - Optional for auto-positioning
  config: any; // Specific configuration for the widget type
}
