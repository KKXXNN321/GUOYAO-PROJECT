export interface MonthlyData {
  month: string; // Format: YYYY-MM
  actualSales: number;
  targetSales: number;
  hospitalCoverage: number; // Number of hospitals
  activities: string; // Key marketing activities description
}

export enum ProjectStatus {
  Active = 'Active',
  Pending = 'Pending',
  Completed = 'Completed'
}

export interface Project {
  id: string;
  name: string; // Project Name (e.g., "Cardio Drug A Promotion")
  manufacturer: string; // Upstream Pharma Company
  products: string; // Covered varieties/products (e.g. "Aspirin, Ibuprofen")
  startDate: string;
  status: ProjectStatus;
  description: string;
  monthlyData: MonthlyData[];
}

export interface KPI {
  totalSales: number;
  totalTarget: number;
  achievementRate: number;
  activeProjects: number;
}