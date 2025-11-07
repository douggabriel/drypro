import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Button from '../Shared/Button';
import Avatar from '../Shared/Avatar';
import Badge from '../Shared/Badge';

const EmployeesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading employees..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">Manage your workforce</p>
        </div>
        <Button icon={<Plus className="w-5 h-5" />}>
          Add Employee
        </Button>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <Avatar name={employee.name} src={employee.avatar_url} size="lg" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 mb-1 truncate">
                  {employee.name}
                </h3>
                <Badge
                  type="custom"
                  label={employee.role}
                  color="#3b82f6"
                  bgColor="#dbeafe"
                  size="sm"
                />
                <div className="mt-3 space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    📧 {employee.email}
                  </p>
                  {employee.phone && (
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      📱 {employee.phone}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeesScreen;
