import { Calendar, Clock, BookOpen, DollarSign, CheckCircle } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-[#0e1f3e] text-white py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">SAT Bootcamp</h1>
          <p className="text-xl text-[#f7e0e0]">Strategy Class for December 6 Exam</p>
        </div>
      </header>

      <div className="relative w-full h-[500px] bg-[#0e1f3e] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt="Students taking SAT exam"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0e1f3e]/90 to-[#0e1f3e]/50 flex items-center">
          <div className="max-w-6xl mx-auto px-4 w-full">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-bold text-white mb-4">
                Master the SAT
              </h2>
              <p className="text-2xl text-[#f7e0e0] mb-6">
                2-Week Intensive Bootcamp for December 6 Exam
              </p>
              <div className="flex items-center space-x-6 text-white">
                <div className="flex items-center">
                  <Calendar className="mr-2 text-[#ca3433]" size={24} />
                  <span className="text-lg">Nov 23 & 30</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 text-[#ca3433]" size={24} />
                  <span className="text-lg">10 AM - 2 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-[#f7e0e0] rounded-2xl p-8 mb-12 border-4 border-[#ca3433]">
          <h2 className="text-4xl font-bold text-[#0e1f3e] mb-6 text-center">
            Master the SAT in 2 Weeks
          </h2>
          <p className="text-xl text-[#0e1f3e] text-center mb-8">
            Intensive bootcamp designed to prepare you for the December 6 exam
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <Calendar className="text-[#ca3433] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[#0e1f3e]">Schedule</h3>
            </div>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Duration:</strong> 2 weeks</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Sessions:</strong> November 23 & November 30</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Day:</strong> Sundays</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Time:</strong> 10:00 AM - 2:00 PM</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border-2 border-[#0e1f3e] rounded-xl p-8 shadow-lg">
            <div className="flex items-center mb-4">
              <BookOpen className="text-[#ca3433] mr-3" size={32} />
              <h3 className="text-2xl font-bold text-[#0e1f3e]">Structure</h3>
            </div>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Session Length:</strong> 4 hours each</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Day 1:</strong> English (Nov 23)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Day 2:</strong> Math (Nov 30)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={20} />
                <span><strong>Format:</strong> Intensive practice & strategy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-[#0e1f3e] rounded-2xl p-10 mb-12 text-white">
          <h3 className="text-3xl font-bold mb-6 text-center">What You'll Learn</h3>
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
              <p className="text-gray-600 mb-4">November 23</p>
              <ul className="text-left space-y-2 text-gray-700">
                <li className="flex items-start">
                  <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                  <span>4-hour session</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                  <span>Reading & Writing strategies</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="text-[#ca3433] mr-2 flex-shrink-0 mt-1" size={16} />
                  <span>Practice materials included</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg text-center border-2 border-[#0e1f3e] hover:border-[#ca3433] transition-colors">
              <h4 className="text-2xl font-bold text-[#0e1f3e] mb-4">Math Only</h4>
              <p className="text-5xl font-bold text-[#ca3433] mb-4">$199</p>
              <p className="text-gray-600 mb-4">November 30</p>
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
            </div>

            <div className="bg-[#ca3433] text-white rounded-xl p-6 shadow-lg text-center border-2 border-[#ca3433] transform md:scale-105">
              <div className="bg-[#0e1f3e] text-white text-sm font-bold py-1 px-3 rounded-full inline-block mb-2">
                BEST VALUE
              </div>
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
                  <span>English & Math coverage</span>
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
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-2xl text-[#0e1f3e] font-semibold mb-4">
            Prepare for the December 6 SAT Exam
          </p>
          <p className="text-lg text-gray-600">
            Limited spots available. Register now to secure your place.
          </p>
        </div>
      </main>

      <footer className="bg-[#0e1f3e] text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#f7e0e0]">SAT Bootcamp & Strategy Class</p>
          <p className="text-sm mt-2 opacity-75">Your path to SAT success starts here</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
