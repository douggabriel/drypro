// Activity Types
export const ACTIVITY_TYPES = {
  NORMAL: 'normal',
  PATCH: 'patch',
};

// Activity Status
export const ACTIVITY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

// Phase Names for Normal Units
export const NORMAL_PHASES = [
  'Plasterboard Fixing',
  'Taping',
  'Second Coat',
  'Top Coat',
  'Sanding',
];

// Phase Names for Patches
export const PATCH_PHASES = [
  'Assessment',
  'Repair',
  'Finishing',
  'Final Inspection',
];

// Defect Phases
export const DEFECT_PHASES = [
  'Assessment',
  'Repair',
  'Finishing',
  'Inspection',
];

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

// Urgency Levels for Material Requests
export const URGENCY_LEVELS = {
  LOW: 'low',
  NORMAL: 'normal',
  URGENT: 'urgent',
};

// Material Categories
export const MATERIAL_CATEGORIES = [
  'Plasterboard',
  'Compound',
  'Tools',
  'Fasteners',
  'Tape',
  'Corner Bead',
  'Accessories',
  'Other',
];

// Material Units
export const MATERIAL_UNITS = [
  'Sheets',
  'Boxes',
  'Bags',
  'Rolls',
  'Units',
  'm²',
  'm³',
  'kg',
  'liters',
];

// Employee Roles
export const EMPLOYEE_ROLES = [
  'Plasterer',
  'Taper',
  'Finisher',
  'Sander',
  'General Laborer',
  'Project Manager',
  'Supervisor',
  'Other',
];

// User Roles
export const USER_ROLES = {
  SUPERVISOR: 'supervisor',
  TRADE: 'trade',
};

// Defect Categories
export const DEFECT_CATEGORIES = [
  'Crack',
  'Bubble',
  'Uneven surface',
  'Damage',
  'Other',
];

// Status Colors
export const STATUS_CONFIG = {
  pending: {
    color: '#6b7280',
    bgColor: '#f3f4f6',
    label: 'Pending',
    icon: '○',
  },
  in_progress: {
    color: '#3b82f6',
    bgColor: '#dbeafe',
    label: 'In Progress',
    icon: '◐',
  },
  completed: {
    color: '#22c55e',
    bgColor: '#dcfce7',
    label: 'Completed',
    icon: '✓',
  },
  open: {
    color: '#ef4444',
    bgColor: '#fee2e2',
    label: 'Open',
    icon: '!',
  },
  resolved: {
    color: '#22c55e',
    bgColor: '#dcfce7',
    label: 'Resolved',
    icon: '✓',
  },
};

// Priority Colors
export const PRIORITY_CONFIG = {
  low: {
    color: '#22c55e',
    bgColor: '#dcfce7',
    label: 'Low Priority',
    dotColor: '#22c55e',
  },
  medium: {
    color: '#f97316',
    bgColor: '#fed7aa',
    label: 'Medium Priority',
    dotColor: '#f97316',
  },
  high: {
    color: '#ef4444',
    bgColor: '#fee2e2',
    label: 'High Priority',
    dotColor: '#ef4444',
  },
};

// Urgency Colors
export const URGENCY_CONFIG = {
  low: {
    color: '#22c55e',
    bgColor: '#dcfce7',
    label: 'Low Priority',
    icon: '🟢',
  },
  normal: {
    color: '#3b82f6',
    bgColor: '#dbeafe',
    label: 'Normal Priority',
    icon: '🔵',
  },
  urgent: {
    color: '#ef4444',
    bgColor: '#fee2e2',
    label: 'Urgent Priority',
    icon: '🔴',
  },
};
