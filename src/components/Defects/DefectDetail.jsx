import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, CheckCircle } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Badge from '../Shared/Badge';
import ProgressBar from '../Shared/ProgressBar';
import Button from '../Shared/Button';
import PhotoGallery from '../Shared/PhotoGallery';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { PRIORITY_CONFIG } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

const DefectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isSupervisor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [defect, setDefect] = useState(null);
  const [phases, setPhases] = useState([]);

  useEffect(() => {
    loadDefect();
  }, [id]);

  const loadDefect = async () => {
    try {
      console.log('Loading defect with ID:', id);

      // Load defect
      const { data: defectData, error: defectError } = await supabase
        .from('defects')
        .select(`
          *,
          employees(name, role),
          user_profiles!defects_reported_by_fkey(name),
          resolved_user:user_profiles!defects_resolved_by_fkey(name)
        `)
        .eq('id', id)
        .single();

      console.log('Defect data:', defectData);
      console.log('Defect error:', defectError);

      if (defectError) {
        console.error('Error loading defect:', defectError);
        throw defectError;
      }

      setDefect(defectData);

      // Load defect phases
      const { data: phasesData, error: phasesError } = await supabase
        .from('defect_phases')
        .select('*')
        .eq('defect_id', id)
        .order('phase_order', { ascending: true });

      console.log('Defect phases data:', phasesData);
      console.log('Defect phases error:', phasesError);

      if (phasesError) {
        console.error('Error loading defect phases:', phasesError);
        throw phasesError;
      }

      setPhases(phasesData || []);
    } catch (error) {
      console.error('Error in loadDefect:', error);
      // Set defect to null to show the "not found" message
      setDefect(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async () => {
    if (!window.confirm('Are you sure this defect has been completely resolved?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('defects')
        .update({
          status: 'resolved',
          resolved_by: currentUser.id,
          resolved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Mark all phases as completed
      await supabase
        .from('defect_phases')
        .update({
          status: 'completed',
          progress: 100,
          completed_by: currentUser.id,
          completed_at: new Date().toISOString(),
        })
        .eq('defect_id', id)
        .neq('status', 'completed');

      loadDefect();
      alert('Defect marked as resolved!');
    } catch (error) {
      console.error('Error resolving defect:', error);
      alert('Failed to resolve defect');
    }
  };

  const handleUpdatePhase = async (phaseId, progress) => {
    try {
      const updateData = {
        progress: parseInt(progress),
        status: progress === 0 ? 'pending' : progress < 100 ? 'in_progress' : 'completed',
      };

      if (progress === 100) {
        updateData.completed_by = currentUser.id;
        updateData.completed_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('defect_phases')
        .update(updateData)
        .eq('id', phaseId);

      if (error) throw error;
      loadDefect();
    } catch (error) {
      console.error('Error updating phase:', error);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading defect..." />;
  }

  if (!defect) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Defect not found</p>
        <Button className="mt-4" onClick={() => navigate('/defects')}>
          Back to Defects
        </Button>
      </div>
    );
  }

  const priorityConfig = PRIORITY_CONFIG[defect.priority];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
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

      {/* Defect Info */}
      <div
        className="bg-white rounded-2xl p-6 shadow-md border-l-4"
        style={{ borderColor: priorityConfig.dotColor }}
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge type="priority" value={defect.priority} size="lg" />
              <Badge type="status" value={defect.status} size="lg" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
              {defect.description}
            </h1>
            <p className="text-gray-600">
              📍 {defect.level}, {defect.unit}
            </p>
          </div>

          {/* Resolve button - only if not resolved and user has permission */}
          {defect.status !== 'resolved' && (isSupervisor || defect.assigned_to) && (
            <Button
              variant="green"
              onClick={handleResolve}
              icon={<CheckCircle className="w-5 h-5" />}
            >
              Mark as Resolved
            </Button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Reported By</p>
            <p className="font-semibold text-gray-900">
              {defect.user_profiles?.name || 'Unknown'}
            </p>
            <p className="text-sm text-gray-500">{formatRelativeTime(defect.created_at)}</p>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-1">Assigned To</p>
            <p className="font-semibold text-gray-900">
              {defect.employees?.name || 'Unassigned'}
            </p>
          </div>

          {defect.category && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Category</p>
              <p className="font-semibold text-gray-900">{defect.category}</p>
            </div>
          )}

          {defect.resolved_at && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="font-semibold text-gray-900">
                {formatDate(defect.resolved_at)}
              </p>
              <p className="text-sm text-gray-500">
                by {defect.resolved_user?.name || 'Unknown'}
              </p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-sm font-semibold text-gray-700 mb-2">Full Description</p>
          <p className="text-gray-900">{defect.description}</p>
        </div>
      </div>

      {/* Photo Gallery */}
      <PhotoGallery
        photos={defect.photos || []}
        title="Defect Evidence Photos"
        emptyMessage="No photos have been uploaded for this defect"
      />

      {/* Repair Phases */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Repair Progress</h2>
        <p className="text-gray-600">Track the repair workflow through 4 phases</p>

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
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {index + 1}. {phase.phase_name}
                </h3>
                <Badge type="status" value={phase.status} />
              </div>

              {/* Quick update if not completed */}
              {phase.status !== 'completed' && defect.status !== 'resolved' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600">Quick Update:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="25"
                    value={phase.progress}
                    onChange={(e) => handleUpdatePhase(phase.id, e.target.value)}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <span className="text-xs text-gray-600 text-center">
                    {phase.progress}%
                  </span>
                </div>
              )}
            </div>

            <ProgressBar progress={phase.progress} showLabel labelPosition="outside" />

            {phase.completed_at && (
              <p className="text-sm text-gray-600 mt-4">
                ✓ Completed on {formatDate(phase.completed_at)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Activity History */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Activity History</h3>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Defect reported</span> by{' '}
                {defect.user_profiles?.name}
              </p>
              <p className="text-xs text-gray-500">{formatRelativeTime(defect.created_at)}</p>
            </div>
          </div>

          {defect.assigned_to && (
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">Assigned to</span>{' '}
                  {defect.employees?.name}
                </p>
              </div>
            </div>
          )}

          {defect.status === 'resolved' && (
            <div className="flex gap-3 items-start">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">Defect resolved</span> by{' '}
                  {defect.resolved_user?.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(defect.resolved_at)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefectDetail;
