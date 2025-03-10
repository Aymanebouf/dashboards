
/**
 * Dashboard data models/interfaces
 */

// KPI Card data structure
export interface KPICardData {
  id: string;
  title: string;
  value: string | number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  description?: string;
  color?: string;
}

// Chart data structure
export interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'composed';
  data: any[];
  colors?: string[];
  height?: number;
}

// Dashboard KPI data structure
export interface DashboardKPIData {
  kpiCards: KPICardData[];
  charts: ChartData[];
}

// Custom widget configuration
export interface WidgetConfig {
  id: string;
  type: 'kpi' | 'chart';
  title: string;
  sourceData: string;
  size: [number, number]; // [width, height] in grid units
  position: [number, number]; // [x, y] position
  config: any;
}

// Dashboard configuration
export interface DashboardConfig {
  id: string;
  name: string;
  lastModified: Date;
  widgets: WidgetConfig[];
}

// AI Analysis Response structure
export interface AIAnalysisResult {
  remarks: string[];
  customInsights: any[];
  confidence: number;
}
