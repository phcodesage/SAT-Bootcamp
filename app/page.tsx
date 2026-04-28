'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  DollarSign,
  GraduationCap,
  Star,
} from 'lucide-react';
import PaymentModal, { calcCardPrice } from '@/components/PaymentModal';
import RegistrationModal, { type RegistrationData } from '@/components/RegistrationModal';
import ScrollToTop from '@/components/ScrollToTop';

type Program = 'bootcamp' | 'prep';

export default function HomePage() {
  const [selectedProgram, setSelectedProgram] = useState<Program>('bootcamp');

  const [regOpen, setRegOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState({ name: '', cashPrice: '', stripeLink: '', availableDates: [] as string[] });
  const [registration, setRegistration] = useState<RegistrationData | undefined>(undefined);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCourseName, setModalCourseName] = useState('');
  const [modalCashPrice, setModalCashPrice] = useState('');
  const [modalStripeLink, setModalStripeLink] = useState('');

  function openPayment(courseName: string, cashPrice: string, stripeLink: string, availableDates: string[] = []) {
    setPendingCourse({ name: courseName, cashPrice, stripeLink, availableDates });
    setRegOpen(true);
  }

  function handleRegistrationComplete(data: RegistrationData) {
    setRegistration(data);
    setRegOpen(false);
    setModalCourseName(pendingCourse.name);
    setModalCashPrice(pendingCourse.cashPrice);
    setModalStripeLink(pendingCourse.stripeLink);
    setModalOpen(true);
  }

  /** User clicked "Back" inside the payment modal — reopen the registration form */
  function handlePaymentBack() {
    setModalOpen(false);
    setRegOpen(true);
  }

  const programTitle = useMemo(
    () => (selectedProgram === 'bootcamp' ? 'SAT BOOTCAMP' : 'SAT PREP COURSE'),
    [selectedProgram]
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <RegistrationModal
        isOpen={regOpen}
        onClose={() => setRegOpen(false)}
        courseName={pendingCourse.name}
        availableDates={pendingCourse.availableDates}
        onComplete={handleRegistrationComplete}
      />
      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onBack={handlePaymentBack}
        courseName={modalCourseName}
        cashPrice={modalCashPrice}
        cardPrice={calcCardPrice(modalCashPrice)}
        stripeLink={modalStripeLink}
        registration={registration}
      />

      <header className="bg-[#0e1f3e] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/exceed-logo.png" alt="Exceed Learning logo" className="h-12 md:h-14 w-auto" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#ff5a5f]">SAT Programs</h1>
          <p className="text-lg md:text-xl text-[#f7e0e0] mt-3 max-w-3xl">
            Choose the program that best fits your goals and exam timeline.
          </p>
          <div className="mt-8 bg-white/10 border border-white/20 rounded-2xl p-3 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <button
              type="button"
              onClick={() => setSelectedProgram('bootcamp')}
              className={`rounded-xl px-5 py-3 font-semibold transition-all ${
                selectedProgram === 'bootcamp'
                  ? 'bg-[#ca3433] text-white shadow-lg'
                  : 'bg-white text-[#0e1f3e] hover:bg-[#f7e0e0]'
              }`}
            >
              SAT BOOTCAMP
            </button>
            <button
              type="button"
              onClick={() => setSelectedProgram('prep')}
              className={`rounded-xl px-5 py-3 font-semibold transition-all ${
                selectedProgram === 'prep'
                  ? 'bg-[#ca3433] text-white shadow-lg'
                  : 'bg-white text-[#0e1f3e] hover:bg-[#f7e0e0]'
              }`}
            >
              SAT PREP COURSE
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0e1f3e]">{programTitle}</h2>
          <p className="mt-2 text-slate-600">
            {selectedProgram === 'bootcamp'
              ? 'Practical strategies to approach the SAT, practice questions and more.'
              : 'SAT prep with structured support and expert instruction.'}
          </p>
        </div>
        {selectedProgram === 'bootcamp' ? (
          <SatBootcampSection onOpenPayment={openPayment} />
        ) : (
          <SatPrepSection onOpenPayment={openPayment} />
        )}
      </main>

      <footer className="bg-[#0e1f3e] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#f7e0e0]">SAT Bootcamp and SAT Prep Course</p>
          <p className="text-sm mt-2 opacity-75">Your path to exam success starts here</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}

type OnOpenPayment = (courseName: string, cashPrice: string, stripeLink: string, availableDates?: string[]) => void;

