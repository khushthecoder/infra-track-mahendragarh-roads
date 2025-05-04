
import React from 'react';
import Filters from '@/components/Filters';
import RoadsList from '@/components/RoadsList';
import ScrollVelocity from '@/components/ScrollVelocity';
import '../components/ScrollVelocity.css';

const RoadsPage = () => {
  return (
    <div>
      <div className="velocity-container">
        <ScrollVelocity
          texts={["Road Registry"]}
          velocity={50}
          className="scroll-text-item"
          numCopies={6}
        />
      </div>
      
      <Filters />
      <RoadsList />
    </div>
  );
};

export default RoadsPage;
