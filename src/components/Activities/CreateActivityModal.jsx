import React, { useState, useEffect } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Textarea from '../Shared/Textarea';
import Button from '../Shared/Button';
import FileUpload from '../Shared/FileUpload';
import Badge from '../Shared/Badge';
import { supabase } from '../../supabaseClient';
import { NORMAL_PHASES, PATCH_PHASES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

/**
 * Create Activity Modal
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {string} props.activityType - 'normal' or 'patch'
 */
const CreateActivityModal = ({ isOpen, onClose, activityType = 'normal' }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    level: '',
    unit: '',
    assignedTo: '',
    description: '',
    photos: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadEmployees();
    }
  }, [isOpen]);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';
    if (!formData.assignedTo) newErrors.assignedTo = 'Please assign to an employee';
    if (activityType === 'patch' && !formData.description) {
      newErrors.description = 'Description is required for patches';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Create activity
      const { data: activity, error: activityError } = await supabase
        .from('activities')
        .insert([
          {
            type: activityType,
            level: formData.level,
            unit: formData.unit,
            description: formData.description,
            assigned_to: formData.assignedTo,
            created_by: currentUser.id,
            status: 'pending',
            overall_progress: 0,
          },
        ])
        .select()
        .single();

      if (activityError) throw activityError;

      // Create phases
      const phases = activityType === 'normal' ? NORMAL_PHASES : PATCH_PHASES;
      const phaseRecords = phases.map((phaseName, index) => ({
        activity_id: activity.id,
        phase_name: phaseName,
        phase_order: index + 1,
        progress: 0,
        status: 'pending',
      }));

      const { error: phasesError } = await supabase
        .from('activity_phases')
        .insert(phaseRecords);

      if (phasesError) throw phasesError;

      // Upload photos if any
      // (simplified - in production, upload to Supabase Storage)

      onClose();
      window.location.reload(); // Refresh to show new activity
    } catch (error) {
      console.error('Error creating activity:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={activityType === 'normal' ? 'Start New Unit' : 'Create Patch Work'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Type badge */}
        <div>
          <Badge
            type="custom"
            label={activityType === 'normal' ? 'UNIT WORK' : 'PATCH WORK'}
            color="#fff"
            bgColor={activityType === 'normal' ? '#f97316' : '#a855f7'}
            size="lg"
          />
        </div>

        {/* Level */}
        <Input
          label="Level"
          placeholder="Level 3"
          value={formData.level}
          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
          error={errors.level}
          required
        />

        {/* Unit */}
        <Input
          label="Unit"
          placeholder="Unit 302"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          error={errors.unit}
          required
        />

        {/* Assign To */}
        <Select
          label="Assign To"
          placeholder="Select employee..."
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          options={employees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} - ${emp.role}`,
          }))}
          error={errors.assignedTo}
          required
        />

        {/* Description (required for patches) */}
        <Textarea
          label="Description"
          placeholder={activityType === 'patch' ? 'Describe the repair needed...' : 'Optional notes...'}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          error={errors.description}
          required={activityType === 'patch'}
        />

        {/* Photos */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Location Photos
          </label>
          <FileUpload
            value={formData.photos}
            onChange={(files) => setFormData({ ...formData, photos: files })}
            multiple
            maxFiles={5}
          />
        </div>

        {/* Error message */}
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
          <Button onClick={handleSubmit} loading={loading}>
            {activityType === 'normal' ? 'Create Unit' : 'Create Patch'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateActivityModal;
