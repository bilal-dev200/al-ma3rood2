"use client";
import { listingsApi } from '@/lib/api/listings';
import React, { useState } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';


function MakeOfferModal({ isOpen, onClose, product, onOfferMade }) {
    const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [message, setMessage] = useState('');
  const [agreeToPayment, setAgreeToPayment] = useState(false);
  const { user } = useAuthStore();
  if (!isOpen) return null;

  // Count user's offers for this product
  const userOffers = (product.selling_offers || []).filter(
    offer => offer.user_id === user?.id
  );
  const offerCount = userOffers.length;
  const isLastAttempt = offerCount === 6;
  const isMaxedOut = offerCount >= 7;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Please enter a valid offer amount.');
      return;
    }
    const offerAmount = parseFloat(amount);
    const buyNowPrice = parseFloat(product?.buy_now || 0);
    if (buyNowPrice > 0 && offerAmount > buyNowPrice) {
      setError(`Your offer cannot exceed the Buy Now price ($${buyNowPrice}).`);
      toast.error(`Your offer cannot exceed the Buy Now price ($${buyNowPrice}).`);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('message', message);
      await listingsApi.makeOffer(product.id, formData);
      setSuccess('Offer sent!');
      setAmount('');
      toast.success('Offer sent!')
      if (onOfferMade) onOfferMade();
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 1200);
    } catch (err) {
      setError(err?.message || 'Failed to send offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 md:p-4">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 text-left">{t("Make an Offer")}</h2>
        {isLastAttempt && (
          <div className="mb-3 p-2 bg-yellow-100 text-yellow-800 rounded text-xs font-semibold">
            {("This is your last chance to make an offer for this listing. If this (7th) offer is not accepted, you will not be able to make any more offers for this listing.")}
          </div>
        )}
        {isMaxedOut && (
          <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-xs font-semibold">
            {t("You have reached the maximum of 7 offers for this listing. You cannot make any more offers.")}
          </div>
        )}
        <form onSubmit={handleSubmit} className="mb-6">
          <label className="block mb-2 font-medium text-gray-700 text-left">{t("Your offer")}</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 price">$</span>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={e => {
                const value = e.target.value;
                const numValue = parseFloat(value);
                if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
                  setAmount(value);
                  setError('');
                  const offerAmount = parseFloat(value);
                  const buyNowPrice = parseFloat(product?.buy_now || 0);
                  if (value && !isNaN(offerAmount) && buyNowPrice > 0 && offerAmount > buyNowPrice) {
                    setError(`Your offer cannot exceed the Buy Now price ($${buyNowPrice}).`);
                  }
                }
              }}
              onBlur={() => {
                const offerAmount = parseFloat(amount);
                const buyNowPrice = parseFloat(product?.buy_now || 0);
                if (amount && !isNaN(offerAmount) && buyNowPrice > 0 && offerAmount > buyNowPrice) {
                  setError(`Your offer cannot exceed the Buy Now price ($${buyNowPrice}).`);
                }
              }}
              placeholder="0.00"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition
[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              required
              disabled={loading || isMaxedOut}
            />
          </div>
          {error && <div className="text-red-500 text-xs mt-2 text-left pl-2">{error}</div>}
          {/* {success && <div className="text-green-600 text-xs mt-2">{success}</div>} */}
          <label className="block mb-2 font-medium text-gray-700 text-left mt-4">{t("Message (optional)")}</label>
          <textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder={t("Add a message to the seller (optional)")}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition min-h-[80px] resize-y"
            disabled={loading || isMaxedOut}
          />

          {/* Payment Method Note */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">{t("Payment Method Notice")}</p>
                <p className="text-blue-700">{t("Currently, the only available payment method is cash. Please ensure you can complete the transaction using cash before proceeding.")}</p>
              </div>
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="mt-4 flex items-start gap-3">
            <input
              type="checkbox"
              id="agreePayment"
              className="mt-1 accent-green-600 w-4 h-4 rounded"
              checked={agreeToPayment}
              onChange={(e) => setAgreeToPayment(e.target.checked)}
              disabled={loading || isMaxedOut}
            />
            <label htmlFor="agreePayment" className="text-sm text-gray-700 select-none">
              {t("I understand and agree that the only available payment method is cash, and I can complete this transaction using cash.")}
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition disabled:opacity-60"
              disabled={loading || isMaxedOut || !agreeToPayment}
            >
              {loading ? t('Sending...') : t('Send Offer')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg transition"
              disabled={loading}
            >
              {t("Cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MakeOfferModal; 