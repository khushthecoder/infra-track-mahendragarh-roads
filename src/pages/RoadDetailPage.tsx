
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useRoadContext } from '../contexts/RoadContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import RoadForm from '@/components/RoadForm';
import InfraWorkForm from '@/components/InfraWorkForm';
import InfraWorksList from '@/components/InfraWorksList';

const RoadDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { roads, infraWorks, filteredRoads } = useRoadContext();
  
  const road = roads.find(r => r.id === id);
  
  if (!road) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Road Not Found</h2>
        <p className="text-gray-600 mb-6">The road with ID {id} could not be found.</p>
        <Link to="/roads">
          <Button>
            <ArrowLeft size={16} className="mr-2" /> 
            Back to Road Registry
          </Button>
        </Link>
      </div>
    );
  }
  
  // Get infrastructure works for this road
  const roadWorks = infraWorks.filter(work => work.roadId === road.id);
  
  // Calculate total cost
  const totalCost = roadWorks.reduce((sum, work) => sum + work.cost, 0);
  
  // Calculate average progress
  const averageProgress = roadWorks.length > 0 
    ? Math.round(roadWorks.reduce((sum, work) => sum + work.progress, 0) / roadWorks.length)
    : 0;
  
  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/roads">
          <Button variant="outline" size="sm" className="mr-4">
            <ArrowLeft size={16} className="mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Road Details</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">{road.ward}</p>
            <h2 className="text-2xl font-bold text-gov-blue">{road.name}</h2>
            <p className="text-gray-600">ID: {road.id}</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit size={16} className="mr-1" /> Edit Road
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Edit Road</DialogTitle>
              </DialogHeader>
              <RoadForm editRoad={road} />
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Length</p>
                <p className="text-xl font-semibold">{road.length.toFixed(1)} km</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Width</p>
                <p className="text-xl font-semibold">{road.width.toFixed(1)} m</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Infrastructure</h3>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-500">Works</p>
                <p className="text-xl font-semibold">{roadWorks.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Cost</p>
                <p className="text-xl font-semibold">₹{totalCost.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Progress</h3>
            <div className="mt-2">
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-gov-blue h-2.5 rounded-full" 
                    style={{ width: `${averageProgress}%` }}
                  ></div>
                </div>
                <span>{averageProgress}%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {roadWorks.length === 0 
                  ? 'No infrastructure works yet' 
                  : `Average across ${roadWorks.length} works`}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Added on {new Date(road.dateAdded).toLocaleDateString()}
            <span className="mx-2">•</span>
            Last updated {new Date(road.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Infrastructure Works</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-gov-green hover:bg-gov-lightGreen text-white">
              <Plus size={16} className="mr-1" /> Add New Work
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add Infrastructure Work</DialogTitle>
            </DialogHeader>
            <InfraWorkForm roadId={road.id} />
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Filter out only this road's works in the context */}
      <div className="mb-6">
        {roadWorks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500 mb-4">No infrastructure works have been added for this road yet.</p>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gov-green hover:bg-gov-lightGreen text-white">
                  <Plus size={16} className="mr-1" /> Add First Infrastructure Work
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Infrastructure Work</DialogTitle>
                </DialogHeader>
                <InfraWorkForm roadId={road.id} />
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                  <th className="px-4 py-3">ID</th>
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
                {roadWorks.map(work => {
                  const startDate = new Date(work.startDate).toLocaleDateString();
                  const endDate = new Date(work.expectedEndDate).toLocaleDateString();
                  
                  // Phase badge colors
                  const phaseColors: Record<string, string> = {
                    planning: 'bg-blue-100 text-blue-800',
                    procurement: 'bg-purple-100 text-purple-800',
                    construction: 'bg-yellow-100 text-yellow-800',
                    completed: 'bg-green-100 text-green-800',
                    maintenance: 'bg-gray-100 text-gray-800'
                  };
                  
                  return (
                    <tr key={work.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{work.id}</td>
                      <td className="px-4 py-3">{work.description}</td>
                      <td className="px-4 py-3">{work.vendor}</td>
                      <td className="px-4 py-3">{work.cost.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${phaseColors[work.phase]}`}>
                          {work.phase.charAt(0).toUpperCase() + work.phase.slice(1)}
                        </span>
                      </td>
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadDetailPage;
