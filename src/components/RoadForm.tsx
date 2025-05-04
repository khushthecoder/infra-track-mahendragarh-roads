
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRoadContext } from '../contexts/RoadContext';
import { Road } from '../types';

interface RoadFormProps {
  editRoad?: Road;
  onComplete?: () => void;
}

const RoadForm: React.FC<RoadFormProps> = ({ editRoad, onComplete }) => {
  const { addRoad, updateRoad } = useRoadContext();
  
  const [formData, setFormData] = useState<{
    name: string;
    ward: string;
    length: number;
    width: number;
  }>({
    name: editRoad?.name || '',
    ward: editRoad?.ward || '',
    length: editRoad?.length || 0,
    width: editRoad?.width || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'length' || name === 'width' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editRoad) {
      updateRoad({
        ...editRoad,
        ...formData
      });
    } else {
      addRoad(formData);
    }
    
    setFormData({
      name: '',
      ward: '',
      length: 0,
      width: 0,
    });
    
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="space-y-2">
        <Label htmlFor="name">Road Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Enter road name" 
          required 
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ward">Ward</Label>
        <select
          id="ward"
          name="ward"
          value={formData.ward}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gov-blue"
          required
        >
          <option value="">Select Ward</option>
          {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
            <option key={num} value={`Ward ${num}`}>Ward {num}</option>
          ))}
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">Length (km)</Label>
          <Input 
            id="length" 
            name="length" 
            type="number" 
            min="0.1" 
            step="0.1" 
            value={formData.length} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="width">Width (m)</Label>
          <Input 
            id="width" 
            name="width" 
            type="number" 
            min="1" 
            step="0.5" 
            value={formData.width} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>
      
      <div className="pt-2">
        <Button 
          type="submit" 
          className="bg-gov-blue hover:bg-gov-lightBlue text-white"
        >
          {editRoad ? 'Update Road' : 'Add Road'}
        </Button>
      </div>
    </form>
  );
};

export default RoadForm;
