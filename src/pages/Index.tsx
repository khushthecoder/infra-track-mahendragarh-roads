
import React from 'react';
import DashboardCards from '@/components/DashboardCards';
import DashboardChart from '@/components/DashboardChart';
import Filters from '@/components/Filters';
import RoadsList from '@/components/RoadsList';

const Index = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Road Infrastructure Monitoring Dashboard</h1>
      
      <DashboardCards />
      <DashboardChart />
      
      <Filters />
      <RoadsList />
    </div>
  );
};

export default Index;
