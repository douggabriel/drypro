import React from 'react';

/**
 * Stats card component for dashboard
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {number} props.value - Stat value
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.gradient - Gradient class
 * @param {string} props.subtitle - Optional subtitle
 */
const StatsCard = ({ title, value, icon, gradient, subtitle }) => {
  return (
    <div
      className={`rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow ${gradient}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center text-white">
          {icon}
        </div>
      </div>
      <div className="text-white">
        <p className="text-4xl font-extrabold mb-1">{value}</p>
        <p className="text-lg font-semibold opacity-90">{title}</p>
        {subtitle && (
          <p className="text-sm opacity-75 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
