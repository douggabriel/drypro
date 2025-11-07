import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Badge from '../Shared/Badge';
import ProgressBar from '../Shared/ProgressBar';
import Button from '../Shared/Button';
import CreateActivityModal from './CreateActivityModal';
import useAuth from '../../hooks/useAuth';

const ActivitiesScreen = () => {
  const navigate = useNavigate();
  const { isSupervisor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('normal');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*, employees(name, role)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading activities..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Manage your units and patch work</p>
        </div>
        {isSupervisor && (
          <div className="flex gap-3">
            <Button
              onClick={() => {
                setCreateType('normal');
                setShowCreateModal(true);
              }}
              icon={<Plus className="w-5 h-5" />}
            >
              Start Unit
            </Button>
            <Button
              variant="purple"
              onClick={() => {
                setCreateType('patch');
                setShowCreateModal(true);
              }}
              icon={<Plus className="w-5 h-5" />}
            >
              Create Patch
            </Button>
          </div>
        )}
      </div>

      {/* Activities Grid */}
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => navigate(`/activities/${activity.id}`)}
              className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              {/* Type badge */}
              <div className="flex items-start justify-between mb-4">
                <Badge
                  type="custom"
                  label={activity.type === 'normal' ? 'UNIT' : 'PATCH'}
                  color="#fff"
                  bgColor={activity.type === 'normal' ? '#f97316' : '#a855f7'}
                />
                <Badge
                  type="status"
                  value={activity.overall_progress === 0 ? 'pending' : activity.overall_progress === 100 ? 'completed' : 'in_progress'}
                />
              </div>

              {/* Location */}
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {activity.level} - {activity.unit}
              </h3>

              {/* Assigned to */}
              <p className="text-sm text-gray-600 mb-4">
                Assigned to: <span className="font-semibold">{activity.employees?.name || 'Unassigned'}</span>
              </p>

              {/* Progress */}
              <ProgressBar progress={activity.overall_progress} showLabel labelPosition="outside" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl">
          <p className="text-gray-500 text-lg">No activities yet</p>
          {isSupervisor && (
            <Button
              className="mt-4"
              onClick={() => {
                setCreateType('normal');
                setShowCreateModal(true);
              }}
            >
              Start Your First Unit
            </Button>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreateActivityModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          activityType={createType}
        />
      )}
    </div>
  );
};

export default ActivitiesScreen;
