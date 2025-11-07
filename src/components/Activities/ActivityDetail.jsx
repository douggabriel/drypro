import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Badge from '../Shared/Badge';
import ProgressBar from '../Shared/ProgressBar';
import Button from '../Shared/Button';
import { formatDate } from '../../utils/dateUtils';

const ActivityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState(null);
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    loadActivity();
  }, [id]);

  const loadActivity = async () => {
    try {
      // Load activity
      const { data: activityData, error: activityError } = await supabase
        .from('activities')
        .select('*, employees(name, role), user_profiles(name)')
        .eq('id', id)
        .single();

      if (activityError) throw activityError;
      setActivity(activityData);

      // Load phases
      const { data: phasesData, error: phasesError } = await supabase
        .from('activity_phases')
        .select('*')
        .eq('activity_id', id)
        .order('phase_order', { ascending: true });

      if (phasesError) throw phasesError;
      setPhases(phasesData || []);
    } catch (error) {
      console.error('Error loading activity:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading activity..." />;
  }

  if (!activity) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Activity not found</p>
        <Button className="mt-4" onClick={() => navigate('/activities')}>
          Back to Activities
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/activities')}
          icon={<ArrowLeft className="w-5 h-5" />}
        >
          Back
        </Button>
      </div>

      {/* Activity Info */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {activity.level} - {activity.unit}
              </h1>
              <Badge
                type="custom"
                label={activity.type === 'normal' ? 'UNIT' : 'PATCH'}
                color="#fff"
                bgColor={activity.type === 'normal' ? '#f97316' : '#a855f7'}
              />
            </div>
            <p className="text-gray-600">Created on {formatDate(activity.created_at)}</p>
          </div>
          <Badge
            type="status"
            value={activity.overall_progress === 0 ? 'pending' : activity.overall_progress === 100 ? 'completed' : 'in_progress'}
            size="lg"
          />
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Assigned To</p>
            <p className="font-semibold text-gray-900">
              {activity.employees?.name || 'Unassigned'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Created By</p>
            <p className="font-semibold text-gray-900">
              {activity.user_profiles?.name || 'Unknown'}
            </p>
          </div>
        </div>

        {activity.description && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-gray-900">{activity.description}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-gray-600 mb-2">Overall Progress</p>
          <ProgressBar progress={activity.overall_progress} showLabel labelPosition="outside" size="lg" />
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Work Phases</h2>

        {phases.map((phase, index) => (
          <div
            key={phase.id}
            className={`bg-white rounded-2xl p-6 shadow-md border-l-4 ${
              phase.status === 'completed'
                ? 'border-green-500 bg-green-50'
                : phase.status === 'in_progress'
                ? 'border-blue-500'
                : 'border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {index + 1}. {phase.phase_name}
                </h3>
                <Badge
                  type="status"
                  value={phase.status}
                />
              </div>
            </div>

            <ProgressBar progress={phase.progress} showLabel labelPosition="outside" />

            {phase.completed_at && (
              <p className="text-sm text-gray-600 mt-4">
                Completed on {formatDate(phase.completed_at)}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityDetail;
