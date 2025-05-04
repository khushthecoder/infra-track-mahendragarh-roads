
import React from 'react';
import Filters from '@/components/Filters';
import InfraWorksList from '@/components/InfraWorksList';
import ScrollVelocity from '@/components/ScrollVelocity';
import '../components/ScrollVelocity.css';

const InfraPage = () => {
  return (
    <div>
      <div className="velocity-container">
        <ScrollVelocity
          texts={["Infrastructure Works"]}
          velocity={50}
          className="scroll-text-item"
          numCopies={6}
        />
      </div>
      
      <Filters />
      <InfraWorksList />
    </div>
  );
};

export default InfraPage;
