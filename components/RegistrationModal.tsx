'use client';

import { useState } from 'react';

export interface RegistrationData {
  studentName: string;
  email: string;
  phone: string;
  subject: 'English' | 'Math' | 'Both';
  selectedDate?: string;
  /** MongoDB _id returned after the initial save — used to PATCH payment details */
  registrationId?: string;
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
  availableDates?: string[];
  onComplete: (data: RegistrationData) => void;
}

type Step = 'form' | 'submitting';

export default function RegistrationModal({
  isOpen,
  onClose,
  courseName,
  availableDates,
  onComplete,
}: RegistrationModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [form, setForm] = useState<RegistrationData>({
    studentName: '',
    email: '',
    phone: '',
    subject: 'Both',
    selectedDate: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});

  if (!isOpen) return null;

  function validate() {
    const e: Partial<Record<keyof RegistrationData, string>> = {};
    if (!form.studentName.trim()) e.studentName = 'Student name is required';
    if (!form.email.trim()) {
      e.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Please enter a valid email';
    }
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (availableDates && availableDates.length > 0 && !form.selectedDate) {
      e.selectedDate = 'Please select a date';
    }
    return e;
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    // Switch to animation immediately
    setStep('submitting');

    let registrationId: string | undefined;

    // API call + minimum animation time run in parallel
    const [res] = await Promise.all([
      fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: form.studentName,
          email: form.email,
          phone: form.phone,
          subject: form.subject,
          courseName,
          selectedDate: form.selectedDate,
          paymentMethod: 'pending',
          status: 'pending',
        }),
      }).catch((err) => { console.error('Failed to save registration:', err); return null; }),
      // Minimum 1.4s so the animation is clearly visible
      new Promise<void>((r) => setTimeout(r, 1400)),
    ]);

    if (res && res.ok) {
      const data = await res.json();
      registrationId = data.id;
    }

    // Backend confirmed — open payment
    onComplete({ ...form, registrationId });
  }

  function handleClose() {
    setStep('form');
    setForm({ studentName: '', email: '', phone: '', subject: 'Both', selectedDate: '' });
    setErrors({});
    onClose();
  }

  const inputBase: React.CSSProperties = {
    width: '100%', padding: '12px 16px', borderRadius: '12px',
    border: '1.5px solid #e2e8f0', background: '#f8fafc',
    fontSize: '14px', outline: 'none', color: '#0e1f3e', boxSizing: 'border-box',
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={step === 'form' ? handleClose : undefined}
    >
      <div
        style={{ background: '#fff', borderRadius: '1.5rem', boxShadow: '0 25px 80px rgba(0,0,0,0.25)', width: '100%', maxWidth: '480px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: '#0e1f3e', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 }}>
              {step === 'form' ? 'Step 1 of 2 — Student Information' : 'Submitting…'}
            </p>
            <h2 style={{ color: '#fff', fontSize: '18px', fontWeight: 700, margin: '4px 0 0 0' }}>{courseName}</h2>
          </div>
          {step === 'form' && (
            <button
              onClick={handleClose}
              style={{ background: 'rgba(255,255,255,0.12)', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Close"
            >
              ✕
            </button>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ background: '#e2e8f0', height: 4 }}>
          <div style={{
            background: '#ca3433', height: 4,
            width: step === 'form' ? '50%' : '85%',
            transition: 'width 0.4s ease',
          }} />
        </div>

        <div style={{ padding: '24px', overflowY: 'auto' }}>

          {/* ── FORM ── */}
          {step === 'form' && (
            <>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
                Please fill in the student&apos;s information to proceed to payment.
              </p>

              <form onSubmit={handleFormSubmit} noValidate>
                <Field label="Student Name *" error={errors.studentName}>
                  <input
                    style={{ ...inputBase, borderColor: errors.studentName ? '#ca3433' : '#e2e8f0' }}
                    type="text" value={form.studentName} placeholder="Full name of the student"
                    onChange={(e) => { setForm(f => ({ ...f, studentName: e.target.value })); setErrors(er => ({ ...er, studentName: undefined })); }}
                  />
                </Field>

                <Field label="Email Address *" error={errors.email}>
                  <input
                    style={{ ...inputBase, borderColor: errors.email ? '#ca3433' : '#e2e8f0' }}
                    type="email" value={form.email} placeholder="email@example.com"
                    onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setErrors(er => ({ ...er, email: undefined })); }}
                  />
                </Field>

                <Field label="Phone Number *" error={errors.phone}>
                  <input
                    style={{ ...inputBase, borderColor: errors.phone ? '#ca3433' : '#e2e8f0' }}
                    type="tel" value={form.phone} placeholder="(555) 000-0000"
                    onChange={(e) => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: undefined })); }}
                  />
                </Field>

                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0e1f3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>Subject *</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {(['English', 'Math', 'Both'] as const).map((opt) => (
                      <button
                        key={opt} type="button"
                        onClick={() => setForm(f => ({ ...f, subject: opt }))}
                        style={{ flex: 1, minWidth: 90, padding: '12px 8px', borderRadius: 12, border: `2px solid ${form.subject === opt ? '#ca3433' : '#e2e8f0'}`, background: form.subject === opt ? '#ca3433' : '#f8fafc', color: form.subject === opt ? '#fff' : '#0e1f3e', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.15s' }}
                      >
                        {opt === 'Both' ? 'Both (English & Math)' : opt}
                      </button>
                    ))}
                  </div>
                </div>

                {availableDates && availableDates.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0e1f3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
                      {courseName.toLowerCase().includes('prep') ? 'Select Schedule *' : 'Select Date *'}
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
                      {availableDates.map((date) => (
                        <button
                          key={date} type="button"
                          onClick={() => { setForm(f => ({ ...f, selectedDate: date })); setErrors(er => ({ ...er, selectedDate: undefined })); }}
                          style={{
                            padding: '12px 8px', borderRadius: 12,
                            border: `2px solid ${form.selectedDate === date ? '#ca3433' : '#e2e8f0'}`,
                            background: form.selectedDate === date ? '#ca3433' : '#f8fafc',
                            color: form.selectedDate === date ? '#fff' : '#0e1f3e',
                            fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                            textAlign: 'center',
                          }}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                    {errors.selectedDate && <p style={{ color: '#ca3433', fontSize: 12, marginTop: 4 }}>{errors.selectedDate}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#ca3433', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 15 }}
                >
                  Submit &amp; Continue to Payment →
                </button>
              </form>
            </>
          )}

          {/* ── SUBMITTING ANIMATION ── */}
          {step === 'submitting' && (
            <>
              <style>{`
                @keyframes exceed-spin {
                  to { transform: rotate(360deg); }
                }
                @keyframes exceed-pulse {
                  0%, 100% { opacity: 1; transform: scale(1); }
                  50%       { opacity: 0.6; transform: scale(0.92); }
                }
                @keyframes exceed-fadein {
                  from { opacity: 0; transform: translateY(8px); }
                  to   { opacity: 1; transform: translateY(0); }
                }
              `}</style>

              <div style={{ textAlign: 'center', padding: '36px 16px' }}>
                {/* Spinner */}
                <div style={{ position: 'relative', width: 72, height: 72, margin: '0 auto 24px' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '5px solid #f1f5f9' }} />
                  <div style={{
                    position: 'absolute', inset: 0, borderRadius: '50%',
                    border: '5px solid transparent',
                    borderTopColor: '#ca3433',
                    borderRightColor: '#ca3433',
                    animation: 'exceed-spin 0.8s linear infinite',
                  }} />
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: '50%', background: '#ca3433',
                      animation: 'exceed-pulse 1s ease-in-out infinite',
                    }} />
                  </div>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 700, color: '#0e1f3e', margin: '0 0 8px 0', animation: 'exceed-fadein 0.4s ease both' }}>
                  Submitting your registration…
                </h3>
                <p style={{ color: '#64748b', fontSize: 14, margin: '0 0 28px 0', animation: 'exceed-fadein 0.5s ease both' }}>
                  We&apos;re saving your details. You&apos;ll be directed to payment in just a moment.
                </p>

                {/* Bouncing dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: 8, height: 8, borderRadius: '50%', background: '#ca3433',
                      animation: `exceed-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#0e1f3e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>{label}</label>
      {children}
      {error && <p style={{ color: '#ca3433', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
