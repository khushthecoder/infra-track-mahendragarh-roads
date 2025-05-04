
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Road, InfraWork, FilterOptions } from '../types';
import { toast } from 'sonner';

interface RoadContextType {
  roads: Road[];
  infraWorks: InfraWork[];
  filters: FilterOptions;
  addRoad: (road: Omit<Road, 'id' | 'dateAdded' | 'lastUpdated'>) => void;
  updateRoad: (road: Road) => void;
  deleteRoad: (id: string) => void;
  addInfraWork: (work: Omit<InfraWork, 'id'>) => void;
  updateInfraWork: (work: InfraWork) => void;
  deleteInfraWork: (id: string) => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  filteredRoads: Road[];
  filteredInfraWorks: InfraWork[];
  exportData: (format: 'csv' | 'json') => void;
}

const RoadContext = createContext<RoadContextType | undefined>(undefined);

export const RoadProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roads, setRoads] = useState<Road[]>([]);
  const [infraWorks, setInfraWorks] = useState<InfraWork[]>([]);
  const [filters, setFiltersState] = useState<FilterOptions>({
    ward: '',
    vendor: '',
    phase: '',
    searchQuery: '',
  });

  // Load initial data from localStorage
  useEffect(() => {
    const savedRoads = localStorage.getItem('roads');
    const savedInfraWorks = localStorage.getItem('infraWorks');

    if (savedRoads) {
      setRoads(JSON.parse(savedRoads));
    } else {
      // Initialize with sample data
      const sampleRoads: Road[] = [
        {
          id: 'MHG-W01-R001',
          name: 'Main Market Road',
          ward: 'Ward 1',
          length: 2.5,
          width: 8,
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
        {
          id: 'MHG-W02-R001',
          name: 'College Link Road',
          ward: 'Ward 2',
          length: 1.8,
          width: 6,
          dateAdded: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        },
      ];
      setRoads(sampleRoads);
      localStorage.setItem('roads', JSON.stringify(sampleRoads));
    }

    if (savedInfraWorks) {
      setInfraWorks(JSON.parse(savedInfraWorks));
    } else {
      // Initialize with sample data
      const sampleInfraWorks: InfraWork[] = [
        {
          id: 'INF-001',
          roadId: 'MHG-W01-R001',
          description: 'Resurfacing work',
          vendor: 'ABC Construction',
          cost: 5000000,
          startDate: '2025-04-01',
          expectedEndDate: '2025-06-30',
          phase: 'construction',
          progress: 35,
          notes: 'On schedule, no issues reported',
        },
        {
          id: 'INF-002',
          roadId: 'MHG-W02-R001',
          description: 'Drainage installation',
          vendor: 'XYZ Contractors',
          cost: 3200000,
          startDate: '2025-03-15',
          expectedEndDate: '2025-05-30',
          phase: 'construction',
          progress: 65,
          notes: 'Ahead of schedule, good progress',
        },
      ];
      setInfraWorks(sampleInfraWorks);
      localStorage.setItem('infraWorks', JSON.stringify(sampleInfraWorks));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('roads', JSON.stringify(roads));
  }, [roads]);

  useEffect(() => {
    localStorage.setItem('infraWorks', JSON.stringify(infraWorks));
  }, [infraWorks]);

  // Generate a unique road ID based on ward
  const generateRoadId = (ward: string): string => {
    const wardNumber = ward.replace(/[^0-9]/g, '').padStart(2, '0');
    const wardPrefix = `MHG-W${wardNumber}`;
    
    // Find existing roads in this ward
    const wardRoads = roads.filter(r => r.id.includes(`MHG-W${wardNumber}`));
    const roadNumber = (wardRoads.length + 1).toString().padStart(3, '0');
    
    return `${wardPrefix}-R${roadNumber}`;
  };

  // Add a new road
  const addRoad = (roadData: Omit<Road, 'id' | 'dateAdded' | 'lastUpdated'>) => {
    const now = new Date().toISOString();
    const newRoad: Road = {
      ...roadData,
      id: generateRoadId(roadData.ward),
      dateAdded: now,
      lastUpdated: now,
    };
    
    setRoads([...roads, newRoad]);
    toast.success(`Road "${newRoad.name}" added with ID: ${newRoad.id}`);
  };

  // Update an existing road
  const updateRoad = (updatedRoad: Road) => {
    const updatedRoads = roads.map(road => 
      road.id === updatedRoad.id ? { ...updatedRoad, lastUpdated: new Date().toISOString() } : road
    );
    setRoads(updatedRoads);
    toast.success(`Road "${updatedRoad.name}" updated`);
  };

  // Delete a road
  const deleteRoad = (id: string) => {
    const roadToDelete = roads.find(road => road.id === id);
    if (!roadToDelete) return;
    
    // Check if there are infrastructure works associated with this road
    const associatedWorks = infraWorks.filter(work => work.roadId === id);
    if (associatedWorks.length > 0) {
      toast.error(`Cannot delete road. ${associatedWorks.length} infrastructure works are associated with it.`);
      return;
    }
    
    setRoads(roads.filter(road => road.id !== id));
    toast.success(`Road "${roadToDelete.name}" deleted`);
  };

  // Generate a unique infra work ID
  const generateInfraWorkId = (): string => {
    return `INF-${(infraWorks.length + 1).toString().padStart(3, '0')}`;
  };

  // Add a new infrastructure work
  const addInfraWork = (workData: Omit<InfraWork, 'id'>) => {
    const newWork: InfraWork = {
      ...workData,
      id: generateInfraWorkId(),
    };
    
    setInfraWorks([...infraWorks, newWork]);
    toast.success(`Infrastructure work added for Road ID: ${workData.roadId}`);
  };

  // Update an existing infrastructure work
  const updateInfraWork = (updatedWork: InfraWork) => {
    const updatedWorks = infraWorks.map(work => 
      work.id === updatedWork.id ? updatedWork : work
    );
    setInfraWorks(updatedWorks);
    toast.success(`Infrastructure work updated`);
  };

  // Delete an infrastructure work
  const deleteInfraWork = (id: string) => {
    setInfraWorks(infraWorks.filter(work => work.id !== id));
    toast.success(`Infrastructure work deleted`);
  };

  // Update filters
  const setFilters = (newFilters: Partial<FilterOptions>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  // Apply filters to roads
  const filteredRoads = roads.filter(road => {
    const searchLower = filters.searchQuery.toLowerCase();
    const matchesSearch = 
      road.name.toLowerCase().includes(searchLower) || 
      road.id.toLowerCase().includes(searchLower);
    
    const matchesWard = !filters.ward || road.ward === filters.ward;
    
    return matchesSearch && matchesWard;
  });

  // Apply filters to infra works
  const filteredInfraWorks = infraWorks.filter(work => {
    const matchesRoad = filteredRoads.some(road => road.id === work.roadId);
    const matchesVendor = !filters.vendor || work.vendor === filters.vendor;
    const matchesPhase = !filters.phase || work.phase === filters.phase;
    
    return matchesRoad && matchesVendor && matchesPhase;
  });

  // Export data function
  const exportData = (format: 'csv' | 'json') => {
    let data;
    let filename;
    let contentType;
    
    // Prepare data by joining roads with their infrastructure works
    const exportData = filteredRoads.map(road => {
      const roadWorks = filteredInfraWorks.filter(work => work.roadId === road.id);
      return {
        ...road,
        infraWorks: roadWorks,
      };
    });
    
    if (format === 'json') {
      data = JSON.stringify(exportData, null, 2);
      filename = `mahendragarh-roads-${new Date().toISOString().split('T')[0]}.json`;
      contentType = 'application/json';
    } else {
      // CSV export requires flattening the data
      const csvRows = [];
      
      // CSV header
      const header = ['Road ID', 'Road Name', 'Ward', 'Length (km)', 'Width (m)', 
                      'Work ID', 'Description', 'Vendor', 'Cost (₹)', 'Phase', 'Progress (%)'];
      csvRows.push(header.join(','));
      
      // CSV data rows
      exportData.forEach(road => {
        if (road.infraWorks.length > 0) {
          road.infraWorks.forEach(work => {
            const row = [
              `"${road.id}"`,
              `"${road.name}"`,
              `"${road.ward}"`,
              road.length,
              road.width,
              `"${work.id}"`,
              `"${work.description}"`,
              `"${work.vendor}"`,
              work.cost,
              `"${work.phase}"`,
              work.progress
            ];
            csvRows.push(row.join(','));
          });
        } else {
          // Road with no infrastructure works
          const row = [
            `"${road.id}"`,
            `"${road.name}"`,
            `"${road.ward}"`,
            road.length,
            road.width,
            '""', // empty work ID
            '""', // empty description
            '""', // empty vendor
            '', // empty cost
            '""', // empty phase
            '' // empty progress
          ];
          csvRows.push(row.join(','));
        }
      });
      
      data = csvRows.join('\n');
      filename = `mahendragarh-roads-${new Date().toISOString().split('T')[0]}.csv`;
      contentType = 'text/csv';
    }
    
    // Create and trigger download
    const blob = new Blob([data], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    a.click();
    
    toast.success(`Data exported as ${format.toUpperCase()}`);
  };

  const value = {
    roads,
    infraWorks,
    filters,
    addRoad,
    updateRoad,
    deleteRoad,
    addInfraWork,
    updateInfraWork,
    deleteInfraWork,
    setFilters,
    filteredRoads,
    filteredInfraWorks,
    exportData
  };

  return <RoadContext.Provider value={value}>{children}</RoadContext.Provider>;
};

export const useRoadContext = (): RoadContextType => {
  const context = useContext(RoadContext);
  if (context === undefined) {
    throw new Error('useRoadContext must be used within a RoadProvider');
  }
  return context;
};
