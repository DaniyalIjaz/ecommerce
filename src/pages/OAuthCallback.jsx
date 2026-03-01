import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const run = async () => {
      try {
        // In PKCE flows we need to exchange the code for a session.
        const url = window.location.href;
        if (supabase && url.includes('code=')) {
          await supabase.auth.exchangeCodeForSession(url);
        } else {
          await supabase?.auth.getSession();
        }
      } finally {
        navigate('/', { replace: true });
      }
    };
    run();
  }, [navigate]);

  return (
    <div className="py-16 flex justify-center">
      <div className="w-10 h-10 border-2 border-cream-300 border-t-terracotta-500 rounded-full animate-spin" />
    </div>
  );
};

export default OAuthCallback;

