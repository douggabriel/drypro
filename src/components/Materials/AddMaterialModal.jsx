import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Textarea from '../Shared/Textarea';
import Button from '../Shared/Button';
import { supabase } from '../../supabaseClient';
import { MATERIAL_CATEGORIES, MATERIAL_UNITS } from '../../utils/constants';

const AddMaterialModal = ({ isOpen, onClose, material = null }) => {
  const isEdit = !!material;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: material?.name || '',
    category: material?.category || '',
    unit: material?.unit || '',
    sku: material?.sku || '',
    description: material?.description || '',
    status: material?.status || 'active',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Material name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const materialData = {
        name: formData.name,
        category: formData.category,
        unit: formData.unit,
        sku: formData.sku || null,
        description: formData.description || null,
        status: formData.status,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('materials')
          .update(materialData)
          .eq('id', material.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('materials')
          .insert([materialData]);

        if (error) throw error;
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving material:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Material' : 'Add New Material'}
      size="md"
    >
      <div className="space-y-6">
        {/* Material Name */}
        <Input
          label="Material Name"
          placeholder="e.g., 13mm Water-Resistant Plasterboard"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        {/* Category */}
        <Select
          label="Category"
          placeholder="Select category..."
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          options={MATERIAL_CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
          error={errors.category}
          required
        />

        {/* Unit */}
        <Select
          label="Unit Type"
          placeholder="Select unit..."
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          options={MATERIAL_UNITS.map((unit) => ({ value: unit, label: unit }))}
          error={errors.unit}
          required
        />

        {/* SKU */}
        <Input
          label="SKU/Code"
          placeholder="Product code (optional)"
          value={formData.sku}
          onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Additional details..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-900">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-4 h-4 text-blue-600"
              />
              <span className="text-gray-900">Inactive</span>
            </label>
          </div>
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
          <Button onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Update Material' : 'Add Material'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMaterialModal;
