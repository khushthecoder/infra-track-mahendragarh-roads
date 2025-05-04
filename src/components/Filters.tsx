
import React, { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { useRoadContext } from '../contexts/RoadContext';

const Filters: React.FC = () => {
  const { roads, infraWorks, filters, setFilters, exportData } = useRoadContext();
  
  // Get unique wards from roads
  const uniqueWards = useMemo(() => {
    const wards = new Set(roads.map(road => road.ward));
    return Array.from(wards).sort();
  }, [roads]);
  
  // Get unique vendors from infraWorks
  const uniqueVendors = useMemo(() => {
    const vendors = new Set(infraWorks.map(work => work.vendor));
    return Array.from(vendors).sort();
  }, [infraWorks]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      ward: '',
      vendor: '',
      phase: '',
      searchQuery: ''
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search roads & infra..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ searchQuery: e.target.value })}
              className="pl-8"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Ward</label>
          <select
            value={filters.ward}
            onChange={(e) => setFilters({ ward: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="">All Wards</option>
            {uniqueWards.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Vendor</label>
          <select
            value={filters.vendor}
            onChange={(e) => setFilters({ vendor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="">All Vendors</option>
            {uniqueVendors.map(vendor => (
              <option key={vendor} value={vendor}>{vendor}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Phase</label>
          <select
            value={filters.phase}
            onChange={(e) => setFilters({ phase: e.target.value as any })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue"
          >
            <option value="">All Phases</option>
            <option value="planning">Planning</option>
            <option value="procurement">Procurement</option>
            <option value="construction">Construction</option>
            <option value="completed">Completed</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={clearFilters}
          className="text-sm"
        >
          <X size={16} className="mr-1" /> Clear Filters
        </Button>
        
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => exportData('csv')}
            className="text-sm"
          >
            Export CSV
          </Button>
          <Button 
            variant="outline" 
            onClick={() => exportData('json')}
            className="text-sm"
          >
            Export JSON
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
