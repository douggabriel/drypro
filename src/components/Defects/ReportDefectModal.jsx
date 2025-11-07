import React, { useState, useEffect } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Textarea from '../Shared/Textarea';
import Button from '../Shared/Button';
import FileUpload from '../Shared/FileUpload';
import VoiceRecorder from '../Shared/VoiceRecorder';
import { Mic, Camera } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { DEFECT_CATEGORIES, PRIORITY_CONFIG, DEFECT_PHASES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

const ReportDefectModal = ({ isOpen, onClose, activityId = null, prefilledLocation = null }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    level: prefilledLocation?.level || '',
    unit: prefilledLocation?.unit || '',
    priority: 'medium',
    description: '',
    category: '',
    assignedTo: '',
    photos: [],
    voiceNote: null,
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
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    if (formData.photos.length === 0) {
      newErrors.photos = 'At least one photo is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      // Create defect
      const { data: defect, error: defectError } = await supabase
        .from('defects')
        .insert([
          {
            priority: formData.priority,
            level: formData.level,
            unit: formData.unit,
            description: formData.description,
            category: formData.category || null,
            activity_id: activityId,
            assigned_to: formData.assignedTo || null,
            reported_by: currentUser.id,
            status: 'open',
          },
        ])
        .select()
        .single();

      if (defectError) throw defectError;

      // Create defect phases
      const phaseRecords = DEFECT_PHASES.map((phaseName, index) => ({
        defect_id: defect.id,
        phase_name: phaseName,
        phase_order: index + 1,
        progress: 0,
        status: 'pending',
      }));

      const { error: phasesError } = await supabase
        .from('defect_phases')
        .insert(phaseRecords);

      if (phasesError) throw phasesError;

      // Upload photos (simplified - in production, upload to Supabase Storage)
      // For now, we'll skip actual photo upload

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating defect:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report Defect" size="lg">
      <div className="space-y-6">
        {/* Location */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Level"
            placeholder="Level 3"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            error={errors.level}
            required
          />

          <Input
            label="Unit"
            placeholder="Unit 302"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            error={errors.unit}
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Priority <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, priority: key })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.priority === key
                    ? 'border-current shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  color: formData.priority === key ? config.color : '#6b7280',
                  backgroundColor: formData.priority === key ? config.bgColor : 'transparent',
                }}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: config.dotColor }}
                  />
                  <span className="font-semibold text-sm">{config.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Describe the defect in detail..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          error={errors.description}
          required
          maxLength={500}
          showCount
        />

        {/* Category */}
        <Select
          label="Category"
          placeholder="Select category (optional)"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={DEFECT_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
        />

        {/* Assign To */}
        <Select
          label="Assign To"
          placeholder="Select employee (optional)"
          value={formData.assignedTo}
          onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
          options={employees.map((emp) => ({
            value: emp.id,
            label: `${emp.name} - ${emp.role}`,
          }))}
        />

        {/* Photos - Enhanced with visual header */}
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900">
                Defect Photos <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600">Required - Upload at least 1 photo (max 10)</p>
            </div>
          </div>
          <FileUpload
            value={formData.photos}
            onChange={(files) => setFormData({ ...formData, photos: files })}
            multiple
            maxFiles={10}
          />
          {errors.photos && (
            <p className="mt-2 text-sm text-red-600 font-semibold">{errors.photos}</p>
          )}
        </div>

        {/* Voice Note - NEW */}
        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <label className="block text-lg font-bold text-gray-900">
                Voice Note (Optional)
              </label>
              <p className="text-sm text-gray-600">Record audio description of the defect</p>
            </div>
          </div>
          <VoiceRecorder
            onSave={(audioBlob, duration) => {
              setFormData({ ...formData, voiceNote: { blob: audioBlob, duration } });
            }}
            maxDuration={180}
          />
        </div>

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
          <Button variant="danger" onClick={handleSubmit} loading={loading}>
            Report Defect
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ReportDefectModal;