const bootcamps = [
  { title: 'MAY BOOTCAMP',       examLabel: 'For June 6 Exam',   sessions: [{ date: 'May 24, 2026', subject: 'MATH' }, { date: 'May 31, 2026', subject: 'ENGLISH' }] },
  { title: 'AUGUST BOOTCAMP',    examLabel: 'For Sep 12 Exam',   sessions: [{ date: 'Aug 30, 2026', subject: 'MATH' }, { date: 'Sep 6, 2026', subject: 'ENGLISH' }] },
  { title: 'SEPTEMBER BOOTCAMP', examLabel: 'For Oct 2 Exam',    sessions: [{ date: 'Sep 20, 2026', subject: 'MATH' }, { date: 'Sep 27, 2026', subject: 'ENGLISH' }] },
  { title: 'OCTOBER BOOTCAMP',   examLabel: 'For Nov 7 Exam',    sessions: [{ date: 'Oct 25, 2026', subject: 'MATH' }, { date: 'Nov 1, 2026', subject: 'ENGLISH' }] },
  { title: 'NOVEMBER BOOTCAMP',  examLabel: 'For Dec 5 Exam',    sessions: [{ date: 'Nov 22, 2026', subject: 'MATH' }, { date: 'Nov 29, 2026', subject: 'ENGLISH' }] },
];

