'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
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
  isOpen, onClose, onBack,
  courseName, cashPrice, cardPrice, stripeLink, registration,
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

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    fontSize: '14px', outline: 'none', color: '#0e1f3e', boxSizing: 'border-box',
  };

  // Progress: step 3 of 3 on choose/zelle, done on completion
  const progressWidth = step === 'done' ? '100%' : '100%';

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={handleClose}
    >
      <div
        style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 25px 80px rgba(0,0,0,0.25)', width: '100%', maxWidth: '460px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: '#0e1f3e', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Back button — only on the choose step, and only if onBack is provided */}
            {step === 'choose' && onBack && (
              <button
                onClick={handleBack}
                style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                aria-label="Back to registration form"
              >
                <ArrowLeft size={16} />
              </button>
            )}
            <div>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
                Step 3 of 3 — Payment
              </p>
              <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '4px 0 0 0' }}>{courseName}</h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Progress bar — full at payment step */}
        <div style={{ background: '#e2e8f0', height: 4 }}>
          <div style={{ background: '#ca3433', height: 4, width: progressWidth, transition: 'width 0.3s ease' }} />
        </div>

        {/* Student info banner */}
        {registration && (
          <div style={{ background: '#f0f9ff', borderBottom: '1px solid #bae6fd', padding: '10px 24px', fontSize: 13, color: '#0369a1' }}>
            <span style={{ fontWeight: 700 }}>Student:</span> {registration.studentName}
            {' · '}
            <span style={{ fontWeight: 700 }}>Subject:</span> {registration.subject}
            {' · '}
            <span style={{ fontWeight: 700 }}>Email:</span> {registration.email}
          </div>
        )}

        {/* Price banner */}
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a', padding: '12px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5, fontSize: 13, fontWeight: 600, color: '#92400e', flexWrap: 'wrap' }}>
            <span>💵 Cash (Zelle):</span>
            <span style={{ color: '#15803d', fontWeight: 700 }}>{cashPrice}</span>
            <span style={{ color: '#b45309', fontWeight: 400 }}>— no extra fee</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: '#92400e', flexWrap: 'wrap' }}>
            <span>💳 Card:</span>
            <span style={{ color: '#ca3433', fontWeight: 700 }}>{cardPrice}</span>
            <span style={{ color: '#b45309', fontWeight: 400 }}>— includes 4% processing fee</span>
          </div>
        </div>

        <div style={{ padding: '24px', overflowY: 'auto' }}>

          {/* ── CHOOSE STEP ── */}
          {step === 'choose' && (
            <div>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 16 }}>Choose your preferred payment method:</p>

              <button
                onClick={() => setStep('zelle')}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: '16px', border: '2px solid #bbf7d0', background: '#f0fdf4', cursor: 'pointer', marginBottom: 12, textAlign: 'left' }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>💵</div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px 0', fontSize: 15 }}>Pay with Cash (Zelle)</p>
                  <p style={{ color: '#4b5563', fontSize: 13, margin: 0 }}>
                    Send <strong style={{ color: '#15803d' }}>{cashPrice}</strong> to{' '}
                    <span style={{ color: '#15803d', fontWeight: 600 }}>payments@exceedlearningcenterny.com</span>
                  </p>
                </div>
              </button>

              <button
                onClick={handleCardPay}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 16, padding: '16px', borderRadius: '16px', border: '2px solid #bfdbfe', background: '#eff6ff', cursor: 'pointer', textAlign: 'left', marginBottom: 16 }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#0e1f3e', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 22 }}>💳</div>
                <div>
                  <p style={{ fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px 0', fontSize: 15 }}>Pay by Card (Stripe)</p>
                  <p style={{ color: '#4b5563', fontSize: 13, margin: 0 }}>
                    <strong style={{ color: '#ca3433' }}>{cardPrice}</strong>{' '}
                    <span style={{ color: '#9ca3af' }}>(includes 4% processing fee)</span>
                  </p>
                </div>
              </button>

              {/* Back to form link */}
              {onBack && (
                <button
                  onClick={handleBack}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '11px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#64748b', fontSize: 13 }}
                >
                  <ArrowLeft size={15} />
                  Back — Edit my details
                </button>
              )}
            </div>
          )}

          {/* ── ZELLE STEP ── */}
          {step === 'zelle' && (
            <div>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 16, padding: 16, marginBottom: 16, fontSize: 13, color: '#166534' }}>
                <p style={{ fontWeight: 700, margin: '0 0 8px 0' }}>How to pay via Zelle:</p>
                <ol style={{ paddingLeft: 20, margin: 0, lineHeight: 1.9 }}>
                  <li>Open your bank app and go to Zelle</li>
                  <li>Send <strong>{cashPrice}</strong> to <strong>payments@exceedlearningcenterny.com</strong></li>
                  <li>Note your Zelle reference/confirmation number</li>
                  <li>Fill in below to confirm your enrollment</li>
                </ol>
              </div>
              <form onSubmit={handleZelleSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0e1f3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Full Name *</label>
                  <input required style={inputStyle} type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="John Doe" />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0e1f3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Phone Number *</label>
                  <input required style={inputStyle} type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 000-0000" />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0e1f3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Zelle Reference / Confirmation Number *</label>
                  <input required style={inputStyle} type="text" value={form.reference} onChange={e => setForm(f => ({ ...f, reference: e.target.value }))} placeholder="e.g. ZL123456789" />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep('choose')}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: 600, color: '#4b5563', fontSize: 14 }}
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    disabled={loading} type="submit"
                    style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: loading ? '#86efac' : '#16a34a', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: 14 }}
                  >
                    {loading ? 'Submitting...' : '✓ Confirm Zelle Payment'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── DONE STEP ── */}
          {step === 'done' && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 32 }}>✓</div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px 0' }}>Enrollment Submitted!</h3>
              <p style={{ color: '#4b5563', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Thank you, <strong>{registration?.studentName ?? form.name}</strong>! We have received your Zelle confirmation. Our team will verify your payment and send you enrollment details shortly.
              </p>
              <button
                onClick={handleClose}
                style={{ padding: '12px 28px', borderRadius: 12, border: 'none', background: '#0e1f3e', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}
              >
                Close
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
