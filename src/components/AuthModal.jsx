import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { ShopContext } from '../context/ShopContext';
import LoginPanel from './LoginPanel';

const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen } = useContext(ShopContext);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const closeAll = () => {
    setConfirmOpen(false);
    setAuthModalOpen(false);
  };

  const handleMainClose = () => {
    setConfirmOpen(true);
  };

  const handleContinue = () => {
    setConfirmOpen(false);
  };

  const goToVendorRegister = () => {
    closeAll();
    navigate('/vendor/register');
  };

  return (
    <>
      <Modal
        isOpen={authModalOpen}
        onClose={handleMainClose}
        title="Sign In / Register"
        size="sm"
      >
        <LoginPanel
          onSuccess={closeAll}
          showVendorLink
          onVendorRegister={goToVendorRegister}
        />
      </Modal>

      <Modal
        isOpen={confirmOpen}
        onClose={closeAll}
        title="Are you sure you want to leave now?"
        size="sm"
      >
        <div className="space-y-4 text-sm text-stone-700">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-cream-200 rounded-xl p-3">
              <p className="font-semibold text-stone-900">Free shipping</p>
              <p className="text-xs text-stone-500 mt-0.5">On all orders</p>
            </div>
            <div className="bg-white border border-cream-200 rounded-xl p-3">
              <p className="font-semibold text-stone-900">Free returns</p>
              <p className="text-xs text-stone-500 mt-0.5">Up to 90 days</p>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={closeAll}
              className="px-3 py-1.5 rounded-lg text-sm border border-cream-300 text-stone-600 hover:bg-cream-100"
            >
              Leave
            </button>
            <button
              onClick={handleContinue}
              className="px-3 py-1.5 rounded-lg text-sm bg-terracotta-500 text-white hover:bg-terracotta-600"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AuthModal;

