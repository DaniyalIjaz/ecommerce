import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import { createSupportQuery } from '../services/supabase/support';
import { fetchUserSupportQueries } from '../services/supabase/support';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { MessageSquare, Send } from 'lucide-react';

const Support = () => {
  const { user, setAuthModalOpen } = useContext(ShopContext);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    if (user) {
      fetchUserSupportQueries(user.id).then(setQueries).catch(() => setQueries([]));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill subject and message');
      return;
    }
    setLoading(true);
    try {
      await createSupportQuery({
        userId: user.id,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success('Query submitted! We will reply soon.');
      setSubject('');
      setMessage('');
      fetchUserSupportQueries(user.id).then(setQueries).catch(() => setQueries([]));
    } catch (err) {
      toast.error(err.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="py-10 border-t border-cream-200"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-3">Help &amp; Support</h1>
        <p className="text-sm text-stone-600 mb-8">
          Need help? Ask your question below and our team will reply.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-sm border border-cream-200 rounded-2xl p-6 shadow-lg mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-terracotta-500" />
            Submit a Query
          </h2>
          {!user ? (
            <p className="text-sm text-stone-600 mb-4">
              Please{' '}
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="text-terracotta-600 font-medium hover:underline"
              >
                sign in
              </button>{' '}
              to submit a query.
            </p>
          ) : (
            <>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Subject *"
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white mb-4 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 outline-none"
                required
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question *"
                rows={5}
                className="w-full px-4 py-3 rounded-xl border border-cream-300 bg-white mb-4 focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 outline-none resize-none"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 text-cream-100 font-medium hover:bg-stone-800 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {loading ? 'Sending...' : 'Submit'}
              </button>
            </>
          )}
        </form>

        {user && queries.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Queries</h2>
            {queries.map((q) => (
              <div
                key={q.id}
                className="bg-white/80 backdrop-blur-sm border border-cream-200 rounded-2xl p-4"
              >
                <p className="font-medium text-stone-900">{q.subject}</p>
                <p className="text-sm text-stone-600 mt-1">{q.message}</p>
                <p className="text-xs text-stone-400 mt-2">
                  {new Date(q.created_at).toLocaleString()} • {q.status}
                </p>
                {q.admin_reply && (
                  <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-sm font-medium text-emerald-800">Admin reply:</p>
                    <p className="text-sm text-emerald-700 mt-1">{q.admin_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/60 backdrop-blur-sm border border-cream-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-2">Order &amp; Delivery</h2>
            <ul className="text-sm text-stone-600 space-y-1">
              <li>Track your orders from the Orders page.</li>
              <li>Standard delivery with free shipping on all orders.</li>
              <li>Need to change address? Contact support before dispatch.</li>
            </ul>
          </div>
          <div className="bg-white/60 backdrop-blur-sm border border-cream-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold mb-2">Returns &amp; Refunds</h2>
            <ul className="text-sm text-stone-600 space-y-1">
              <li>Free returns for up to 90 days.</li>
              <li>Items must be unused and in original packaging.</li>
              <li>Refunds are processed back to your original method.</li>
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Support;
