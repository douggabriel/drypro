import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList,
  Clock,
  CheckCircle,
  Wrench,
  AlertTriangle,
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import StatsCard from './StatsCard';
import QuickActions from './QuickActions';
import MaterialRequestsCard from '../Materials/MaterialRequestsCard';
import LoadingSpinner from '../Shared/LoadingSpinner';
import { supabase } from '../../supabaseClient';

const DashboardScreen = () => {
  const navigate = useNavigate();
  const { currentUser, isSupervisor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    patches: 0,
    openDefects: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load activities stats
      const { data: activities, error: activitiesError } = await supabase
        .from('activities')
        .select('*');

      if (activitiesError) throw activitiesError;

      // Calculate stats
      const stats = {
        total: activities?.length || 0,
        inProgress: activities?.filter(a => a.overall_progress > 0 && a.overall_progress < 100).length || 0,
        completed: activities?.filter(a => a.overall_progress === 100).length || 0,
        patches: activities?.filter(a => a.type === 'patch').length || 0,
      };

      // Load defects
      const { data: defects, error: defectsError } = await supabase
        .from('defects')
        .select('*')
        .neq('status', 'resolved');

      if (defectsError) throw defectsError;

      stats.openDefects = defects?.length || 0;

      setStats(stats);
      setRecentActivities(activities?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome back, {currentUser?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Quick Actions */}
      <QuickActions isSupervisor={isSupervisor} />

      {/* Material Requests Card - Supervisor only */}
      {isSupervisor && <MaterialRequestsCard />}

      {/* Stats Grid */}
      {isSupervisor && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Units"
              value={stats.total}
              icon={<ClipboardList className="w-6 h-6" />}
              gradient="bg-gradient-to-br from-orange-400 to-orange-600"
            />
            <StatsCard
              title="In Progress"
              value={stats.inProgress}
              icon={<Clock className="w-6 h-6" />}
              gradient="bg-gradient-to-br from-blue-400 to-blue-600"
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={<CheckCircle className="w-6 h-6" />}
              gradient="bg-gradient-to-br from-green-400 to-green-600"
            />
            <StatsCard
              title="Patches"
              value={stats.patches}
              icon={<Wrench className="w-6 h-6" />}
              gradient="bg-gradient-to-br from-purple-400 to-purple-600"
            />
          </div>
        </div>
      )}

      {/* Open Defects Card */}
      {stats.openDefects > 0 && (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-bold">OPEN DEFECTS</h3>
            </div>
            <span className="bg-white text-red-600 px-3 py-1 rounded-full font-bold">
              {stats.openDefects}
            </span>
          </div>
          <div className="p-6">
            <p className="text-gray-600">
              There are {stats.openDefects} open defect{stats.openDefects > 1 ? 's' : ''} that need attention.
            </p>
            <button
              onClick={() => navigate('/defects')}
              className="inline-block mt-4 text-red-600 font-semibold hover:underline"
            >
              View all defects →
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        {recentActivities.length > 0 ? (
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                  {activity.type === 'normal' ? 'U' : 'P'}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">
                    {activity.level} - {activity.unit}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.type === 'normal' ? 'Unit Work' : 'Patch Work'} • {activity.overall_progress}% complete
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/activities/${activity.id}`)}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No recent activities. Start by creating a new unit!
          </p>
        )}
      </div>
    </div>
  );
};

export default DashboardScreen;
