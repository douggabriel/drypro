import React, { useState, useEffect } from 'react';
import { Plus, Building2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Button from '../Shared/Button';
import AddSiteModal from './AddSiteModal';
import { formatDate } from '../../utils/dateUtils';

const SitesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [sites, setSites] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading sites..." />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Sites & Projects</h1>
          <p className="text-gray-600 mt-1">Manage your construction sites</p>
        </div>
        <Button
          variant="purple"
          onClick={() => setShowAddModal(true)}
          icon={<Plus className="w-5 h-5" />}
        >
          Add Site
        </Button>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sites.map((site) => (
          <div
            key={site.id}
            className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {site.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  📍 {site.address}
                </p>
                {site.client && (
                  <p className="text-sm text-gray-600 mb-2">
                    Client: <span className="font-semibold">{site.client}</span>
                  </p>
                )}
                {site.start_date && (
                  <p className="text-sm text-gray-600">
                    Started: {formatDate(site.start_date)}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Site Modal */}
      {showAddModal && (
        <AddSiteModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
};

export default SitesScreen;
