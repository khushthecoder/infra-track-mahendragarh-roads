
import React from 'react';
import { useRoadContext } from '../contexts/RoadContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Plus, MapPin } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RoadForm from './RoadForm';
import InfraWorkForm from './InfraWorkForm';

const RoadsList: React.FC = () => {
  const { filteredRoads, deleteRoad, infraWorks } = useRoadContext();
  
  // Function to count infrastructure works for a road
  const getInfraWorkCount = (roadId: string) => {
    return infraWorks.filter(work => work.roadId === roadId).length;
  };

  // Function to calculate total infrastructure cost for a road
  const getTotalInfraCost = (roadId: string) => {
    return infraWorks
      .filter(work => work.roadId === roadId)
      .reduce((total, work) => total + work.cost, 0);
  };

  // Function to get the overall progress for a road (average of all works)
  const getOverallProgress = (roadId: string) => {
    const roadWorks = infraWorks.filter(work => work.roadId === roadId);
    if (roadWorks.length === 0) return 0;
    
    const totalProgress = roadWorks.reduce((sum, work) => sum + work.progress, 0);
    return Math.round(totalProgress / roadWorks.length);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Roads Registry ({filteredRoads.length})
        </h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gov-blue hover:bg-gov-lightBlue text-white">
              <Plus size={16} className="mr-1" /> Add New Road
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Road</DialogTitle>
            </DialogHeader>
            <RoadForm />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Ward</th>
              <th className="px-4 py-3">Length (km)</th>
              <th className="px-4 py-3">Width (m)</th>
              <th className="px-4 py-3">Infra Works</th>
              <th className="px-4 py-3">Total Cost (₹)</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No roads found. Add a new road to get started.
                </td>
              </tr>
            ) : (
              filteredRoads.map(road => {
                const infraCount = getInfraWorkCount(road.id);
                const totalCost = getTotalInfraCost(road.id);
                const progress = getOverallProgress(road.id);
                
                return (
                  <tr key={road.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{road.id}</td>
                    <td className="px-4 py-3">
                      <Link 
                        to={`/roads/${road.id}`} 
                        className="text-gov-blue hover:underline font-medium flex items-center"
                      >
                        <MapPin size={14} className="mr-1" /> {road.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{road.ward}</td>
                    <td className="px-4 py-3">{road.length.toFixed(1)}</td>
                    <td className="px-4 py-3">{road.width.toFixed(1)}</td>
                    <td className="px-4 py-3">{infraCount}</td>
                    <td className="px-4 py-3">
                      {totalCost.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div 
                            className="bg-gov-blue h-2.5 rounded-full" 
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{progress}%</span>
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
                          <DialogContent className="sm:max-w-[550px]">
                            <DialogHeader>
                              <DialogTitle>Edit Road</DialogTitle>
                            </DialogHeader>
                            <RoadForm editRoad={road} />
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-gov-green text-white">
                              <Plus size={14} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle>Add Infrastructure Work</DialogTitle>
                            </DialogHeader>
                            <InfraWorkForm roadId={road.id} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                          onClick={() => deleteRoad(road.id)}
                          disabled={infraCount > 0}
                          title={infraCount > 0 ? "Cannot delete road with infrastructure works" : "Delete road"}
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

export default RoadsList;
