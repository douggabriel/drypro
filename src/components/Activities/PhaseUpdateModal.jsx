import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Textarea from '../Shared/Textarea';
import Button from '../Shared/Button';
import { supabase } from '../../supabaseClient';
import useAuth from '../../hooks/useAuth';

/**
 * Phase Update Modal - Allows updating progress of individual phases
 */
const PhaseUpdateModal = ({ isOpen, onClose, phase, activityId, onUpdate }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    progress: phase?.progress || 0,
    status: phase?.status || 'pending',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  // Auto-set status based on progress
  const handleProgressChange = (value) => {
    let newStatus = 'pending';
    if (value > 0 && value < 100) {
      newStatus = 'in_progress';
    } else if (value === 100) {
      newStatus = 'completed';
    }

    setFormData({
      ...formData,
      progress: parseInt(value),
      status: newStatus,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    try {
      const updateData = {
        progress: formData.progress,
        status: formData.status,
      };

      // If marking as completed, set completion data
      if (formData.status === 'completed') {
        updateData.completed_by = currentUser.id;
        updateData.completed_at = new Date().toISOString();
      }

      const { error: phaseError } = await supabase
        .from('activity_phases')
        .update(updateData)
        .eq('id', phase.id);

      if (phaseError) throw phaseError;

      // Add note if provided
      if (formData.notes.trim()) {
        const { error: noteError } = await supabase
          .from('phase_notes')
          .insert([
            {
              phase_id: phase.id,
              note: formData.notes,
              created_by: currentUser.id,
            },
          ]);

        if (noteError) throw noteError;
      }

      // Success - callback to refresh parent
      if (onUpdate) onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating phase:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update ${phase?.phase_name}`}
      size="md"
    >
      <div className="space-y-6">
        {/* Current info */}
        <div className="p-4 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-800 font-medium">
            Phase {phase?.phase_order} of {phase?.phase_name}
          </p>
        </div>

        {/* Progress Slider */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Progress: {formData.progress}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={formData.progress}
            onChange={(e) => handleProgressChange(e.target.value)}
            className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Status Radio Buttons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Status
          </label>
          <div className="space-y-2">
            {['pending', 'in_progress', 'completed'].map((status) => (
              <label
                key={status}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  formData.status === status
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-5 h-5 text-blue-600"
                />
                <span className="font-medium text-gray-900 capitalize">
                  {status.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Add notes about this phase update..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          maxLength={500}
          showCount
        />

        {errors.submit && (
          <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="blue" onClick={handleSubmit} loading={loading}>
            Update Progress
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PhaseUpdateModal;
