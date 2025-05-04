
import React from 'react';
import { useRoadContext } from '../contexts/RoadContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InfraWorkForm from './InfraWorkForm';

const InfraWorksList: React.FC = () => {
  const { filteredInfraWorks, deleteInfraWork, roads } = useRoadContext();
  
  // Get road name by ID
  const getRoadName = (roadId: string) => {
    const road = roads.find(r => r.id === roadId);
    return road ? road.name : 'Unknown Road';
  };
  
  // Function to render phase badge with appropriate color
  const renderPhaseBadge = (phase: string) => {
    const colors: Record<string, string> = {
      planning: 'bg-blue-100 text-blue-800',
      procurement: 'bg-purple-100 text-purple-800',
      construction: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      maintenance: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[phase]}`}>
        {phase.charAt(0).toUpperCase() + phase.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Infrastructure Works ({filteredInfraWorks.length})
        </h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gov-green hover:bg-gov-lightGreen text-white">
              <Plus size={16} className="mr-1" /> Add New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Infrastructure Work</DialogTitle>
            </DialogHeader>
            <InfraWorkForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Road</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Vendor</th>
              <th className="px-4 py-3">Cost (₹)</th>
              <th className="px-4 py-3">Phase</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInfraWorks.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No infrastructure works found. Add a new work to get started.
                </td>
              </tr>
            ) : (
              filteredInfraWorks.map(work => {
                const startDate = new Date(work.startDate).toLocaleDateString();
                const endDate = new Date(work.expectedEndDate).toLocaleDateString();
                
                return (
                  <tr key={work.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{work.id}</td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/roads/${work.roadId}`} 
                        className="text-gov-blue hover:underline font-medium flex items-center"
                      >
                        <MapPin size={14} className="mr-1" /> {getRoadName(work.roadId)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{work.description}</td>
                    <td className="px-4 py-3">{work.vendor}</td>
                    <td className="px-4 py-3">{work.cost.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">{renderPhaseBadge(work.phase)}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs">
                        <div>Start: {startDate}</div>
                        <div>End: {endDate}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-gov-green h-2.5 rounded-full" 
                            style={{ width: `${work.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{work.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Edit size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Edit Infrastructure Work</DialogTitle>
                            </DialogHeader>
                            <InfraWorkForm editWork={work} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => deleteInfraWork(work.id)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfraWorksList;
