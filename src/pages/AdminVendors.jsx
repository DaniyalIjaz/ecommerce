import React, { useEffect, useState } from 'react';
import { listVendorsByStatus, updateVendorStatus } from '../services/supabase/profiles';

const AdminVendors = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listVendorsByStatus('pending');
      setPending(data);
    } catch (e) {
      console.error('Failed to load vendors', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (vendorId, status) => {
    try {
      await updateVendorStatus(vendorId, status);
      await load();
    } catch (e) {
      console.error('Failed to update vendor', e);
    }
  };

  return (
    <div className="py-10 border-t border-cream-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-2">Vendor Approvals</h1>
        <p className="text-sm text-stone-600 mb-6">
          Review vendor applications and approve or reject them.
        </p>
        {loading ? (
          <div className="py-8 text-center text-sm text-stone-500">Loading vendors...</div>
        ) : pending.length === 0 ? (
          <div className="py-8 text-center text-sm text-stone-500">No pending vendors.</div>
        ) : (
          <div className="space-y-3">
            {pending.map((v) => (
              <div
                key={v.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-cream-200 rounded-xl px-4 py-3 bg-cream-50"
              >
                <div>
                  <p className="font-medium text-stone-900">{v.shop_name}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{v.location}</p>
                  <p className="text-xs text-stone-500 mt-0.5 line-clamp-2">{v.bio}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAction(v.id, 'approved')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 text-xs text-white hover:bg-emerald-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(v.id, 'rejected')}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-xs text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVendors;

