'use client';

import { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  ChevronDown,
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
  const allBootcampMathDates = bootcamps.map(bc => bc.sessions.find(s => s.subject === 'MATH')!.date);
  const allBootcampEnglishDates = bootcamps.map(bc => bc.sessions.find(s => s.subject === 'ENGLISH')!.date);
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
            onRegister={() => onOpenPayment('SAT Bootcamp — English Only', '$199', 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=d1a47a98-5304-11f1-a8e1-12a0879a85b1', allBootcampEnglishDates)}
          />
          <PriceCard
            title="Math Only"
            price="$199"
            features={['4-hour session', 'Math problem-solving techniques', 'Practice materials included']}
            onRegister={() => onOpenPayment('SAT Bootcamp — Math Only', '$199', 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=d1a47a98-5304-11f1-a8e1-12a0879a85b1', allBootcampMathDates)}
          />
          <PriceCard
            title="Complete Bootcamp"
            price="$350"
            highlight
            badge="BEST VALUE"
            features={['Full 8-hour program', 'English and Math coverage', 'Complete test preparation', 'Save $48']}
            onRegister={() => onOpenPayment('SAT Bootcamp — Complete (Both Sessions)', '$350', 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=d1a47a98-5304-11f1-a8e1-12a0879a85b1', allBootcampCombinedDates)}
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

const prepScheduleDays = [
  { label: 'Monday & Wednesday', days: 'June 29 - Aug 20 (Mon & Wed)', time: '3:00 PM – 6:00 PM' },
  { label: 'Sunday', days: 'July 5 - Aug 16 (Sundays)', time: '9:00 AM – 3:00 PM' },
];

const mathDomains = [
  { domain: 'Algebra', units: ['Linear equations (1 var)', 'Linear equations (2 var)', 'Linear functions', 'Systems of linear equations', 'Linear inequalities'] },
  { domain: 'Advanced Math', units: ['Equivalent expressions', 'Nonlinear equations & systems', 'Nonlinear functions'] },
  { domain: 'Problem-Solving & Data Analysis', units: ['Ratios/rates/proportions/units', 'Percentages', 'One-variable data', 'Two-variable data & scatterplots', 'Probability & conditional probability', 'Inference & margin of error', 'Observational studies & experiments'] },
  { domain: 'Geometry & Trigonometry', units: ['Area and volume', 'Lines/angles/triangles', 'Right triangles & trigonometry', 'Circles'] },
];

const englishDomains = [
  { domain: 'Information & Ideas', units: ['Central ideas & details', 'Command of evidence (Textual)', 'Command of evidence (Quantitative)', 'Inferences'] },
  { domain: 'Craft & Structure', units: ['Words in context', 'Text structure & purpose', 'Cross-text connections'] },
  { domain: 'Expression of Ideas', units: ['Rhetorical synthesis', 'Transitions'] },
  { domain: 'Standard English Conventions', units: ['Boundaries', 'Form/structure/sense'] },
];

const weeklyPlan = [
  {
    week: 1, title: 'Foundations', mathFocus: 'Algebra (Part 1)', englishFocus: 'Information & Ideas (Part 1)',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Linear Equations in One Variable — Solving for x, isolating variables, word problems. Unit: Linear Equations in Two Variables — Slope, intercepts, slope-intercept form, standard form, graphing.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Algebra → Linear equations in 1 & 2 variables — skill drills + 1 timed mini quiz (10 Qs).' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Central Ideas & Details — Identifying main idea, supporting details, summarizing passages. Unit: Command of Evidence (Textual) — Finding evidence that supports a claim.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Information & Ideas → Central ideas + Textual evidence — 2 reading passages with targeted question sets.' },
    ],
  },
  {
    week: 2, title: 'Building on Algebra + Deepening Comprehension', mathFocus: 'Algebra (Part 2)', englishFocus: 'Information & Ideas (Part 2)',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Linear Functions — Function notation, tables, input/output, interpreting graphs. Unit: Linear Inequalities — Solving, graphing on number lines and coordinate planes, shading regions.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Algebra → Linear functions + Linear inequalities — skill exercises + word problem set.' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Command of Evidence (Quantitative) — Reading graphs, charts, tables embedded in passages. Unit: Inferences — Drawing logical conclusions; "best supported" question type.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Information & Ideas → Quantitative evidence + Inferences — 2 passages (one with embedded data graphic).' },
    ],
  },
  {
    week: 3, title: 'Systems & Advanced Math Entry', mathFocus: 'Algebra (Part 3) + Advanced Math Intro', englishFocus: 'Craft & Structure (Part 1)',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Systems of Two Linear Equations — Substitution, elimination, no solution/infinite solutions, word problems. Unit: Equivalent Expressions — Factoring, distributing, combining like terms.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Algebra → Systems of equations + Advanced Math → Equivalent expressions — mixed drill set.' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Words in Context — Using context clues to determine meaning; vocabulary-in-context strategy. Unit: Text Structure & Purpose — Author\'s purpose, organizational patterns.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Craft & Structure → Words in context + Text structure — vocabulary-focused passages + purpose questions.' },
    ],
  },
  {
    week: 4, title: 'Advanced Math Core', mathFocus: 'Advanced Math (Part 2)', englishFocus: 'Craft & Structure (Part 2)',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Nonlinear Equations & Systems — Quadratics (factoring, quadratic formula, completing the square), linear + quadratic systems. Unit: Nonlinear Functions — Exponential growth/decay, parabolas, interpreting behavior.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Advanced Math → Nonlinear equations + Nonlinear functions — graphing exercises + equation-solving drills.' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Cross-Text Connections — Comparing paired passages, identifying agreement/disagreement, synthesizing across authors.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Craft & Structure → Cross-text connections — 2 paired passage sets with comparison questions.' },
    ],
  },
  {
    week: 5, title: 'Data, Statistics & Expression of Ideas', mathFocus: 'Problem-Solving & Data Analysis (Part 1)', englishFocus: 'Expression of Ideas',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Ratios, Rates & Proportions — Setting up proportions, unit conversions, rate problems. Unit: Percentages — Percent change, multi-step problems. Unit: One-Variable Data — Mean, median, mode, standard deviation.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Problem-Solving & Data Analysis → Ratios + Percentages + One-variable data — mixed word problem drill.' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Rhetorical Synthesis — Combining notes/bullet points into cohesive sentences meeting a specific goal. Unit: Transitions — Choosing correct transition words (contrast, sequence, cause/effect).' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Expression of Ideas → Rhetorical synthesis + Transitions — synthesis writing exercises + transition sentence sets.' },
    ],
  },
  {
    week: 6, title: 'Advanced Data & Probability', mathFocus: 'Problem-Solving & Data Analysis (Part 2)', englishFocus: 'Standard English Conventions (Part 1)',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Two-Variable Data & Scatterplots — Line of best fit, correlation, interpolation vs extrapolation. Unit: Probability & Conditional Probability — Basic probability, conditional probability tables.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Problem-Solving & Data Analysis → Scatterplots + Probability — data interpretation exercises.' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Boundaries — Sentence boundaries (run-ons, fragments, comma splices), proper use of periods, semicolons, colons, and em dashes.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Standard English Conventions → Boundaries — sentence correction exercises.' },
    ],
  },
  {
    week: 7, title: 'Geometry & Trigonometry + Grammar Mastery', mathFocus: 'Geometry & Trigonometry', englishFocus: 'Standard English Conventions (Part 2)',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Unit: Area & Volume — Circles, triangles, composite figures; cylinder, cone, sphere. Unit: Lines, Angles & Triangles — Parallel lines, transversals, congruence. Unit: Right Triangles & Trig — Pythagorean theorem, sin/cos/tan, special triangles. Unit: Circles — Arc length, sector area, central/inscribed angles.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Geometry & Trigonometry — all four units — figure-based problem set.' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Unit: Form, Structure & Sense — Subject-verb agreement, pronoun-antecedent agreement, verb tense consistency, misplaced modifiers, parallel structure, possessives.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Standard English Conventions → Form, structure & sense — grammar correction exercises + full grammar quiz.' },
    ],
  },
  {
    week: 8, title: 'Full Review + Simulated Test', mathFocus: 'All Domains Review', englishFocus: 'All Domains Review',
    blocks: [
      { label: 'MATH Instruction', time: '2 hrs', content: 'Targeted Review: Most missed question types from weeks 1–7. Focus on hardest Algebra applications, Advanced Math traps, Data Analysis multi-step, Geometry word problems.' },
      { label: 'MATH Practice', time: '1 hr', content: 'Khan Academy: Full Math section — timed practice test (Digital SAT format, 44 questions, 70 minutes simulated).' },
      { label: 'ENGLISH Instruction', time: '2 hrs', content: 'Targeted Review: All four English domains — focus on highest-error types. Revisit cross-text connections, synthesis, and boundaries. Test-taking strategy: process of elimination, annotation, time management.' },
      { label: 'ENGLISH Practice', time: '1 hr', content: 'Khan Academy: Full Reading & Writing section — timed practice test (Digital SAT format, 54 questions, 64 minutes simulated).' },
    ],
  },
];

