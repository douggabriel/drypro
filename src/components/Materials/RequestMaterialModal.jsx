import React, { useState, useEffect } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Textarea from '../Shared/Textarea';
import Button from '../Shared/Button';
import { supabase } from '../../supabaseClient';
import { MATERIAL_UNITS, URGENCY_CONFIG } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

const RequestMaterialModal = ({ isOpen, onClose }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [formData, setFormData] = useState({
    material: '',
    quantity: '',
    unit: 'Sheets',
    level: '',
    unitLocation: '',
    urgency: 'normal',
    notes: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      loadMaterials();
    }
  }, [isOpen]);

  const loadMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setMaterials(data || []);
    } catch (error) {
      console.error('Error loading materials:', error);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.material) newErrors.material = 'Material is required';
    if (!formData.quantity || formData.quantity < 1) newErrors.quantity = 'Valid quantity required';
    if (!formData.level) newErrors.level = 'Level is required';
    if (!formData.unitLocation) newErrors.unitLocation = 'Unit is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const selectedMaterial = materials.find(m => m.id === formData.material);

      const { error } = await supabase
        .from('material_requests')
        .insert([
          {
            material_name: selectedMaterial.name,
            quantity: parseInt(formData.quantity),
            unit: formData.unit,
            level: formData.level,
            unit_location: formData.unitLocation,
            urgency: formData.urgency,
            notes: formData.notes,
            requested_by: currentUser.id,
            status: 'pending',
          },
        ]);

      if (error) throw error;

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error creating request:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Request Material" size="lg">
      <div className="space-y-6">
        {/* Material Selection */}
        <Select
          label="Material"
          placeholder="Select material..."
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          options={materials.map((m) => ({
            value: m.id,
            label: `${m.name} (${m.category})`,
          }))}
          error={errors.material}
          required
        />

        {/* Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Quantity"
            placeholder="20"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            error={errors.quantity}
            required
            min="1"
          />

          <Select
            label="Unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={MATERIAL_UNITS.map((unit) => ({ value: unit, label: unit }))}
            required
          />
        </div>

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
            value={formData.unitLocation}
            onChange={(e) => setFormData({ ...formData, unitLocation: e.target.value })}
            error={errors.unitLocation}
            required
          />
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Urgency Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(URGENCY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={() => setFormData({ ...formData, urgency: key })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.urgency === key
                    ? 'border-current shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{
                  color: formData.urgency === key ? config.color : '#6b7280',
                  backgroundColor: formData.urgency === key ? config.bgColor : 'transparent',
                }}
              >
                <div className="text-2xl mb-2">{config.icon}</div>
                <div className="font-semibold text-sm">{config.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Any additional information..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          maxLength={300}
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
            Submit Request
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RequestMaterialModal;
