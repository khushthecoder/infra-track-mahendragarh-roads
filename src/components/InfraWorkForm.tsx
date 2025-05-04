
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRoadContext } from '../contexts/RoadContext';
import { InfraWork, Phase } from '../types';

interface InfraWorkFormProps {
  roadId?: string;
  editWork?: InfraWork;
  onComplete?: () => void;
}

const InfraWorkForm: React.FC<InfraWorkFormProps> = ({ 
  roadId, 
  editWork, 
  onComplete 
}) => {
  const { roads, addInfraWork, updateInfraWork } = useRoadContext();
  
  const [formData, setFormData] = useState<{
    roadId: string;
    description: string;
    vendor: string;
    cost: number;
    startDate: string;
    expectedEndDate: string;
    actualEndDate?: string;
    phase: Phase;
    progress: number;
    notes?: string;
  }>({
    roadId: roadId || editWork?.roadId || '',
    description: editWork?.description || '',
    vendor: editWork?.vendor || '',
    cost: editWork?.cost || 0,
    startDate: editWork?.startDate || '',
    expectedEndDate: editWork?.expectedEndDate || '',
    actualEndDate: editWork?.actualEndDate || '',
    phase: editWork?.phase || 'planning',
    progress: editWork?.progress || 0,
    notes: editWork?.notes || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cost' ? 
        parseFloat(value) || 0 : 
        name === 'progress' ? 
        Math.min(100, Math.max(0, parseInt(value) || 0)) : 
        value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editWork) {
      updateInfraWork({
        ...editWork,
        ...formData,
      });
    } else {
      addInfraWork(formData);
    }
    
    if (!roadId) {
      setFormData({
        roadId: '',
        description: '',
        vendor: '',
        cost: 0,
        startDate: '',
        expectedEndDate: '',
        actualEndDate: '',
        phase: 'planning',
        progress: 0,
        notes: '',
      });
    } else {
      setFormData(prev => ({
        ...prev,
        description: '',
        vendor: '',
        cost: 0,
        startDate: '',
        expectedEndDate: '',
        actualEndDate: '',
        phase: 'planning',
        progress: 0,
        notes: '',
      }));
    }
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      {!roadId && (
        <div className="space-y-2">
          <Label htmlFor="roadId">Road</Label>
          <select
            id="roadId"
            name="roadId"
            value={formData.roadId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue"
            required
          >
            <option value="">Select Road</option>
            {roads.map(road => (
              <option key={road.id} value={road.id}>
                {road.id} - {road.name} ({road.ward})
              </option>
            ))}
          </select>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Brief description of work"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="vendor">Vendor/Contractor</Label>
        <Input
          id="vendor"
          name="vendor"
          value={formData.vendor}
          onChange={handleChange}
          placeholder="Name of vendor/contractor"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cost">Estimated Cost (₹)</Label>
        <Input
          id="cost"
          name="cost"
          type="number"
          min="0"
          step="1000"
          value={formData.cost}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expectedEndDate">Expected End Date</Label>
          <Input
            id="expectedEndDate"
            name="expectedEndDate"
            type="date"
            value={formData.expectedEndDate}
            onChange={handleChange}
            required
          />
        </div>
        
        {formData.phase === 'completed' && (
          <div className="space-y-2">
            <Label htmlFor="actualEndDate">Actual End Date</Label>
            <Input
              id="actualEndDate"
              name="actualEndDate"
              type="date"
              value={formData.actualEndDate || ''}
              onChange={handleChange}
              required={formData.phase === 'completed'}
            />
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phase">Current Phase</Label>
        <select
          id="phase"
          name="phase"
          value={formData.phase}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue"
          required
        >
          <option value="planning">Planning</option>
          <option value="procurement">Procurement</option>
          <option value="construction">Construction</option>
          <option value="completed">Completed</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="progress">
          Progress: {formData.progress}%
        </Label>
        <Input
          id="progress"
          name="progress"
          type="range"
          min="0"
          max="100"
          value={formData.progress}
          onChange={handleChange}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          placeholder="Optional notes or comments"
          rows={3}
        />
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="bg-gov-green hover:bg-gov-lightGreen text-white"
        >
          {editWork ? 'Update Infrastructure Work' : 'Add Infrastructure Work'}
        </Button>
      </div>
    </form>
  );
};

export default InfraWorkForm;
