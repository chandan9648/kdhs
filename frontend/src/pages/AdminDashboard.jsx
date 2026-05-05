import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import client from '../api/client';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Reports from '../components/Reports';
import ProfileSettings from '../components/ProfileSettings';

const emptyForm = {
  name: '', email: '', password: '', class: '10A', rollNo: '',
  subject: '', qualifications: '', studentId: '', relation: 'Guardian',
  phoneNo: '', experience: '',
};

/* ─── Reusable Edit Modal ─── */
const EditModal = ({ title, onClose, onSave, children }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '12px',
  }}>
    <div style={{
      background: '#fff', borderRadius: 14, padding: '20px', width: '100%',
      maxWidth: 560, boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#1e293b' }}>{title}</h2>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#94a3b8',
        }}>✕</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {children}
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
        <button onClick={onClose} style={{
          padding: '8px 20px', borderRadius: 8, border: '1px solid #cbd5e1',
          background: '#f8fafc', cursor: 'pointer', fontWeight: 600, color: '#64748b',
        }}>Cancel</button>
        <button onClick={onSave} style={{
          padding: '8px 24px', borderRadius: 8, border: 'none',
          background: 'linear-gradient(135deg,#3b82f6,#6366f1)', color: '#fff',
          cursor: 'pointer', fontWeight: 700, fontSize: 15,
        }}>💾 Save Changes</button>
      </div>
    </div>
  </div>
);

