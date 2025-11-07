import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../Shared/Button';

const DefectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/defects')}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Back
        </Button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Defect Details</h1>
        <p className="text-gray-600 mt-2">Defect ID: {id}</p>
        <p className="text-gray-500 mt-4">Component under construction...</p>
      </div>
    </div>
  );
};

export default DefectDetail;
