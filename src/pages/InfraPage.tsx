
import React from 'react';
import Filters from '@/components/Filters';
import InfraWorksList from '@/components/InfraWorksList';

const InfraPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Infrastructure Works</h1>
      
      <Filters />
      <InfraWorksList />
    </div>
  );
};

export default InfraPage;
