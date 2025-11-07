import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Badge from '../Shared/Badge';
import Button from '../Shared/Button';
import ReportDefectModal from './ReportDefectModal';
import { PRIORITY_CONFIG } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/dateUtils';

const DefectsScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [defects, setDefects] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    loadDefects();
  }, []);

  const loadDefects = async () => {
    try {
      const { data, error } = await supabase
        .from('defects')
        .select('*, user_profiles!defects_reported_by_fkey(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDefects(data || []);
    } catch (error) {
      console.error('Error loading defects:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading defects..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Defects</h1>
          <p className="text-gray-600 mt-1">Track and manage construction defects</p>
        </div>
        <Button
          variant="danger"
          onClick={() => setShowReportModal(true)}
          icon={<Plus className="w-5 h-5" />}
        >
          Report Defect
        </Button>
      </div>

      {/* Defects Grid */}
      {defects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defects.map((defect) => (
            <div
              key={defect.id}
              onClick={() => navigate(`/defects/${defect.id}`)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow border-l-4 cursor-pointer"
              style={{ borderColor: PRIORITY_CONFIG[defect.priority].dotColor }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <Badge type="priority" value={defect.priority} />
                <Badge type="status" value={defect.status} />
              </div>

              {/* Description */}
              <p className="font-bold text-gray-900 mb-3 line-clamp-2">
                {defect.description}
              </p>

              {/* Location */}
              <p className="text-sm text-gray-600 mb-2">
                📍 {defect.level}, {defect.unit}
              </p>

              {/* Reported by */}
              <p className="text-sm text-gray-600">
                Reported by {defect.user_profiles?.name} • {formatRelativeTime(defect.created_at)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-gray-500 text-lg">No defects reported</p>
          <Button
            variant="danger"
            className="mt-4"
            onClick={() => setShowReportModal(true)}
          >
            Report First Defect
          </Button>
        </div>
      )}

      {/* Report Defect Modal */}
      {showReportModal && (
        <ReportDefectModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

export default DefectsScreen;
