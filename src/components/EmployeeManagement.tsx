import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldAlert, 
  Shield, 
  Briefcase, 
  CheckCircle, 
  XCircle,
  Clock,
  Mail,
  User,
  Plus,
  Key
} from 'lucide-react';
import { Employee } from '../types';

interface EmployeeManagementProps {
  currentUser: Employee | null;
  isDarkMode: boolean;
  triggerToast: (msg: string) => void;
}

export default function EmployeeManagement({
  currentUser,
  isDarkMode,
  triggerToast
}: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Viewer');
  const [empPassword, setEmpPassword] = useState('');
  const [empIsAvailable, setEmpIsAvailable] = useState(true);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data || []);
      }
    } catch (e) {
      console.error(e);
      triggerToast('Failed to load employee directory.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === 'Admin') {
      fetchEmployees();
    }
  }, [currentUser]);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !empEmail) {
      triggerToast('Please fill out all mandatory fields.');
      return;
    }

    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: empName,
          email: empEmail.trim().toLowerCase(),
          role: empRole,
          password: empPassword || empEmail.trim().toLowerCase(), // fallback to username/email
          isAvailable: empIsAvailable
        })
      });

      if (res.ok) {
        triggerToast(`Successfully registered ${empName}!`);
        setIsFormOpen(false);
        setEmpName('');
        setEmpEmail('');
        setEmpRole('Viewer');
        setEmpPassword('');
        setEmpIsAvailable(true);
        fetchEmployees();
      } else {
        const err = await res.json();
        triggerToast(err.error || 'Failed to register employee.');
      }
    } catch (err: any) {
      triggerToast(`Network error: ${err.message}`);
    }
  };

  const handleToggleAvailability = async (emp: Employee) => {
    try {
      const res = await fetch(`/api/employees/${emp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !emp.isAvailable })
      });
      if (res.ok) {
        triggerToast(`Updated status for ${emp.name}`);
        fetchEmployees();
      }
    } catch (e) {
      console.error(e);
      triggerToast('Failed to toggle duty availability.');
    }
  };

  const handleDeleteEmployee = async (empId: string, name: string) => {
    if (currentUser?.id === empId) {
      triggerToast('You cannot delete your own profile!');
      return;
    }

    if (!confirm(`Are you absolutely sure you want to delete the user "${name}"? This is permanent.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/employees/${empId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        triggerToast(`Removed employee ${name}`);
        fetchEmployees();
      } else {
        triggerToast('Failed to delete user.');
      }
    } catch (e) {
      console.error(e);
      triggerToast('Delete request error.');
    }
  };

  const labelClass = isDarkMode ? 'text-white' : 'text-gray-900';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const cardBg = isDarkMode ? 'bg-[#1A1A1A] border-gray-800' : 'bg-white border-gray-200 shadow-sm';

  // Strict role-gate rendering if a Viewer/Editor gets here
  if (currentUser?.role !== 'Admin') {
    return (
      <div className={`rounded-2xl border-[3px] border-[#E63946] p-8 text-center max-w-lg mx-auto shadow-[4px_4px_0px_0px_black] ${cardBg}`} id="access-denied-bento">
        <ShieldAlert className="h-12 w-12 text-[#E63946] mx-auto stroke-[2.5]" />
        <h3 className={`text-lg font-black uppercase tracking-tight mt-4 ${labelClass}`}>
          Access Privilege Restricted
        </h3>
        <p className={`text-xs mt-2 leading-relaxed font-semibold ${textMuted}`}>
          Only the main Bole Administrator role can access, audit, or edit staff credentials, employee shifts, and platform roles. Your current role is set to <strong className="text-[#E63946] font-black">{currentUser?.role || 'Viewer'}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left" id="employees-manager-section">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-black uppercase tracking-tight ${labelClass}`}>Employee Directory</h2>
          <p className={`text-xs ${textMuted}`}>Manage Bole flagship staff, duty availability, and access levels.</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border-2 border-black bg-[#E63946] text-white px-4 py-2.5 text-xs font-black uppercase tracking-wider shadow-[2.5px_2.5px_0px_0px_black] active:translate-y-px active:shadow-none transition-all cursor-pointer"
            id="add-staff-launcher"
          >
            <UserPlus className="h-4 w-4" />
            <span>Onboard New Staff</span>
          </button>
        )}
      </div>

      {/* Grid statistics metrics */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <div className={`rounded-xl border-[2.5px] border-black p-4 shadow-[2px_2px_0px_0px_black] ${cardBg}`}>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black">Total Staff</span>
          <h4 className={`text-xl font-black font-mono mt-1 ${labelClass}`}>{employees.length}</h4>
        </div>
        <div className={`rounded-xl border-[2.5px] border-black p-4 shadow-[2px_2px_0px_0px_black] ${cardBg}`}>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black">Administrators</span>
          <h4 className={`text-xl font-black font-mono mt-1 text-[#E63946]`}>
            {employees.filter(e => e.role === 'Admin').length}
          </h4>
        </div>
        <div className={`rounded-xl border-[2.5px] border-black p-4 shadow-[2px_2px_0px_0px_black] ${cardBg}`}>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black">Editors</span>
          <h4 className={`text-xl font-black font-mono mt-1 text-[#F4A261]`}>
            {employees.filter(e => e.role === 'Editor').length}
          </h4>
        </div>
        <div className={`rounded-xl border-[2.5px] border-black p-4 shadow-[2px_2px_0px_0px_black] ${cardBg}`}>
          <span className="text-[9px] font-mono text-gray-400 uppercase font-black">On Active Duty</span>
          <h4 className={`text-xl font-black font-mono mt-1 text-emerald-500`}>
            {employees.filter(e => e.isAvailable).length}
          </h4>
        </div>
      </div>

      {/* Addition Form Drawer */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            className="rounded-2xl border-[3.5px] border-black bg-white p-6 shadow-[5px_5px_0px_0px_rgba(230,57,70,0.55)] text-black"
            id="employee-form-shell"
          >
            <div className="flex items-center justify-between border-b-2 border-dashed border-gray-200 pb-3 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#E63946] flex items-center gap-1.5">
                <UserPlus className="h-4 w-4" />
                Onboard New Staff Member
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-black"
                title="Cancel"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samson Kebede"
                      value={empName}
                      onChange={(e) => setEmpName(e.target.value)}
                      className="w-full rounded-xl border-2 border-black pl-11 pr-3 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Username/Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. samson"
                      value={empEmail}
                      onChange={(e) => setEmpEmail(e.target.value)}
                      className="w-full rounded-xl border-2 border-black pl-11 pr-3 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Initial Password *</label>
                  <div className="relative">
                    <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
                    <input
                      type="password"
                      placeholder="Defaults to username"
                      value={empPassword}
                      onChange={(e) => setEmpPassword(e.target.value)}
                      className="w-full rounded-xl border-2 border-black pl-11 pr-3 py-2.5 text-xs font-bold text-black outline-none focus:border-[#E63946]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">Staff Role *</label>
                  <select
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value as any)}
                    className="w-full rounded-xl border-2 border-black px-3.5 py-2.5 text-xs font-black text-black outline-none focus:border-[#E63946] appearance-none bg-white"
                  >
                    <option value="Admin">Admin (Full Write Access)</option>
                    <option value="Editor">Editor (Catalog Modifier)</option>
                    <option value="Viewer">Viewer (Read-Only)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-black mb-1">On-Duty Status *</label>
                  <select
                    value={empIsAvailable ? 'true' : 'false'}
                    onChange={(e) => setEmpIsAvailable(e.target.value === 'true')}
                    className="w-full rounded-xl border-2 border-black px-3.5 py-2.5 text-xs font-black text-black outline-none focus:border-[#E63946] appearance-none bg-white"
                  >
                    <option value="true">Active on Floor</option>
                    <option value="false">Off-Duty / Sick Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-xl border-2 border-black bg-black text-white px-4 py-2 text-xs font-black uppercase transition-all hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl border-2 border-black bg-[#E63946] text-white px-5 py-2 text-xs font-black uppercase shadow-[2.5px_2.5px_0px_0px_black]"
                >
                  Register On-Duty
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Directory Table Grid */}
      <div className={`overflow-x-auto rounded-2xl border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_black] ${cardBg}`}>
        {isLoading ? (
          <div className="py-12 text-center animate-pulse text-[#E63946] font-black uppercase tracking-widest text-xs">
            Fetching employee registry...
          </div>
        ) : employees.length === 0 ? (
          <div className="py-12 text-center text-gray-500 font-bold text-xs uppercase">
            No active staff member registers found.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-400/25 text-10px font-black uppercase tracking-wider text-gray-500 font-mono">
                <th className="px-4 py-3">Employee Name</th>
                <th className="px-4 py-3">Username/Email</th>
                <th className="px-4 py-3">Authority Level</th>
                <th className="px-4 py-3">Operational Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-400/10 text-xs font-semibold">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-500/5">
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black text-white font-black uppercase">
                        {emp.name.charAt(0)}
                      </div>
                      <span className={`font-black uppercase tracking-tight ${labelClass}`}>{emp.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-gray-500 font-bold">{emp.email}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-[9px] font-black uppercase border select-none ${
                      emp.role === 'Admin' 
                        ? 'bg-red-500/15 border-red-500/30 text-red-500' 
                        : emp.role === 'Editor'
                          ? 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500'
                    }`}>
                      <Shield className="h-2.5 w-2.5 fill-current" />
                      {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      onClick={() => handleToggleAvailability(emp)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border select-none transition-all cursor-pointer ${
                        emp.isAvailable 
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' 
                          : 'bg-red-500/15 border-red-500/30 text-red-500'
                      }`}
                      title="Toggle Floor Active Status"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${emp.isAvailable ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'}`} />
                      {emp.isAvailable ? 'Active on Floor' : 'Off Duty'}
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                      disabled={currentUser?.id === emp.id}
                      className="rounded bg-red-500/10 text-red-500 border border-red-500/20 px-2.5 py-1.5 text-[9px] font-black uppercase tracking-wider hover:bg-red-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Terminate employee connection"
                    >
                      Remove Log
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
