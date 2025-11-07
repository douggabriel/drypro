import React, { useState } from 'react';
import Modal from '../Shared/Modal';
import Input from '../Shared/Input';
import Select from '../Shared/Select';
import Button from '../Shared/Button';
import { supabase } from '../../supabaseClient';
import { EMPLOYEE_ROLES } from '../../utils/constants';

const AddEmployeeModal = ({ isOpen, onClose, employee = null }) => {
  const isEdit = !!employee;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: employee?.name || '',
    role: employee?.role || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    startDate: employee?.start_date || '',
    status: employee?.status || 'active',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const employeeData = {
        name: formData.name,
        role: formData.role,
        email: formData.email,
        phone: formData.phone || null,
        start_date: formData.startDate || null,
        status: formData.status,
      };

      if (isEdit) {
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employee.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('employees')
          .insert([employeeData]);

        if (error) throw error;
      }

      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error saving employee:', error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Employee' : 'Add Team Member'}
      size="md"
    >
      <div className="space-y-6">
        {/* Name */}
        <Input
          label="Full Name"
          placeholder="John Smith"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          error={errors.name}
          required
        />

        {/* Role */}
        <Select
          label="Role"
          placeholder="Select role..."
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={EMPLOYEE_ROLES.map((role) => ({ value: role, label: role }))}
          error={errors.role}
          required
        />

        {/* Email */}
        <Input
          type="email"
          label="Email"
          placeholder="john@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          required
        />

        {/* Phone */}
        <Input
          type="tel"
          label="Phone"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />

        {/* Start Date */}
        <Input
          type="date"
          label="Start Date"
          value={formData.startDate}
          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
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
          <Button variant="blue" onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Update Employee' : 'Add Employee'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddEmployeeModal;
