
export type Phase = 'planning' | 'procurement' | 'construction' | 'completed' | 'maintenance';

export interface Road {
  id: string;
  name: string;
  ward: string;
  length: number;
  width: number;
  dateAdded: string;
  lastUpdated: string;
}

export interface InfraWork {
  id: string;
  roadId: string;
  description: string;
  vendor: string;
  cost: number;
  startDate: string;
  expectedEndDate: string;
  actualEndDate?: string;
  phase: Phase;
  progress: number; // 0-100
  notes?: string;
}

export type FilterOptions = {
  ward: string;
  vendor: string;
  phase: Phase | '';
  searchQuery: string;
};
