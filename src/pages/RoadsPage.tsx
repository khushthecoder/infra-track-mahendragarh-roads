
import React from 'react';
import Filters from '@/components/Filters';
import RoadsList from '@/components/RoadsList';

const RoadsPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Road Registry</h1>
      
      <Filters />
      <RoadsList />
    </div>
  );
};

export default RoadsPage;