const packetItems = [
  'Unit Overview — Learning objectives aligned to Khan Academy unit names',
  'Key Concepts Summary — Notes & mini-lessons reference',
  'Formula / Reference Sheet — Topic-specific',
  'Guided Examples — 5–8 worked problems (Math) or annotated passages (English)',
  'Independent Practice — 15–20 questions mirroring Khan Academy style',
  'Khan Academy Assignment Page — Exact skill names to assign each week',
  'Exit Ticket — 3–5 questions for quick formative check',
];

function CurriculumSection() {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  return (
    <section id="curriculum" className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="text-[#ca3433]" size={32} />
        <h3 className="text-3xl font-bold text-[#0e1f3e]">8-Week Course Curriculum</h3>
      </div>

      {/* Domain Overview */}
      <div className="grid md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#0e1f3e] text-white text-xs font-bold px-3 py-1 rounded-full">MATH</span>
            <h4 className="font-bold text-[#0e1f3e]">Digital SAT Math Domains</h4>
          </div>
          <div className="space-y-3">
            {mathDomains.map((d) => (
              <div key={d.domain}>
                <p className="font-semibold text-[#ca3433] text-sm">{d.domain}</p>
                <p className="text-sm text-slate-600">{d.units.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-[#ca3433] text-white text-xs font-bold px-3 py-1 rounded-full">ENGLISH</span>
            <h4 className="font-bold text-[#0e1f3e]">Digital SAT Reading & Writing Domains</h4>
          </div>
          <div className="space-y-3">
            {englishDomains.map((d) => (
              <div key={d.domain}>
                <p className="font-semibold text-[#ca3433] text-sm">{d.domain}</p>
                <p className="text-sm text-slate-600">{d.units.join(' · ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Plan Accordion */}
      <h4 className="text-xl font-bold text-[#0e1f3e] mb-4 flex items-center gap-2">
        <Calendar className="text-[#ca3433]" size={22} />
        Weekly Course Plan
      </h4>
      <div className="space-y-3">
        {weeklyPlan.map((week) => {
          const isOpen = expandedWeek === week.week;
          return (
            <div key={week.week} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedWeek(isOpen ? null : week.week)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-[#0e1f3e] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                    {week.week}
                  </span>
                  <div className="min-w-0">
                    <p className="font-bold text-[#0e1f3e] truncate">Week {week.week} — {week.title}</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <span className="text-xs bg-[#0e1f3e]/10 text-[#0e1f3e] px-2 py-0.5 rounded font-medium">Math: {week.mathFocus}</span>
                      <span className="text-xs bg-[#ca3433]/10 text-[#ca3433] px-2 py-0.5 rounded font-medium">English: {week.englishFocus}</span>
                    </div>
                  </div>
                </div>
                <ChevronDown className={`text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} size={20} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 border-t border-slate-100">
                  <div className="grid gap-3 mt-4">
                    {week.blocks.map((block, i) => {
                      const isMath = block.label.startsWith('MATH');
                      const isInstruction = block.label.includes('Instruction');
                      return (
                        <div key={i} className={`rounded-lg p-4 ${isMath ? 'bg-slate-50' : 'bg-[#fdf2f2]'}`}>
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isMath ? 'bg-[#0e1f3e] text-white' : 'bg-[#ca3433] text-white'}`}>
                              {isMath ? 'MATH' : 'ENGLISH'}
                            </span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${isInstruction ? 'bg-slate-200 text-slate-700' : 'bg-green-100 text-green-800'}`}>
                              {isInstruction ? 'INSTRUCTION' : 'PRACTICE'}
                            </span>
                            <span className="text-xs text-slate-500 ml-auto flex items-center gap-1">
                              <Clock size={12} />
                              {block.time}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{block.content}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Weekly Packet */}
      <div className="mt-8 bg-[#f7e0e0] border-2 border-[#ca3433] rounded-xl p-6">
        <h4 className="text-lg font-bold text-[#0e1f3e] mb-3">📦 Weekly Packet Includes</h4>
        <div className="grid sm:grid-cols-2 gap-2">
          {packetItems.map((item) => (
            <div key={item} className="flex items-start gap-2">
              <CheckCircle className="text-[#ca3433] flex-shrink-0 mt-0.5" size={16} />
              <span className="text-sm text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SatPrepSection({ onOpenPayment }: { onOpenPayment: OnOpenPayment }) {
  const prepStripeLink = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=f73ff19a-5304-11f1-a8e1-12a0879a85b1';
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
            <a href="#curriculum" className="bg-[#0e1f3e] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1b2f57] transition-colors">Curriculum</a>
            <a href="#pricing"  className="bg-[#ca3433] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#ac2c2a] transition-colors">Pricing</a>
            <button onClick={() => onOpenPayment('SAT Prep Course', prepPrice, prepStripeLink, prepScheduleDays.map(o => o.days))} className="bg-slate-100 text-slate-900 px-5 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Enroll Now</button>
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
              <span className="font-semibold">2 Days Per Week · Ends week of Aug 20</span>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {prepScheduleDays.map((opt) => (
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

      <CurriculumSection />

      <section className="mb-10">
        <h3 className="text-3xl font-bold text-[#0e1f3e] mb-6">Why Join Our Program?</h3>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { icon: <Star className="text-[#ca3433]" />, title: 'Boost Confidence', desc: 'Build test-taking skills and confidence through structured practice and expert guidance' },
            { icon: <GraduationCap className="text-[#ca3433]" />, title: 'Expert Instructors', desc: 'Learn from experienced educators who understand SAT requirements inside and out' },
            { icon: <BookOpen className="text-[#ca3433]" />, title: 'Structured Reviews', desc: 'Comprehensive curriculum covering all essential topics and test-taking strategies' },
            { icon: <Calendar className="text-[#ca3433]" />, title: 'Convenient Schedule', desc: 'Two days per week — Monday & Wednesday afternoons plus Sunday sessions' },
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
            <button onClick={() => onOpenPayment('SAT Prep Course', prepPrice, prepStripeLink, prepScheduleDays.map(o => o.days))} className="mt-6 block w-full rounded-lg bg-white text-[#ca3433] py-4 font-semibold text-center text-lg">
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
        <button onClick={() => onOpenPayment('SAT Prep Course', prepPrice, prepStripeLink, prepScheduleDays.map(o => o.days))} className="inline-block bg-[#ca3433] hover:bg-[#ac2c2a] transition-colors px-8 py-4 rounded-xl text-white font-semibold text-lg">
          Enroll Now — Choose Payment
        </button>
      </section>
    </>
  );
}
