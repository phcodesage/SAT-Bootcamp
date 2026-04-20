'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <style>{`
        @keyframes stt-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes stt-fadeout {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(12px); }
        }
        .stt-btn {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 999;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: #ca3433;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(202,52,51,0.45);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
        }
        .stt-btn:hover {
          background: #ac2c2a;
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(202,52,51,0.5);
        }
        .stt-btn:active {
          transform: translateY(0);
        }
        .stt-visible {
          animation: stt-fadein 0.25s ease forwards;
        }
        .stt-hidden {
          animation: stt-fadeout 0.25s ease forwards;
          pointer-events: none;
        }
      `}</style>

      <button
        className={`stt-btn ${visible ? 'stt-visible' : 'stt-hidden'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
      >
        <ArrowUp size={22} strokeWidth={2.5} />
      </button>
    </>
  );
}
