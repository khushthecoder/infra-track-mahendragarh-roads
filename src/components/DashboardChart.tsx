import React, { useMemo } from 'react';
import { useRoadContext } from '../contexts/RoadContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CountUp from './CountUp';

const DashboardChart: React.FC = () => {
  const { roads, infraWorks } = useRoadContext();

  // Prepare data for ward-wise chart
  const wardData = useMemo(() => {
    // Group roads by ward
    const wardGroups: Record<string, {
      ward: string;
      roads: number;
      infraWorks: number;
      totalCost: number;
      averageProgress: number;
    }> = {};

    // Initialize with all wards
    roads.forEach(road => {
      if (!wardGroups[road.ward]) {
        wardGroups[road.ward] = {
          ward: road.ward,
          roads: 0,
          infraWorks: 0,
          totalCost: 0,
          averageProgress: 0
        };
      }
      wardGroups[road.ward].roads += 1;
    });

    // Add infra work data
    infraWorks.forEach(work => {
      const road = roads.find(r => r.id === work.roadId);
      if (road) {
        const ward = road.ward;
        wardGroups[ward].infraWorks += 1;
        wardGroups[ward].totalCost += work.cost;
        // We'll calculate the average later
        wardGroups[ward].averageProgress += work.progress;
      }
    });

    // Calculate average progress
    Object.keys(wardGroups).forEach(ward => {
      if (wardGroups[ward].infraWorks > 0) {
        wardGroups[ward].averageProgress = Math.round(
          wardGroups[ward].averageProgress / wardGroups[ward].infraWorks
        );
      }
    });

    // Convert to array and sort by ward
    return Object.values(wardGroups).sort((a, b) => a.ward.localeCompare(b.ward));
  }, [roads, infraWorks]);

  // Prepare data for phase-wise chart
  const phaseData = useMemo(() => {
    const phases: Record<string, { phase: string; count: number; totalCost: number }> = {
      planning: { phase: 'Planning', count: 0, totalCost: 0 },
      procurement: { phase: 'Procurement', count: 0, totalCost: 0 },
      construction: { phase: 'Construction', count: 0, totalCost: 0 },
      completed: { phase: 'Completed', count: 0, totalCost: 0 },
      maintenance: { phase: 'Maintenance', count: 0, totalCost: 0 }
    };

    infraWorks.forEach(work => {
      phases[work.phase].count += 1;
      phases[work.phase].totalCost += work.cost;
    });

    return Object.values(phases);
  }, [infraWorks]);

  // Custom tooltip component with CountUp animation
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-sm rounded">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: `}
              <CountUp 
                to={entry.value} 
                duration={0.8} 
                separator="," 
                className="font-medium"
              />
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Ward-wise Road Infrastructure</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={wardData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ward" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="roads" name="Roads" fill="#0053A5" />
            <Bar yAxisId="left" dataKey="infraWorks" name="Infra Works" fill="#00796B" />
            <Bar yAxisId="right" dataKey="averageProgress" name="Avg. Progress %" fill="#FFB74D" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Infrastructure by Phase</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={phaseData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="phase" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar yAxisId="left" dataKey="count" name="Number of Works" fill="#5E35B1" />
            <Bar yAxisId="right" dataKey="totalCost" name="Total Cost (₹)" fill="#00BCD4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardChart;
