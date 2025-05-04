
import React from 'react';
import { useRoadContext } from '../contexts/RoadContext';
import { MapPin, FileText, Users, TrendingUp } from 'lucide-react';
import CountUp from './CountUp';

const DashboardCards: React.FC = () => {
  const { roads, infraWorks } = useRoadContext();

  // Calculate total cost across all infrastructure works
  const totalCost = infraWorks.reduce((sum, work) => sum + work.cost, 0);
  
  // Count unique vendors
  const uniqueVendors = new Set(infraWorks.map(work => work.vendor)).size;
  
  // Calculate average progress across all infrastructure works
  const averageProgress = infraWorks.length > 0
    ? Math.round(infraWorks.reduce((sum, work) => sum + work.progress, 0) / infraWorks.length)
    : 0;

  const cards = [
    {
      title: 'Total Roads',
      value: roads.length,
      description: 'Registered roads',
      icon: <MapPin className="h-8 w-8 text-gov-blue" />,
      color: 'border-gov-blue'
    },
    {
      title: 'Infrastructure Works',
      value: infraWorks.length,
      description: 'Ongoing projects',
      icon: <FileText className="h-8 w-8 text-gov-green" />,
      color: 'border-gov-green'
    },
    {
      title: 'Total Cost',
      value: `₹${(totalCost / 10000000).toFixed(2)} Cr`,
      valueRaw: totalCost / 10000000,
      isCurrency: true,
      description: 'Combined budget',
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      color: 'border-purple-500'
    },
    {
      title: 'Active Vendors',
      value: uniqueVendors,
      description: 'Contracted companies',
      icon: <Users className="h-8 w-8 text-amber-500" />,
      color: 'border-amber-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => (
        <div 
          key={index} 
          className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${card.color}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.title}</p>
              <p className="text-2xl font-bold mt-1">
                {card.isCurrency ? (
                  <>
                    ₹<CountUp to={card.valueRaw} duration={1.5} separator="," />
                    {" Cr"}
                  </>
                ) : (
                  <CountUp to={card.value} duration={1.5} />
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.description}</p>
            </div>
            <div className="bg-gray-50 rounded-full p-3">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardCards;
