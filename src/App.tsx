import { useMemo, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  BookText,
  DollarSign,
  GraduationCap,
  Star,
} from 'lucide-react';

type Program = 'bootcamp' | 'prep';

function App() {
  const [selectedProgram, setSelectedProgram] = useState<Program>('bootcamp');

  const programTitle = useMemo(() => {
    return selectedProgram === 'bootcamp' ? 'SAT BOOTCAMP' : 'SAT PREP COURSE';
  }, [selectedProgram]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-[#0e1f3e] text-white py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-3">
            <img
              src="/logo/exceed-logo.png"
              alt="Exceed Learning logo"
              className="h-12 md:h-14 w-auto"
            />
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
              : 'State exam prep for Grades 3-8 with structured support and expert instruction.'}
          </p>
        </div>

        {selectedProgram === 'bootcamp' ? <SatBootcampSection /> : <SatPrepSection />}
      </main>

      <footer className="bg-[#0e1f3e] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#f7e0e0]">SAT Bootcamp and SAT Prep Course</p>
          <p className="text-sm mt-2 opacity-75">Your path to exam success starts here</p>
        </div>
      </footer>
    </div>
  );
}

function SatBootcampSection() {
  return (
    <>
      <div className="relative w-full min-h-[420px] rounded-2xl bg-[#0e1f3e] overflow-hidden mb-12">
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
              <div className="flex flex-col gap-4 text-white">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-[#ca3433]" size={24} />
                    <span className="text-base md:text-lg">SUNDAYS 10AM - 2PM</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-[#ca3433]" size={24} />
                    <span className="text-base md:text-lg">2 WEEKS (4 HOURS PER SESSION)</span>
                  </div>
                </div>
                <div className="flex items-center">
                  <BookText className="mr-2 text-[#ca3433]" size={24} />
                  <span className="text-base md:text-lg">FULL PRACTICE EXAM INCLUDING ALL MATERIALS NEEDED</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 text-[#ca3433]" size={24} />
                  <span className="text-base md:text-lg">ENGLISH AND MATH</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#f7e0e0] rounded-2xl p-8 mb-12 border-4 border-[#ca3433]">
        <h3 className="text-3xl md:text-4xl font-bold text-[#0e1f3e] mb-4 text-center">Master the SAT in 2 Weeks</h3>
        <p className="text-lg md:text-xl text-[#0e1f3e] text-center">Intensive bootcamp designed to prepare you for upcoming SAT exams</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-8 shadow-lg">
          <div className="flex items-center mb-4">
            <Calendar className="text-[#ca3433] mr-3" size={32} />
            <h4 className="text-2xl font-bold text-[#0e1f3e]">MARCH BOOTCAMP</h4>
          </div>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>
                <strong>Bootcamp sessions:</strong>
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>March 1, 2026</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>March 8, 2026</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-8 shadow-lg">
          <div className="flex items-center mb-4">
            <Calendar className="text-[#ca3433] mr-3" size={32} />
            <h4 className="text-2xl font-bold text-[#0e1f3e]">APRIL BOOTCAMP</h4>
          </div>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>
                <strong>Bootcamp sessions:</strong>
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>April 19, 2026</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>April 26, 2026</span>
            </li>
          </ul>
        </div>

        <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-8 shadow-lg">
          <div className="flex items-center mb-4">
            <Calendar className="text-[#ca3433] mr-3" size={32} />
            <h4 className="text-2xl font-bold text-[#0e1f3e]">MAY BOOTCAMP</h4>
          </div>
          <ul className="space-y-3 text-lg text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>
                <strong>Bootcamp sessions:</strong>
              </span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>May 24, 2026</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>May 31, 2026</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
              <span>Choose from multiple dates</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-[#0e1f3e] rounded-2xl p-10 mb-12 text-white">
        <h3 className="text-3xl font-bold mb-6 text-center">What You&apos;ll Learn</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-[#ca3433] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">Practical Strategies</h4>
            <p className="text-[#f7e0e0]">Learn proven approaches to tackle SAT questions efficiently</p>
          </div>
          <div className="text-center">
            <div className="bg-[#ca3433] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">Practice Questions</h4>
            <p className="text-[#f7e0e0]">Work through real SAT-style problems with expert guidance</p>
          </div>
          <div className="text-center">
            <div className="bg-[#ca3433] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Clock size={32} />
            </div>
            <h4 className="font-bold text-xl mb-2">Time Management</h4>
            <p className="text-[#f7e0e0]">Master pacing and optimize your test-taking approach</p>
          </div>
        </div>
      </div>

      <div className="bg-[#f7e0e0] rounded-2xl p-10 border-2 border-[#ca3433]">
        <div className="flex items-center justify-center mb-6">
          <DollarSign className="text-[#ca3433]" size={40} />
          <h3 className="text-3xl font-bold text-[#0e1f3e]">Pricing Options</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-[#0e1f3e] hover:border-[#ca3433] transition-colors">
            <h4 className="text-2xl font-bold text-[#0e1f3e] mb-4">English Only</h4>
            <p className="text-5xl font-bold text-[#ca3433] mb-4">$199</p>
            <p className="text-gray-600 mb-4">Choose from multiple dates</p>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                <span>4-hour session</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Reading and Writing strategies</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Practice materials included</span>
              </li>
            </ul>
            <a
              href="https://buy.stripe.com/eVq14ge0A33Q9S978vdfG06"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-[#0e1f3e] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#ca3433] transition-colors"
            >
              Register - $199
            </a>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-[#0e1f3e] hover:border-[#ca3433] transition-colors">
            <h4 className="text-2xl font-bold text-[#0e1f3e] mb-4">Math Only</h4>
            <p className="text-5xl font-bold text-[#ca3433] mb-4">$199</p>
            <p className="text-gray-600 mb-4">Choose from multiple dates</p>
            <ul className="text-left space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                <span>4-hour session</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Math problem-solving techniques</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Practice materials included</span>
              </li>
            </ul>
            <a
              href="https://buy.stripe.com/eVq14ge0A33Q9S978vdfG06"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-[#0e1f3e] text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#ca3433] transition-colors"
            >
              Register - $199
            </a>
          </div>

          <div className="bg-[#ca3433] text-white rounded-xl p-6 shadow-lg text-center border-2 border-[#ca3433] transform md:scale-105">
            <div className="bg-[#0e1f3e] text-white text-sm font-bold py-1 px-3 rounded-full inline-block mb-2">BEST VALUE</div>
            <h4 className="text-2xl font-bold mb-4">Complete Bootcamp</h4>
            <p className="text-5xl font-bold mb-4">$350</p>
            <p className="text-[#f7e0e0] mb-4">Both Sessions</p>
            <ul className="text-left space-y-2">
              <li className="flex items-start">
                <CheckCircle className="text-white mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Full 8-hour program</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-white mr-2 flex-shrink-0 mt-1" size={16} />
                <span>English and Math coverage</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-white mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Complete test preparation</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-white mr-2 flex-shrink-0 mt-1" size={16} />
                <span>Save $48</span>
              </li>
            </ul>
            <a
              href="https://buy.stripe.com/4gM8wI1dO33Q0hz8czdfG05"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-white text-[#ca3433] font-semibold py-3 px-6 rounded-lg shadow hover:bg-[#f7e0e0] transition-colors"
            >
              Register Now - $350
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-2xl text-[#0e1f3e] font-semibold mb-4">Join our SAT Bootcamp in March, April, or May 2026</p>
        <p className="text-lg text-gray-600">Limited spots available. Register now to secure your place.</p>
      </div>
    </>
  );
}

function SatPrepSection() {
  const prepStripeLink = 'https://buy.stripe.com/6oU6oAg8IcEq1lDcsPdfG0c';

  return (
    <>
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <img
              src="/logo/exceed-logo.png"
              alt="Exceed Learning logo"
              className="h-10 md:h-12 w-auto"
            />
            <h3 className="text-3xl md:text-4xl font-bold text-[#0e1f3e] mt-2">State Exam Prep for Grades 3-8</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#schedule" className="bg-[#0e1f3e] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#1b2f57] transition-colors">Schedule</a>
            <a href="#pricing" className="bg-[#ca3433] text-white px-5 py-3 rounded-lg font-semibold hover:bg-[#ac2c2a] transition-colors">Pricing</a>
            <a href={prepStripeLink} target="_blank" rel="noopener noreferrer" className="bg-slate-100 text-slate-900 px-5 py-3 rounded-lg font-semibold hover:bg-slate-200 transition-colors">Enroll Now</a>
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6">
          <p className="text-xl font-semibold text-[#0e1f3e]">Coming Soon for 2027</p>
          <p className="text-slate-700 mt-2">Registration opens soon</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a id="enroll" href={prepStripeLink} target="_blank" rel="noopener noreferrer" className="bg-[#ca3433] text-white px-5 py-3 rounded-lg font-semibold">Enroll Now</a>
            <button id="schedule" type="button" className="bg-white border border-slate-300 text-slate-900 px-5 py-3 rounded-lg font-semibold">See Schedule</button>
            <button type="button" className="bg-white border border-slate-300 text-slate-900 px-5 py-3 rounded-lg font-semibold">2027 Program</button>
          </div>
          <p className="text-slate-600 mt-4">Stay tuned for dates and registration details</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#f7e0e0] border border-[#efc8c8] p-5">
            <p className="font-bold text-[#0e1f3e] mb-2">EXAM SEP 12</p>
            <p>Bootcamps June 29, Aug 9 and 16, Aug 30 and Sep 6</p>
          </div>
          <div className="rounded-xl bg-[#f7e0e0] border border-[#efc8c8] p-5">
            <p className="font-bold text-[#0e1f3e] mb-2">EXAM OCT 2</p>
            <p>Bootcamps Sep 20 and 27</p>
          </div>
          <div className="rounded-xl bg-[#f7e0e0] border border-[#efc8c8] p-5">
            <p className="font-bold text-[#0e1f3e] mb-2">EXAM NOV 7</p>
            <p>Bootcamps October 25 and Nov 1</p>
          </div>
          <div className="rounded-xl bg-[#f7e0e0] border border-[#efc8c8] p-5">
            <p className="font-bold text-[#0e1f3e] mb-2">EXAM DEC 5</p>
            <p>Bootcamps Nov 22 and 29</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-3xl font-bold text-[#0e1f3e] mb-6">Why Join Our Program?</h3>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Star className="text-[#ca3433]" />
              <h4 className="text-xl font-semibold">Boost Confidence</h4>
            </div>
            <p>Build test-taking skills and confidence through structured practice and expert guidance</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <GraduationCap className="text-[#ca3433]" />
              <h4 className="text-xl font-semibold">Expert Instructors</h4>
            </div>
            <p>Learn from experienced educators who understand state exam requirements inside and out</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="text-[#ca3433]" />
              <h4 className="text-xl font-semibold">Structured Reviews</h4>
            </div>
            <p>Comprehensive curriculum covering all essential topics and test-taking strategies</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="text-[#ca3433]" />
              <h4 className="text-xl font-semibold">Schedule by Grade</h4>
            </div>
            <p>Choose the sessions designed specifically for your grade level</p>
          </div>
        </div>
      </section>

      <section id="schedule" className="mb-10">
        <h3 className="text-3xl font-bold text-[#0e1f3e] mb-6">Schedule by Grade</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-2xl font-bold text-[#0e1f3e] mb-4">Grades 3-4</h4>
            <ul className="space-y-3">
              <li>
                <strong>ELA</strong><br />
                6 weeks<br />
                Mondays, 4-5 PM<br />
                Starts March 8
              </li>
              <li>
                <strong>Math</strong><br />
                8 weeks<br />
                Wednesdays, 4-5 PM<br />
                Starts March 11
              </li>
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-2xl font-bold text-[#0e1f3e] mb-4">Grades 5-6</h4>
            <ul className="space-y-3">
              <li>
                <strong>ELA</strong><br />
                6 weeks<br />
                Tuesdays, 4-5 PM<br />
                Starts March 9
              </li>
              <li>
                <strong>Math</strong><br />
                8 weeks<br />
                Thursdays, 4-5 PM<br />
                Starts March 12
              </li>
            </ul>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-2xl font-bold text-[#0e1f3e] mb-4">Grades 7-8</h4>
            <ul className="space-y-3">
              <li>
                <strong>ELA</strong><br />
                6 weeks<br />
                Mondays, 5-6 PM<br />
                Starts March 8
              </li>
              <li>
                <strong>Math</strong><br />
                8 weeks<br />
                Fridays, 5-6 PM<br />
                Starts March 13
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="pricing" className="mb-12">
        <h3 className="text-3xl font-bold text-[#0e1f3e] mb-2">Program Pricing</h3>
        <p className="text-slate-700 mb-6">Choose the package that works best for your student</p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-2xl font-bold text-[#0e1f3e]">ELA Only</h4>
            <p className="text-4xl font-bold text-[#ca3433] mt-3">$329</p>
            <p className="mt-2 text-slate-700">Complete ELA prep</p>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5 text-[#ca3433]" size={16} />Weekly ELA sessions</li>
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5 text-[#ca3433]" size={16} />Practice materials</li>
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5 text-[#ca3433]" size={16} />Progress tracking</li>
            </ul>
            <a href={prepStripeLink} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full rounded-lg bg-[#0e1f3e] text-white py-3 font-semibold text-center">Enroll in ELA</a>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <h4 className="text-2xl font-bold text-[#0e1f3e]">Math Only</h4>
            <p className="text-4xl font-bold text-[#ca3433] mt-3">$429</p>
            <p className="mt-2 text-slate-700">Complete Math prep</p>
            <ul className="mt-4 space-y-2 text-slate-700">
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5 text-[#ca3433]" size={16} />Weekly Math sessions</li>
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5 text-[#ca3433]" size={16} />Practice problems</li>
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5 text-[#ca3433]" size={16} />Progress tracking</li>
            </ul>
            <a href={prepStripeLink} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full rounded-lg bg-[#0e1f3e] text-white py-3 font-semibold text-center">Enroll in Math</a>
          </div>

          <div className="bg-[#ca3433] text-white border border-[#ca3433] rounded-xl p-6">
            <p className="inline-block rounded-full bg-white text-[#ca3433] text-xs font-bold px-3 py-1">BEST VALUE</p>
            <h4 className="text-2xl font-bold mt-3">Both Subjects</h4>
            <p className="text-4xl font-bold mt-3">$700</p>
            <p className="mt-2 text-[#f7e0e0]">Complete exam prep</p>
            <p className="mt-2 font-semibold">Save $58!</p>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5" size={16} />All ELA and Math sessions</li>
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5" size={16} />Complete materials</li>
              <li className="flex items-start"><CheckCircle className="mr-2 mt-0.5" size={16} />Priority support</li>
            </ul>
            <a href={prepStripeLink} target="_blank" rel="noopener noreferrer" className="mt-6 block w-full rounded-lg bg-white text-[#ca3433] py-3 font-semibold text-center">Enroll Both Subjects</a>
          </div>
        </div>
      </section>

      <section id="enroll" className="bg-[#0e1f3e] text-white rounded-2xl p-8 md:p-10 text-center">
        <h3 className="text-3xl md:text-4xl font-bold mb-3">Ready to Help Your Student Succeed?</h3>
        <p className="text-[#f7e0e0] text-lg mb-6">
          Don&apos;t wait until the last minute. Enroll now and give your student the best chance to excel.
        </p>
        <a href={prepStripeLink} target="_blank" rel="noopener noreferrer" className="inline-block bg-[#ca3433] hover:bg-[#ac2c2a] transition-colors px-8 py-4 rounded-xl text-white font-semibold text-lg">
          Enroll Now
        </a>
      </section>
    </>
  );
}

export default App;
