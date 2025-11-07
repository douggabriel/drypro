import React, { useState } from 'react';
import { Plus, Wrench, Package } from 'lucide-react';
import Button from '../Shared/Button';
import CreateActivityModal from '../Activities/CreateActivityModal';
import RequestMaterialModal from '../Materials/RequestMaterialModal';

/**
 * Quick actions component for dashboard
 * @param {Object} props
 * @param {boolean} props.isSupervisor - Is user a supervisor
 */
const QuickActions = ({ isSupervisor }) => {
  const [showCreateUnit, setShowCreateUnit] = useState(false);
  const [showCreatePatch, setShowCreatePatch] = useState(false);
  const [showRequestMaterial, setShowRequestMaterial] = useState(false);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* START UNIT - Supervisor only */}
        {isSupervisor && (
          <Button
            onClick={() => setShowCreateUnit(true)}
            variant="primary"
            size="lg"
            className="h-24"
            icon={<Plus className="w-6 h-6" />}
          >
            START UNIT
          </Button>
        )}

        {/* CREATE PATCH - Supervisor only */}
        {isSupervisor && (
          <Button
            onClick={() => setShowCreatePatch(true)}
            variant="purple"
            size="lg"
            className="h-24"
            icon={<Wrench className="w-6 h-6" />}
          >
            CREATE PATCH
          </Button>
        )}

        {/* REQUEST MATERIAL - All users */}
        <Button
          onClick={() => setShowRequestMaterial(true)}
          variant="blue"
          size="lg"
          className={`h-24 ${!isSupervisor ? 'md:col-span-2 lg:col-span-3' : ''}`}
          icon={<Package className="w-6 h-6" />}
        >
          REQUEST MATERIAL
        </Button>
      </div>

      {/* Modals */}
      {showCreateUnit && (
        <CreateActivityModal
          isOpen={showCreateUnit}
          onClose={() => setShowCreateUnit(false)}
          activityType="normal"
        />
      )}

      {showCreatePatch && (
        <CreateActivityModal
          isOpen={showCreatePatch}
          onClose={() => setShowCreatePatch(false)}
          activityType="patch"
        />
      )}

      {showRequestMaterial && (
        <RequestMaterialModal
          isOpen={showRequestMaterial}
          onClose={() => setShowRequestMaterial(false)}
        />
      )}
    </div>
  );
};

export default QuickActions;
