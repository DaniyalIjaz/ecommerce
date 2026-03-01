import React from 'react';
import { Link } from 'react-router-dom';

const SupabaseBanner = () => (
  <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-4 mb-8 text-sm text-amber-900">
    <p className="font-medium">Connect to Supabase to load products</p>
    <p className="mt-1 text-amber-800">
      Add your Supabase URL and anon key to <code className="bg-amber-100/60 px-1.5 py-0.5 rounded">.env</code> and run the schema + seed SQL. See <code className="bg-amber-100/60 px-1.5 py-0.5 rounded">SUPABASE_SETUP.md</code> for instructions.
    </p>
  </div>
);

export default SupabaseBanner;
