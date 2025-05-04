
import React from 'react';
import DashboardCards from '@/components/DashboardCards';
import DashboardChart from '@/components/DashboardChart';
import Filters from '@/components/Filters';
import RoadsList from '@/components/RoadsList';
import ScrollVelocity from '@/components/ScrollVelocity';
import '../components/ScrollVelocity.css';

const Index = () => {
  return (
    <div>
      <div className="velocity-container">
        <ScrollVelocity
          texts={["Road Infrastructure Monitoring Dashboard"]}
          velocity={50}
          className="scroll-text-item"
          numCopies={4}
        />
      </div>
      
      <DashboardCards />
      <DashboardChart />
      
      <Filters />
      <RoadsList />
    </div>
  );
};

export default Index;
