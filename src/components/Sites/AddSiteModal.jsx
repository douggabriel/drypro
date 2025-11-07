import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Textarea from '../Shared/Textarea';
import Button from '../Shared/Button';
import { supabase } from '../../supabaseClient';

const AddSiteModal = ({ isOpen, onClose, site = null }) => {
  const isEdit = !!site;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: site?.name || '',
    address: site?.address || '',
    client: site?.client || '',
    startDate: site?.start_date || '',
    expectedCompletion: site?.expected_completion || '',
    totalUnits: site?.total_units || '',
    notes: site?.notes || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Site name is required';
    if (!formData.address) newErrors.address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const siteData = {
        name: formData.name,
        address: formData.address,
        client: formData.client || null,
        start_date: formData.startDate || null,
        expected_completion: formData.expectedCompletion || null,
        total_units: formData.totalUnits ? parseInt(formData.totalUnits) : null,
        notes: formData.notes || null,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('sites')
          .update(siteData)
          .eq('id', site.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('sites')
          .insert([siteData]);

        if (error) throw error;
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving site:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Site' : 'Add New Site'}
      size="lg"
    >
      <div className="space-y-6">
        {/* Site Name */}
        <Input
          label="Site Name"
          placeholder="Parkside Tower"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        {/* Address */}
        <Input
          label="Address"
          placeholder="123 Park Street, Perth"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          error={errors.address}
          required
        />

        {/* Client */}
        <Input
          label="Client/Builder"
          placeholder="ABC Builders Ltd"
          value={formData.client}
          onChange={(e) => setFormData({ ...formData, client: e.target.value })}
        />

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />

          <Input
            type="date"
            label="Expected Completion"
            value={formData.expectedCompletion}
            onChange={(e) => setFormData({ ...formData, expectedCompletion: e.target.value })}
          />
        </div>

        {/* Total Units */}
        <Input
          type="number"
          label="Total Units"
          placeholder="50"
          value={formData.totalUnits}
          onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })}
          min="1"
        />

        {/* Notes */}
        <Textarea
          label="Notes"
          placeholder="Project details..."
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
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
          <Button variant="purple" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Update Site' : 'Add Site'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddSiteModal;