function SatBootcampSection({ onOpenPayment }: { onOpenPayment: OnOpenPayment }) {
  const allBootcampIndividualDates = bootcamps.flatMap(bc => bc.sessions.map(s => s.date));
  const allBootcampCombinedDates = bootcamps.map(bc => {
    if (bc.sessions.length === 2) {
      const s1 = bc.sessions[0].date;
      const s2 = bc.sessions[1].date;
      const parts1 = s1.split(' ');
      const parts2 = s2.split(' ');
      const month1 = parts1[0];
      const day1 = parts1[1].replace(',', '');
      const month2 = parts2[0];
      const day2 = parts2[1].replace(',', '');
      const year = parts2[2];

      if (month1 === month2) {
        return `${month1} ${day1} & ${day2}, ${year}`;
      }
      return `${month1} ${day1} & ${month2} ${day2}, ${year}`;
    }
    return bc.sessions.map(s => s.date).join(' & ');
  });

  return (
    <>
      <div className="relative w-full min-h-[420px] rounded-2xl bg-[#0e1f3e] overflow-hidden mb-12">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Students taking SAT exam"
          className="w-full h-full object-cover opacity-70 absolute inset-0"
        />
        <div className="relative z-10 bg-gradient-to-r from-[#0e1f3e]/90 to-[#0e1f3e]/50 h-full min-h-[420px] flex items-center">
          <div className="px-6 py-10 md:px-10 w-full">
            <div className="max-w-2xl">
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">Master the SAT</h3>
              <p className="text-xl md:text-2xl text-[#f7e0e0] mb-6">
                $199 each session (can choose math or English) or $350 for both
              </p>
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 text-white">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-[#ca3433]" size={24} />
                  <span className="text-base md:text-lg">SUNDAYS 10AM – 2PM</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-[#ca3433]" size={24} />
                  <span className="text-base md:text-lg">2 WEEKS (4 HOURS PER SESSION)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f7e0e0] rounded-2xl p-8 mb-12 border-4 border-[#ca3433]">
        <h3 className="text-3xl md:text-4xl font-bold text-[#0e1f3e] mb-4 text-center">Master the SAT in 2 Weeks</h3>
        <p className="text-lg md:text-xl text-[#0e1f3e] text-center">
          Intensive bootcamp designed to prepare you for upcoming SAT exams
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {bootcamps.map((bc) => (
          <div key={bc.title} className="bg-white border-2 border-[#0e1f3e] rounded-xl p-6 shadow-lg">
            <div className="flex items-center mb-1">
              <Calendar className="text-[#ca3433] mr-3 flex-shrink-0" size={26} />
              <h4 className="text-xl font-bold text-[#0e1f3e]">{bc.title}</h4>
            </div>
            <p className="text-sm font-semibold text-[#ca3433] mb-4 ml-9">{bc.examLabel}</p>
            <ul className="space-y-2 text-gray-700">
              <li className="text-sm font-bold text-[#0e1f3e] uppercase tracking-wide">Bootcamp Sessions:</li>
              {bc.sessions.map((s) => (
                <li key={s.date} className="flex items-center gap-2">
                  <CheckCircle className="text-[#ca3433] flex-shrink-0" size={16} />
                  <span>{s.date}</span>
                  <span className="text-xs font-bold text-[#ca3433] border border-[#ca3433] rounded px-1.5 py-0.5 leading-none">
                    {s.subject}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-[#0e1f3e] rounded-2xl p-10 mb-12 text-white">
        <h3 className="text-3xl font-bold mb-6 text-center">What You&apos;ll Learn</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: <CheckCircle size={32} />, title: 'Practical Strategies', desc: 'Learn proven approaches to tackle SAT questions efficiently' },
            { icon: <BookOpen size={32} />, title: 'Practice Questions', desc: 'Work through real SAT-style problems with expert guidance' },
            { icon: <Clock size={32} />, title: 'Time Management', desc: 'Master pacing and optimize your test-taking approach' },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="bg-[#ca3433] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                {item.icon}
              </div>
              <h4 className="font-bold text-xl mb-2">{item.title}</h4>
              <p className="text-[#f7e0e0]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#f7e0e0] rounded-2xl p-10 border-2 border-[#ca3433]">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="text-[#ca3433]" size={40} />
          <h3 className="text-3xl font-bold text-[#0e1f3e]">Pricing Options</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <PriceCard
            title="English Only"
            price="$199"
            features={['4-hour session', 'Reading and Writing strategies', 'Practice materials included']}
            onRegister={() => onOpenPayment('SAT Bootcamp — English Only', '$199', 'https://buy.stripe.com/eVq14ge0A33Q9S978vdfG06', allBootcampIndividualDates)}
          />
          <PriceCard
            title="Math Only"
            price="$199"
            features={['4-hour session', 'Math problem-solving techniques', 'Practice materials included']}
            onRegister={() => onOpenPayment('SAT Bootcamp — Math Only', '$199', 'https://buy.stripe.com/eVq14ge0A33Q9S978vdfG06', allBootcampIndividualDates)}
          />
          <PriceCard
            title="Complete Bootcamp"
            price="$350"
            highlight
            badge="BEST VALUE"
            features={['Full 8-hour program', 'English and Math coverage', 'Complete test preparation', 'Save $48']}
            onRegister={() => onOpenPayment('SAT Bootcamp — Complete (Both Sessions)', '$350', 'https://buy.stripe.com/4gM8wI1dO33Q0hz8czdfG05', allBootcampCombinedDates)}
          />
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-2xl text-[#0e1f3e] font-semibold mb-4">
          Join our SAT Bootcamp — multiple dates available throughout 2026
        </p>
        <p className="text-lg text-gray-600">Limited spots available. Register now to secure your place.</p>
      </div>
    </>
  );
}

function PriceCard({
  title, price, features, onRegister, highlight = false, badge,
}: {
  title: string; price: string; features: string[]; onRegister: () => void; highlight?: boolean; badge?: string;
}) {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg text-center border-2 ${
        highlight
          ? 'bg-[#ca3433] text-white border-[#ca3433] transform md:scale-105'
          : 'bg-white text-[#0e1f3e] border-[#0e1f3e] hover:border-[#ca3433] transition-colors'
      }`}
    >
      {badge && (
        <div className="bg-[#0e1f3e] text-white text-sm font-bold py-1 px-3 rounded-full inline-block mb-2">
          {badge}
        </div>
      )}
      <h4 className="text-2xl font-bold mb-4">{title}</h4>
      <p className={`text-5xl font-bold mb-4 ${highlight ? '' : 'text-[#ca3433]'}`}>{price}</p>
      <ul className="text-left space-y-2 mb-6">
        {features.map((f) => (
          <li key={f} className="flex items-start">
            <CheckCircle className={`mr-2 flex-shrink-0 mt-1 ${highlight ? 'text-white' : 'text-[#ca3433]'}`} size={16} />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={onRegister}
        className={`w-full py-3 px-6 rounded-lg font-semibold shadow transition-colors ${
          highlight
            ? 'bg-white text-[#ca3433] hover:bg-[#f7e0e0]'
            : 'bg-[#0e1f3e] text-white hover:bg-[#ca3433]'
        }`}
      >
        Register — Choose Payment
      </button>
    </div>
  );
}

const prepScheduleOptions = [
  { label: 'Option 1', days: 'June 29 - Aug 21 (M/W/F)', time: '4:00 PM – 6:00 PM' },
  { label: 'Option 2', days: 'June 30 - Aug 20 (Tue & Thu)', time: '3:00 PM – 6:00 PM' },
  { label: 'Option 3', days: 'July 5 - Aug 16 (Sundays)', time: '9:00 AM – 3:00 PM' },
];

function SatPrepSection({ onOpenPayment }: { onOpenPayment: OnOpenPayment }) {
  const prepStripeLink = 'https://buy.stripe.com/3cIeV69KkbAm9S92SfdfG0z';
  const prepPrice = '$3,300';

  return (
    <>
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo/exceed-logo.png" alt="Exceed Learning logo" className="h-10 md:h-12 w-auto" />
            <h3 className="text-3xl md:text-4xl font-bold text-[#0e1f3e] mt-2">SAT Prep Course</h3>
            <div className="mt-3">
              <span className="inline-block bg-[#ca3433] text-white font-bold px-4 py-2 rounded-lg text-lg">
                ENGLISH AND MATH
              </span>
            </div>
            <p className="mt-3 text-lg text-slate-700 font-semibold">
              FULL PRACTICE EXAM INCLUDING ALL MATERIALS NEEDED
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#schedule" className="bg-[#0e1f3e] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1b2f57] transition-colors">Schedule</a>
            <a href="#pricing"  className="bg-[#ca3433] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#ac2c2a] transition-colors">Pricing</a>
            <button onClick={() => onOpenPayment('SAT Prep Course', prepPrice, prepStripeLink, prepScheduleOptions.map(o => o.days))} className="bg-slate-100 text-slate-900 px-5 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Enroll Now</button>
          </div>
        </div>

        <div id="schedule" className="mt-2">
          <div className="bg-[#0e1f3e] text-white rounded-xl px-6 py-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#f7e0e0] mb-1">SAT Summer Prep Course</p>
              <p className="text-xl font-bold">Starts June 29 · Exam Aug 22</p>
            </div>
            <div className="flex items-center gap-2 text-[#f7e0e0]">
              <Clock size={18} className="text-[#ca3433]" />
              <span className="font-semibold">8 Weeks · Ends week of Aug 21</span>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {prepScheduleOptions.map((opt) => (
              <div key={opt.label} className="rounded-xl bg-[#f7e0e0] border border-[#efc8c8] p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-[#ca3433] mb-2">{opt.label}</p>
                <p className="font-bold text-[#0e1f3e] text-lg leading-snug">{opt.days}</p>
                <div className="flex items-center gap-2 mt-2 text-slate-700">
                  <Clock size={15} className="text-[#ca3433] flex-shrink-0" />
                  <span className="font-semibold">{opt.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-[#0e1f3e] text-white p-5 text-center">
          <p className="text-2xl font-bold">PRICE: $3,300</p>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-3xl font-bold text-[#0e1f3e] mb-6">Why Join Our Program?</h3>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: <Star className="text-[#ca3433]" />, title: 'Boost Confidence', desc: 'Build test-taking skills and confidence through structured practice and expert guidance' },
            { icon: <GraduationCap className="text-[#ca3433]" />, title: 'Expert Instructors', desc: 'Learn from experienced educators who understand SAT requirements inside and out' },
            { icon: <BookOpen className="text-[#ca3433]" />, title: 'Structured Reviews', desc: 'Comprehensive curriculum covering all essential topics and test-taking strategies' },
            { icon: <Calendar className="text-[#ca3433]" />, title: 'Flexible Schedule', desc: 'Three schedule options to fit your summer — mornings, afternoons, or weekdays' },
          ].map((item) => (
            <div key={item.title} className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                {item.icon}
                <h4 className="text-xl font-semibold">{item.title}</h4>
              </div>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="mb-12">
        <h3 className="text-3xl font-bold text-[#0e1f3e] mb-2">Program Pricing</h3>
        <p className="text-slate-700 mb-6">Complete SAT Prep Course - English and Math</p>
        <div className="max-w-lg mx-auto">
          <div className="bg-[#ca3433] text-white border border-[#ca3433] rounded-xl p-8">
            <div className="text-center">
              <span className="inline-block bg-[#0e1f3e] text-white font-bold px-4 py-2 rounded-lg text-lg mb-4">ENGLISH AND MATH</span>
              <h4 className="text-2xl font-bold">Complete SAT Prep Course</h4>
              <p className="text-5xl font-bold mt-4">$3,300</p>
              <p className="mt-2 text-[#f7e0e0]">Full Practice Exam Including All Materials Needed</p>
            </div>
            <ul className="mt-6 space-y-3">
              {['All English and Math sessions', 'Complete practice materials', 'Full practice exams', 'Priority support'].map((f) => (
                <li key={f} className="flex items-start"><CheckCircle className="mr-2 mt-0.5" size={18} />{f}</li>
              ))}
            </ul>
            <button onClick={() => onOpenPayment('SAT Prep Course', prepPrice, prepStripeLink, prepScheduleOptions.map(o => o.days))} className="mt-6 block w-full rounded-lg bg-white text-[#ca3433] py-4 font-semibold text-center text-lg">
              Enroll Now — Choose Payment
            </button>
          </div>
        </div>
      </section>

      <section id="enroll" className="bg-[#0e1f3e] text-white rounded-2xl p-8 md:p-10 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-3">Ready to Help Your Student Succeed?</h3>
        <p className="text-[#f7e0e0] text-lg mb-6">
          Don&apos;t wait until the last minute. Enroll now and give your student the best chance to excel.
        </p>
        <button onClick={() => onOpenPayment('SAT Prep Course', prepPrice, prepStripeLink, prepScheduleOptions.map(o => o.days))} className="inline-block bg-[#ca3433] hover:bg-[#ac2c2a] transition-colors px-8 py-4 rounded-xl text-white font-semibold text-lg">
          Enroll Now — Choose Payment
        </button>
      </section>
    </>
  );
}