const inputStyle = {
  padding: '9px 12px', border: '1px solid #e2e8f0', borderRadius: 8,
  fontSize: 14, outline: 'none', width: '100%', boxSizing: 'border-box',
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Edit state
  const [editTarget, setEditTarget] = useState(null); // { type, record }
  const [editForm, setEditForm] = useState({});

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    else if (activeTab === 'teachers') fetchTeachers();
    else if (activeTab === 'parents') { fetchParents(); fetchStudents(); }
  }, [activeTab]);

  const fetchStudents = async () => {
    try { setLoading(true); const r = await client.get('/api/admin/students'); setStudents(r.data.students); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const fetchTeachers = async () => {
    try { setLoading(true); const r = await client.get('/api/admin/teachers'); setTeachers(r.data.teachers); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };
  const fetchParents = async () => {
    try { setLoading(true); const r = await client.get('/api/admin/parents'); setParents(r.data.parents); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  };

  /* ── Add handlers ── */
  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      await client.post('/api/admin/student', {
        name: formData.name, email: formData.email, password: formData.password,
        class: formData.class, rollNo: parseInt(formData.rollNo) || 0,
      });
      toast.success('Student added successfully!');
      setFormData(emptyForm); setShowAddForm(false); fetchStudents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add student'); }
  };
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    try {
      await client.post('/api/admin/teacher', {
        name: formData.name, email: formData.email, password: formData.password,
        subject: formData.subject, qualifications: formData.qualifications,
      });
      toast.success('Teacher added successfully!');
      setFormData(emptyForm); setShowAddForm(false); fetchTeachers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add teacher'); }
  };
  const handleAddParent = async (e) => {
    e.preventDefault();
    try {
      await client.post('/api/admin/parent', {
        name: formData.name, email: formData.email, password: formData.password,
        studentId: formData.studentId, relation: formData.relation, phoneNo: formData.phoneNo,
      });
      toast.success('Parent added successfully!');
      setFormData(emptyForm); setShowAddForm(false); fetchParents();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to add parent'); }
  };

  /* ── Delete handlers ── */
  const handleDelete = async (type, id) => {
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    const toastId = toast(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: 10, fontWeight: 600 }}>Delete this {label}?</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={async () => {
                closeToast();
                try {
                  await client.delete(`/api/admin/${type}/${id}`);
                  toast.success(`${label} deleted successfully!`);
                  if (type === 'student') fetchStudents();
                  else if (type === 'teacher') fetchTeachers();
                  else fetchParents();
                } catch { toast.error(`Error deleting ${label}`); }
              }}
              style={{
                padding: '6px 14px', background: '#ef4444', color: '#fff',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 700,
              }}
            >Yes, Delete</button>
            <button
              onClick={closeToast}
              style={{
                padding: '6px 14px', background: '#e2e8f0', color: '#334155',
                border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
              }}
            >Cancel</button>
          </div>
        </div>
      ),
      { autoClose: false, closeButton: false, position: 'top-center' }
    );
    void toastId;
  };

  /* ── Open Edit Modal ── */
  const openEdit = (type, record) => {
    setEditTarget({ type, id: record._id });
    if (type === 'student') {
      setEditForm({
        name: record.userId?.name || '',
        email: record.userId?.email || '',
        class: record.class || '10A',
        rollNo: record.rollNo || '',
        phoneNo: record.phoneNo || '',
        parentName: record.parentName || '',
        parentPhone: record.parentPhone || '',
        address: record.address || '',
      });
    } else if (type === 'teacher') {
      setEditForm({
        name: record.userId?.name || '',
        email: record.userId?.email || '',
        subject: record.subject || '',
        qualifications: record.qualifications || '',
        phoneNo: record.phoneNo || '',
        experience: record.experience || '',
      });
    } else if (type === 'parent') {
      setEditForm({
        name: record.userId?.name || '',
        email: record.userId?.email || '',
        relation: record.relation || 'Guardian',
        phoneNo: record.phoneNo || '',
        studentId: record.studentId?._id || '',
      });
    }
  };

  /* ── Save Edit ── */
  const handleSaveEdit = async () => {
    const { type, id } = editTarget;
    const label = type.charAt(0).toUpperCase() + type.slice(1);
    try {
      const payload = { ...editForm };
      if (type === 'student' && payload.rollNo) payload.rollNo = parseInt(payload.rollNo);
      await client.put(`/api/admin/${type}/${id}`, payload);
      toast.success(`${label} updated successfully!`);
      setEditTarget(null);
      if (type === 'student') fetchStudents();
      else if (type === 'teacher') fetchTeachers();
      else fetchParents();
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
  };

  const ef = (key) => ({ value: editForm[key] ?? '', onChange: (e) => setEditForm({ ...editForm, [key]: e.target.value }), style: inputStyle });

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar role="admin" isOpen={sidebarOpen} onTabChange={setActiveTab} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />

        <div className="flex-1 overflow-auto p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">🧑‍💼 Admin Dashboard</h1>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
              <div className="flex border-b overflow-x-auto scrollbar-none">
                {['students','teachers','parents','reports'].map(tab => (
                  <button key={tab} onClick={() => { setActiveTab(tab); setShowAddForm(false); }}
                    className={`flex-shrink-0 flex-1 min-w-[70px] py-2.5 px-1 text-xs sm:text-sm font-semibold whitespace-nowrap ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}>
                    {tab === 'students' ? '👨‍🎓 Students' : tab === 'teachers' ? '👩‍🏫 Teachers' : tab === 'parents' ? '👨‍👩‍👧 Parents' : '📊 Reports'}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Students Tab ── */}
            {activeTab === 'students' && (
              <div>
                <button onClick={() => setShowAddForm(!showAddForm)}
                  className="mb-6 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600">
                  {showAddForm ? '✖️ Cancel' : '➕ Add Student'}
                </button>
                {showAddForm && (
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
                    <form onSubmit={handleAddStudent}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input style={inputStyle} placeholder="Name" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} required />
                        <input style={inputStyle} type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})} required />
                        <input style={inputStyle} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData,password:e.target.value})} required />
                        <select style={inputStyle} value={formData.class} onChange={e => setFormData({...formData,class:e.target.value})}>
                          {['10A','10B','12A','12B'].map(c => <option key={c}>{c}</option>)}
                        </select>
                        <input style={inputStyle} type="number" placeholder="Roll No" value={formData.rollNo} onChange={e => setFormData({...formData,rollNo:e.target.value})} required />
                      </div>
                      <button type="submit" className="mt-4 bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600">✅ Add Student</button>
                    </form>
                  </div>
                )}
                {loading ? <div className="flex items-center justify-center py-12"><div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" /></div> : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px]">
                      <thead className="bg-gray-200">
                        <tr>
                          {['Name','Email','Class','Roll No','Phone','Actions'].map(h => <th key={h} className="px-3 py-2 text-left text-sm">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(s => (
                          <tr key={s._id} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm">{s.userId?.name}</td>
                            <td className="px-3 py-2 text-sm">{s.userId?.email}</td>
                            <td className="px-3 py-2 text-sm">{s.class}</td>
                            <td className="px-3 py-2 text-sm">{s.rollNo}</td>
                            <td className="px-3 py-2 text-sm">{s.phoneNo || '—'}</td>
                            <td className="px-3 py-2 flex gap-2">
                              <button onClick={() => openEdit('student', s)} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">✏️ Edit</button>
                              <button onClick={() => handleDelete('student', s._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">🗑️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Teachers Tab ── */}
            {activeTab === 'teachers' && (
              <div>
                <button onClick={() => setShowAddForm(!showAddForm)}
                  className="mb-6 bg-green-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-green-600">
                  {showAddForm ? '✖️ Cancel' : '➕ Add Teacher'}
                </button>
                {showAddForm && (
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
                    <form onSubmit={handleAddTeacher}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input style={inputStyle} placeholder="Name" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} required />
                        <input style={inputStyle} type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})} required />
                        <input style={inputStyle} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData,password:e.target.value})} required />
                        <input style={inputStyle} placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData,subject:e.target.value})} required />
                        <input style={inputStyle} placeholder="Qualifications" value={formData.qualifications} onChange={e => setFormData({...formData,qualifications:e.target.value})} />
                      </div>
                      <button type="submit" className="mt-4 bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600">✅ Add Teacher</button>
                    </form>
                  </div>
                )}
                {loading ? <div className="flex items-center justify-center py-12"><div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" /></div> : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px]">
                      <thead className="bg-gray-200">
                        <tr>
                          {['Name','Email','Subject','Qualifications','Phone','Actions'].map(h => <th key={h} className="px-3 py-2 text-left text-sm">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {teachers.map(t => (
                          <tr key={t._id} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm">{t.userId?.name}</td>
                            <td className="px-3 py-2 text-sm">{t.userId?.email}</td>
                            <td className="px-3 py-2 text-sm">{t.subject}</td>
                            <td className="px-3 py-2 text-sm">{t.qualifications || '—'}</td>
                            <td className="px-3 py-2 text-sm">{t.phoneNo || '—'}</td>
                            <td className="px-3 py-2 flex gap-2">
                              <button onClick={() => openEdit('teacher', t)} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">✏️ Edit</button>
                              <button onClick={() => handleDelete('teacher', t._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">🗑️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── Parents Tab ── */}
            {activeTab === 'parents' && (
              <div>
                <button onClick={() => setShowAddForm(!showAddForm)}
                  className="mb-6 bg-purple-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-600">
                  {showAddForm ? '✖️ Cancel' : '➕ Add Parent'}
                </button>
                {showAddForm && (
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
                    <form onSubmit={handleAddParent}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <input style={inputStyle} placeholder="Parent Name" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})} required />
                        <input style={inputStyle} type="email" placeholder="Parent Email" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})} required />
                        <input style={inputStyle} type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData,password:e.target.value})} required />
                        <input
                          style={inputStyle}
                          type="tel"
                          placeholder="Phone No (10 digits)"
                          value={formData.phoneNo}
                          maxLength={10}
                          pattern="[0-9]{10}"
                          onChange={e => setFormData({...formData, phoneNo: e.target.value.replace(/\D/g, '').slice(0, 10)})}
                        />
                        <select style={inputStyle} value={formData.relation} onChange={e => setFormData({...formData,relation:e.target.value})}>
                          {['Father','Mother','Guardian'].map(r => <option key={r}>{r}</option>)}
                        </select>
                        <select style={inputStyle} value={formData.studentId} onChange={e => setFormData({...formData,studentId:e.target.value})} required>
                          <option value="">-- Select Child --</option>
                          {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} – {s.class} (Roll {s.rollNo})</option>)}
                        </select>
                      </div>
                      <button type="submit" className="mt-4 bg-purple-500 text-white font-semibold px-6 py-2 rounded-lg hover:bg-purple-600">✅ Add Parent</button>
                    </form>
                  </div>
                )}
                {loading ? <div className="flex items-center justify-center py-12"><div className="w-10 h-10 rounded-full border-4 border-gray-200 border-t-blue-500 animate-spin" /></div> : (
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-200">
                        <tr>
                          {['Parent Name','Email','Relation','Phone','Child','Class','Actions'].map(h => <th key={h} className="px-3 py-2 text-left text-sm">{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {parents.map(p => (
                          <tr key={p._id} className="border-t hover:bg-gray-50">
                            <td className="px-3 py-2 text-sm">{p.userId?.name}</td>
                            <td className="px-3 py-2 text-sm">{p.userId?.email}</td>
                            <td className="px-3 py-2 text-sm"><span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">{p.relation}</span></td>
                            <td className="px-3 py-2 text-sm">{p.phoneNo || '—'}</td>
                            <td className="px-3 py-2 text-sm">{p.studentId?.userId?.name || '—'}</td>
                            <td className="px-3 py-2 text-sm">{p.studentId?.class || '—'}</td>
                            <td className="px-3 py-2 flex gap-2">
                              <button onClick={() => openEdit('parent', p)} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">✏️ Edit</button>
                              <button onClick={() => handleDelete('parent', p._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">🗑️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reports' && <Reports />}
            {activeTab === 'more' && <ProfileSettings />}
          </div>
        </div>
      </div>

      {/* ── Edit Modal: Student ── */}
      {editTarget?.type === 'student' && (
        <EditModal title="✏️ Edit Student" onClose={() => setEditTarget(null)} onSave={handleSaveEdit}>
          <input {...ef('name')} placeholder="Full Name" />
          <input {...ef('email')} type="email" placeholder="Email" />
          <select {...ef('class')}>
            {['10A','10B','12A','12B'].map(c => <option key={c}>{c}</option>)}
          </select>
          <input {...ef('rollNo')} type="number" placeholder="Roll No" />
          <input
            {...ef('phoneNo')}
            type="tel"
            placeholder="Phone No (10 digits)"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={e => setEditForm({ ...editForm, phoneNo: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          />
          <input {...ef('parentName')} placeholder="Parent Name" />
          <input
            {...ef('parentPhone')}
            type="tel"
            placeholder="Parent Phone (10 digits)"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={e => setEditForm({ ...editForm, parentPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          />
          <input {...ef('address')} placeholder="Address" style={{ ...inputStyle, gridColumn: 'span 2' }} />
        </EditModal>
      )}

      {/* ── Edit Modal: Teacher ── */}
      {editTarget?.type === 'teacher' && (
        <EditModal title="✏️ Edit Teacher" onClose={() => setEditTarget(null)} onSave={handleSaveEdit}>
          <input {...ef('name')} placeholder="Full Name" />
          <input {...ef('email')} type="email" placeholder="Email" />
          <input {...ef('subject')} placeholder="Subject" />
          <input {...ef('qualifications')} placeholder="Qualifications" />
          <input
            {...ef('phoneNo')}
            type="tel"
            placeholder="Phone No (10 digits)"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={e => setEditForm({ ...editForm, phoneNo: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          />
          <input {...ef('experience')} type="number" placeholder="Experience (years)" />
        </EditModal>
      )}

      {/* ── Edit Modal: Parent ── */}
      {editTarget?.type === 'parent' && (
        <EditModal title="✏️ Edit Parent" onClose={() => setEditTarget(null)} onSave={handleSaveEdit}>
          <input {...ef('name')} placeholder="Full Name" />
          <input {...ef('email')} type="email" placeholder="Email" />
          <select {...ef('relation')}>
            {['Father','Mother','Guardian'].map(r => <option key={r}>{r}</option>)}
          </select>
          <input
            {...ef('phoneNo')}
            type="tel"
            placeholder="Phone No (10 digits)"
            maxLength={10}
            pattern="[0-9]{10}"
            onChange={e => setEditForm({ ...editForm, phoneNo: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          />
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', marginBottom: 4, fontSize: 13, color: '#64748b', fontWeight: 600 }}>Linked Student</label>
            <select value={editForm.studentId} onChange={e => setEditForm({...editForm, studentId: e.target.value})} style={inputStyle}>
              <option value="">-- Select Child --</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.userId?.name} – {s.class} (Roll {s.rollNo})</option>)}
            </select>
          </div>
        </EditModal>
      )}
    </div>
  );
};

export default AdminDashboard;
