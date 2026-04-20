'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Search, LogOut, Users, CheckCircle, Clock, XCircle,
  TrendingUp, BarChart2, ClipboardList, Home, Menu, X, ChevronRight,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Registration {
  _id: string;
  studentName: string;
  email: string;
  phone: string;
  subject: string;
  courseName: string;
  paymentMethod: string;
  zelleReference?: string;
  status: string;
  notes?: string;
  selectedDate?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  cancelled: number;
  bySubject: Array<{ _id: string; count: number }>;
  byCourse: Array<{ _id: string; count: number }>;
}

type ActiveTab = 'registrations' | 'analytics';

const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
  { id: 'registrations', label: 'Registrations', icon: <ClipboardList size={20} /> },
  { id: 'analytics',     label: 'Analytics',     icon: <BarChart2 size={20} /> },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('registrations');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (subjectFilter) params.set('subject', subjectFilter);
      if (search) params.set('search', search);
      const [regRes, statsRes] = await Promise.all([
        fetch(`/api/registrations?${params}`),
        fetch('/api/admin/stats'),
      ]);
      if (regRes.ok)   setRegistrations((await regRes.json()).registrations);
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, subjectFilter, search]);

  useEffect(() => { loadData(); }, [loadData]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) loadData();
  }

  async function deleteReg(id: string) {
    if (!confirm('Delete this registration?')) return;
    const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
    if (res.ok) { setSelectedReg(null); loadData(); }
  }

  // ─── Sidebar content (shared between desktop + mobile drawer) ─────────────
  function SidebarContent() {
    return (
      <>
        <div className="px-5 py-5 border-b border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo/exceed-logo.png" alt="Exceed Learning" className="h-9 w-auto mb-2" />
          <p className="text-xs font-bold uppercase tracking-widest text-[#f7e0e0]/50">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id
                  ? 'bg-[#ca3433] text-white shadow-lg'
                  : 'text-[#f7e0e0]/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#f7e0e0]/70 hover:bg-white/10 hover:text-white transition-all"
          >
            <Home size={20} />
            Return to Home
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#f7e0e0]/70 hover:bg-[#ca3433] hover:text-white transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-[#0e1f3e] text-white fixed left-0 top-0 z-30">
        <SidebarContent />
      </aside>

      {/* ── Mobile drawer overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 bg-[#0e1f3e] text-white flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <span className="font-bold text-white text-base">Menu</span>
              <button onClick={() => setSidebarOpen(false)} className="text-white/70 hover:text-white p-1">
                <X size={22} />
              </button>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto">
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* ── Main content ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen w-0">

        {/* Mobile top bar */}
        <header className="lg:hidden bg-[#0e1f3e] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-lg">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/80 hover:text-white p-1 -ml-1"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-base">
            {activeTab === 'registrations' ? 'Registrations' : 'Analytics'}
          </span>
          <button onClick={handleLogout} className="text-white/80 hover:text-white p-1 -mr-1" aria-label="Logout">
            <LogOut size={20} />
          </button>
        </header>

        {/* Desktop page header */}
        <div className="hidden lg:block bg-white border-b border-slate-200 px-6 py-5">
          <h1 className="text-2xl font-bold text-[#0e1f3e]">
            {activeTab === 'registrations' ? 'Registrations' : 'Analytics'}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {activeTab === 'registrations'
              ? 'View and manage all SAT program enrollments'
              : 'Insights and trends — coming soon'}
          </p>
        </div>

        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <style jsx global>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-in {
              animation: fadeIn 0.5s ease-out forwards;
            }
          `}</style>
          {activeTab === 'registrations' && (
            <RegistrationsTab
              stats={stats}
              registrations={registrations}
              loading={loading}
              search={search} setSearch={setSearch}
              statusFilter={statusFilter} setStatusFilter={setStatusFilter}
              subjectFilter={subjectFilter} setSubjectFilter={setSubjectFilter}
              selectedReg={selectedReg} setSelectedReg={setSelectedReg}
              updateStatus={updateStatus}
              deleteReg={deleteReg}
            />
          )}
          {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
        </main>
      </div>
    </div>
  );
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function RegistrationsTab({
  stats, registrations, loading,
  search, setSearch,
  statusFilter, setStatusFilter,
  subjectFilter, setSubjectFilter,
  selectedReg, setSelectedReg,
  updateStatus, deleteReg
}: any) {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Stats Overview ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard label="Total" count={stats?.total} icon={<Users className="text-blue-600" />} color="bg-blue-50" />
        <StatCard label="Pending" count={stats?.pending} icon={<Clock className="text-amber-600" />} color="bg-amber-50" />
        <StatCard label="Confirmed" count={stats?.confirmed} icon={<CheckCircle className="text-emerald-600" />} color="bg-emerald-50" />
        <StatCard label="Cancelled" count={stats?.cancelled} icon={<XCircle className="text-rose-600" />} color="bg-rose-50" />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search students, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0e1f3e]/10 focus:border-[#0e1f3e] transition-all outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0e1f3e]/10 focus:border-[#0e1f3e] transition-all outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0e1f3e]/10 focus:border-[#0e1f3e] transition-all outline-none cursor-pointer"
          >
            <option value="">All Subjects</option>
            <option value="English">English</option>
            <option value="Math">Math</option>
            <option value="Both">Both</option>
          </select>
        </div>
      </div>

      {/* ── Registration List ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-slate-200 border-t-[#ca3433] rounded-full animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Syncing data...</p>
          </div>
        ) : registrations.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-slate-300" size={32} />
            </div>
            <p className="text-slate-500 font-medium">No registrations found matching your criteria</p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Student</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Course / Subject</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map((reg: any) => (
                    <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{reg.studentName}</div>
                        <div className="text-xs text-slate-500">{reg.email}</div>
                        {reg.selectedDate && (
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5 italic">
                            Date: {reg.selectedDate}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-[#0e1f3e]">{reg.courseName}</div>
                        <div className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase mt-1">
                          {reg.subject}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={reg.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="p-2 text-slate-400 hover:text-[#0e1f3e] hover:bg-slate-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-slate-100">
              {registrations.map((reg: any) => (
                <div key={reg._id} className="p-4 active:bg-slate-50 transition-colors" onClick={() => setSelectedReg(reg)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-[#0e1f3e]">{reg.studentName}</div>
                      <div className="text-xs text-slate-500 lowercase">{reg.subject} · {reg.paymentMethod.toUpperCase()}</div>
                    </div>
                    <StatusBadge status={reg.status} />
                  </div>
                  {reg.selectedDate && <div className="text-xs text-[#ca3433] font-bold mb-1 italic">Date: {reg.selectedDate}</div>}
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>{new Date(reg.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center text-[#ca3433] font-bold">Details <ChevronRight size={14} /></span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Registration Details Side Panel/Modal ── */}
      {selectedReg && (
        <RegistrationDetails
          reg={selectedReg}
          onClose={() => setSelectedReg(null)}
          updateStatus={updateStatus}
          deleteReg={deleteReg}
        />
      )}
    </div>
  );
}

function AnalyticsTab({ stats }: { stats: any }) {
  if (!stats) return <div className="p-12 text-center text-slate-500">Loading metrics...</div>;

  const subjectCounts = stats.bySubject?.reduce((acc: any, curr: any) => {
    acc[curr._id] = curr.count;
    return acc;
  }, { English: 0, Math: 0, Both: 0 });

  const maxCourseCount = Math.max(...(stats.byCourse?.map((c: any) => c.count) || [1]));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subject Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-[#ca3433]/10 p-2 rounded-xl">
              <TrendingUp className="text-[#ca3433]" size={20} />
            </div>
            <h3 className="font-bold text-[#0e1f3e]">Enrollment by Subject</h3>
          </div>
          <div className="space-y-5">
            {['English', 'Math', 'Both'].map((sub) => {
              const count = subjectCounts[sub] || 0;
              const pct = (count / (stats.total || 1)) * 100;
              return (
                <div key={sub} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-slate-700">{sub}</span>
                    <span className="text-slate-500 font-medium">{count} registrations</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        sub === 'English' ? 'bg-blue-500' : sub === 'Math' ? 'bg-amber-500' : 'bg-[#ca3433]'
                      }`}
                      style={{ width: `${Math.max(pct, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Courses (CSS Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-50 p-2 rounded-xl">
              <BarChart2 className="text-indigo-600" size={20} />
            </div>
            <h3 className="font-bold text-[#0e1f3e]">Popular Programs</h3>
          </div>
          <div className="flex items-end justify-between h-48 gap-2 px-2 mt-auto">
            {stats.byCourse?.map((course: any, idx: number) => {
              const heightPct = (course.count / maxCourseCount) * 100;
              return (
                <div key={course._id} className="flex flex-col items-center flex-1 group relative">
                  <div
                    className="w-full bg-slate-100 rounded-t-lg transition-all duration-700 hover:bg-slate-200 relative"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 bg-[#0e1f3e] rounded-t-lg transition-all duration-700 delay-100 opacity-80 group-hover:opacity-100"
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0e1f3e] text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {course.count} enrollments
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 mt-3 truncate w-full text-center group-hover:text-[#0e1f3e]">
                    {course._id.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatCard({ label, count, icon, color }: { label: string, count?: number, icon: any, color: string }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</p>
          <h3 className="text-2xl sm:text-3xl font-black text-[#0e1f3e]">{count ?? '—'}</h3>
        </div>
        <div className={`p-2.5 sm:p-3 rounded-xl ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: any = {
    pending:   { bg: 'bg-amber-50',  text: 'text-amber-700', border: 'border-amber-200',  label: 'Pending' },
    confirmed: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Confirmed' },
    cancelled: { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',    label: 'Cancelled' },
  };
  const config = configs[status] || configs.pending;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
      <span className="w-1 h-1 rounded-full bg-current mr-1.5" />
      {config.label}
    </span>
  );
}

function RegistrationDetails({ reg, onClose, updateStatus, deleteReg }: { reg: any, onClose: any, updateStatus: any, deleteReg: any }) {
  const [updating, setUpdating] = useState(false);

  async function handleStatusUpdate(s: string) {
    setUpdating(true);
    await updateStatus(reg._id, s);
    setUpdating(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-[#0e1f3e]/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        {/* Header */}
        <div className="bg-[#0e1f3e] text-white p-6 sm:p-8 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white/50 uppercase tracking-widest mb-1">Registration Details</div>
            <h2 className="text-xl sm:text-2xl font-black">{reg.studentName}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
            <DetailItem label="Email Address" value={reg.email} />
            <DetailItem label="Phone Number" value={reg.phone} />
            <DetailItem label="Selected Course" value={reg.courseName || 'SAT Bootcamp'} />
            <DetailItem label="Subject" value={reg.subject} />
            <DetailItem label="Payment Method" value={reg.paymentMethod.toUpperCase()} />
            {reg.selectedDate && <DetailItem label="Program Date" value={reg.selectedDate} />}
            {reg.zelleReference && <DetailItem label="Zelle Ref #" value={reg.zelleReference} />}
            <div className="sm:col-span-2">
              <DetailItem label="Registration Date" value={new Date(reg.createdAt).toLocaleString()} />
            </div>
            {reg.notes && (
              <div className="sm:col-span-2">
                <DetailItem label="Admin Notes" value={reg.notes} />
              </div>
            )}
          </div>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Registration Status</div>
            <div className="flex flex-wrap gap-3">
              <button
                disabled={updating || reg.status === 'confirmed'}
                onClick={() => handleStatusUpdate('confirmed')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-lg shadow-emerald-600/20"
              >
                <CheckCircle size={18} /> Confirm Enrollment
              </button>
              <button
                disabled={updating || reg.status === 'cancelled'}
                onClick={() => handleStatusUpdate('cancelled')}
                className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-all"
              >
                <XCircle size={18} /> Cancel
              </button>
              <button
                disabled={updating}
                onClick={async () => { if (confirm('Delete this registration permanently?')) { await deleteReg(reg._id); onClose(); } }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm text-rose-600 border-2 border-rose-100 hover:bg-rose-50 transition-all mt-2"
              >
                Delete Registration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">{label}</div>
      <div className="text-sm font-bold text-[#0e1f3e] break-words">{value}</div>
    </div>
  );
}
