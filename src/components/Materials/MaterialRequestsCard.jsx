import React, { useState, useEffect } from 'react';
import { Package, Check, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { URGENCY_CONFIG } from '../../utils/constants';
import { formatDate } from '../../utils/dateUtils';
import useAuth from '../../hooks/useAuth';
import Button from '../Shared/Button';

const MaterialRequestsCard = () => {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('material_requests')
        .select('*, user_profiles!material_requests_requested_by_fkey(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const { error } = await supabase
        .from('material_requests')
        .update({
          status: 'approved',
          approved_by: currentUser.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Refresh list
      loadPendingRequests();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const { error } = await supabase
        .from('material_requests')
        .update({
          status: 'rejected',
          approved_by: currentUser.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (error) throw error;

      // Refresh list
      loadPendingRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading || requests.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6" />
          <h3 className="text-lg font-bold">MATERIAL REQUESTS</h3>
        </div>
        <span className="bg-white text-blue-600 px-3 py-1 rounded-full font-bold">
          {requests.length}
        </span>
      </div>

      {/* Body */}
      <div className="divide-y divide-gray-200">
        {requests.map((request) => (
          <div
            key={request.id}
            className="px-6 py-4 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              {/* Urgency indicator */}
              <div
                className="w-2 h-12 rounded-full flex-shrink-0"
                style={{ backgroundColor: URGENCY_CONFIG[request.urgency].dotColor }}
              />

              {/* Request info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 mb-1">
                  {request.material_name}
                </p>
                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">
                    {request.quantity} {request.unit}
                  </span>
                  {' • '}
                  {request.level}, {request.unit_location}
                </p>
                <p className="text-xs text-gray-500">
                  Requested by {request.user_profiles?.name} • {formatDate(request.created_at)}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  variant="green"
                  size="sm"
                  onClick={() => handleApprove(request.id)}
                  icon={<Check className="w-4 h-4" />}
                >
                  Approve
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(request.id)}
                  icon={<X className="w-4 h-4" />}
                >
                  Reject
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialRequestsCard;
