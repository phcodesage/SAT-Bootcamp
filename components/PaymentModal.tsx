'use client';

import { useState } from 'react';
import { X, CreditCard, Banknote, Send, CheckCircle2, ArrowLeft } from 'lucide-react';
import type { RegistrationData } from './RegistrationModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called when the user clicks "← Back" on the payment choice screen */
  onBack?: () => void;
  courseName: string;
  cashPrice: string;
  cardPrice: string;
  stripeLink: string;
  registration?: RegistrationData;
}

export function calcCardPrice(priceStr: string): string {
  const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return priceStr;
  return '$' + (num * 1.04).toFixed(2);
}

export default function PaymentModal({
  isOpen,
  onClose,
  onBack,
  courseName,
  cashPrice,
  cardPrice,
  stripeLink,
  registration,
}: PaymentModalProps) {
  const [step, setStep] = useState<'choose' | 'zelle' | 'done'>('choose');
  const [form, setForm] = useState({ name: '', phone: '', reference: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function handleClose() {
    setStep('choose');
    setForm({ name: '', phone: '', reference: '' });
    setLoading(false);
    onClose();
  }

  function handleBack() {
    setStep('choose');
    setForm({ name: '', phone: '', reference: '' });
    setLoading(false);
    onBack?.();
  }

  function handleCardPay() {
    // Update the record to card payment before redirecting
    if (registration?.registrationId) {
      fetch(`/api/registrations/${registration.registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'card', status: 'pending' }),
      }).catch(() => {});
    }
    window.open(stripeLink, '_blank', 'noopener,noreferrer');
    handleClose();
  }

  async function handleZelleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (registration?.registrationId) {
        // PATCH the existing record with Zelle details
        await fetch(`/api/registrations/${registration.registrationId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethod: 'zelle',
            zelleReference: form.reference,
            status: 'pending',
          }),
        });
      } else {
        // Fallback: create a new record if somehow no id exists
        await fetch('/api/registrations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: registration?.studentName ?? form.name,
            email: registration?.email ?? '',
            phone: registration?.phone ?? form.phone,
            subject: registration?.subject ?? 'Both',
            courseName,
            paymentMethod: 'zelle',
            zelleReference: form.reference,
          }),
        });
      }
    } catch {
      // non-blocking — still show success
    }
    setLoading(false);
    setStep('done');
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease' }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 flex items-center justify-between border-b bg-[#0e1f3e]">
          <div className="flex items-center gap-3">
            {step === 'choose' && onBack && (
              <button
                onClick={handleBack}
                className="text-white/70 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">
                Step 3 of 3 — Payment
              </p>
              <h2 className="text-lg font-bold text-white mt-0.5">{courseName}</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student info banner */}
        {registration && (
          <div className="bg-blue-50 border-b border-blue-100 px-6 py-2.5 text-[13px] text-blue-700">
            <span className="font-bold">Student:</span> {registration.studentName}
            {' · '}
            <span className="font-bold">Subject:</span> {registration.subject}
          </div>
        )}

        {/* Price Note Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex flex-col gap-1">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-amber-800">
            <Banknote className="w-4 h-4 shrink-0" />
            Cash (Zelle): <span className="text-green-700">{cashPrice}</span>
            <span className="text-amber-600 font-normal">— no extra fee</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] font-semibold text-amber-800">
            <CreditCard className="w-4 h-4 shrink-0" />
            Card: <span className="text-[#ca3433]">{cardPrice}</span>
            <span className="text-amber-600 font-normal">— includes 4% processing fee</span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* STEP: Choose */}
          {step === 'choose' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                Choose your preferred payment method below.
              </p>
              {/* Cash / Zelle */}
              <button
                onClick={() => setStep('zelle')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-green-200 bg-green-50 hover:border-green-400 hover:bg-green-100 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-green-600 flex items-center justify-center shrink-0">
                  <Banknote className="w-6 h-6 text-white" />
                </div>
                <div className="text-left text-gray-900">
                  <p className="font-bold">Pay with Cash (Zelle)</p>
                  <p className="text-[13px] text-gray-600">
                    Send <strong className="text-green-700">{cashPrice}</strong> to{" "}
                    <span className="text-green-700 font-semibold text-[12px]">payments@exceedlearningcenterny.com</span>
                  </p>
                </div>
              </button>

              {/* Card */}
              <button
                onClick={handleCardPay}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-blue-200 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#0e1f3e] flex items-center justify-center shrink-0">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div className="text-left text-gray-900">
                  <p className="font-bold">Pay by Card (Stripe)</p>
                  <p className="text-[13px] text-gray-600">
                    <strong className="text-[#ca3433]">{cardPrice}</strong>{" "}
                    <span className="text-gray-400">(includes 4% processing fee)</span>
                  </p>
                </div>
              </button>

              {onBack && (
                <button
                  onClick={handleBack}
                  className="w-full mt-2 py-3 rounded-xl border border-gray-200 text-[13px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back — Edit my details
                </button>
              )}
            </div>
          )}

          {/* STEP: Zelle form */}
          {step === 'zelle' && (
            <div>
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl text-[13px] text-green-800">
                <p className="font-bold mb-1">How to pay via Zelle:</p>
                <ol className="list-decimal list-inside space-y-1 text-green-700">
                  <li>Open your banking app and go to Zelle</li>
                  <li>
                    Send <strong>{cashPrice}</strong> to{" "}
                    <strong>payments@exceedlearningcenterny.com</strong>
                  </li>
                  <li>Note your Zelle reference/confirmation number</li>
                  <li>Fill in the form below to confirm your enrollment</li>
                </ol>
              </div>

              <form onSubmit={handleZelleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0e1f3e] uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#0e1f3e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0e1f3e] uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="(555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#0e1f3e]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#0e1f3e] uppercase tracking-wider">
                    Zelle Reference / Confirmation Number *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))}
                    placeholder="e.g. ZL123456789"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all text-[#0e1f3e]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('choose')}
                    className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    disabled={loading}
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-green-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    {loading ? 'Submitting...' : 'Confirm Zelle Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP: Done */}
          {step === 'done' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Enrollment Submitted!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Thank you, <strong>{registration?.studentName ?? form.name}</strong>! We have received your Zelle payment
                confirmation. Our team will verify your payment and send you enrollment details
                shortly.
              </p>
              <button
                onClick={handleClose}
                className="px-6 py-3 rounded-xl bg-[#0e1f3e] text-white font-bold text-sm hover:bg-[#0e1f3e]/90 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
