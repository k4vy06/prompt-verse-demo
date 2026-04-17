import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Calendar, 
  Bell, 
  User, 
  LayoutDashboard, 
  Maximize2, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  BarChart3,
  Download,
  AlertCircle
} from 'lucide-react';
import * as QRCode from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';
const QRCodeCanvas = QRCode.QRCodeCanvas || QRCode.default || QRCode;

// --- MOCK DATABASE HELPER ---
const db = {
  getRegistrations: () => JSON.parse(localStorage.getItem('ef_registrations') || '[]'),
  saveRegistration: (data) => {
    const prev = db.getRegistrations();
    const next = [...prev, { ...data, id: Math.random().toString(36).substr(2, 9), timestamp: new Date().toISOString(), attended: false }];
    localStorage.setItem('ef_registrations', JSON.stringify(next));
    return next[next.length - 1];
  },
  getAnnouncements: () => JSON.parse(localStorage.getItem('ef_announcements') || '[]'),
  saveAnnouncement: (msg) => {
    const prev = db.getAnnouncements();
    const next = [{ id: Date.now(), msg, time: new Date().toLocaleTimeString() }, ...prev];
    localStorage.setItem('ef_announcements', JSON.stringify(next));
  },
  markAttendance: (id) => {
    const regs = db.getRegistrations();
    const idx = regs.findIndex(r => r.id === id);
    if (idx !== -1) {
      regs[idx].attended = true;
      localStorage.setItem('ef_registrations', JSON.stringify(regs));
      return regs[idx];
    }
    return null;
  }
};

// --- COMPONENTS ---

const Navbar = () => (
  <nav className="glass" style={{ margin: '20px', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: '20px', zIndex: 1000 }}>
    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ background: 'var(--accent-gold)', width: '35px', height: '35px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Calendar size={20} color="#000" />
      </div>
      <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>Event<span style={{ color: 'var(--accent-gold)' }}>Flow</span></span>
    </Link>
    <div className="nav-links" style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
      <Link to="/schedule" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Schedule</Link>
      <Link to="/admin" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontWeight: '500' }}>Admin</Link>
      <Link to="/register" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.9rem' }}>Register Now</Link>
    </div>
  </nav>
);

const Home = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container section" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}>
    <div className="glass animate-float" style={{ padding: '8px 20px', color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: '600' }}>
      PROMPT WARS 2026 EVENT PORTAL
    </div>
    <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', lineHeight: '1', maxWidth: '900px' }}>
      Future proofing <span className="gradient-text">Physical Events</span>
    </h1>
    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
      A seamless experience for attendees and organisers. Digital passes, live updates, and effortless entry.
    </p>
    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Get Pass <ArrowRight size={20} />
      </Link>
      <Link to="/schedule" className="btn-secondary">View Schedule</Link>
    </div>
    <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px', width: '100%' }}>
      {[
        { icon: <QrCode />, title: 'Digital Pass', desc: 'Secure QR generation for every attendee.' },
        { icon: <Bell />, title: 'Instant News', desc: 'Stay updated with real-time event feeds.' },
        { icon: <CheckCircle2 />, title: 'Smart Entry', desc: 'Verification in less than a second.' }
      ].map((feat, i) => (
        <div key={i} className="glass" style={{ padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ color: 'var(--accent-gold)' }}>{feat.icon}</div>
          <h3>{feat.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{feat.desc}</p>
        </div>
      ))}
    </div>

    {/* PROMPT WARS TIMELINE SECTION */}
    <div style={{ marginTop: '100px', width: '100%', textAlign: 'left' }}>
      <h2 style={{ marginBottom: '40px' }}><span className="gradient-text">How it works:</span> The 14-day cycle</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        {[
          { phase: 'Phase 1', title: 'Challenge Release', desc: 'New challenge every two weeks on Monday. Real-world industry problems.' },
          { phase: 'Phase 2', title: 'Building Phase', desc: 'Use your creativity and vibe coding with Google Antigravity.' },
          { phase: 'Phase 3', title: 'Submission', desc: 'By Day 13: Technical code + Narrative blog/social posts.' },
          { phase: 'Phase 4', title: 'Announcement', desc: 'Day 14: Expert review, move up leaderboard and earn credits.' }
        ].map((p, i) => (
          <div key={i} className="glass" style={{ padding: '25px', position: 'relative', borderTop: '4px solid var(--accent-gold)' }}>
            <div style={{ color: 'var(--accent-gold)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '10px' }}>{p.phase}</div>
            <h4 style={{ marginBottom: '10px' }}>{p.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', college: '' });
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(db.saveRegistration(form));
  };

  if (success) {
    return (
      <div className="container section" style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <CheckCircle2 size={50} color="#22c55e" style={{ margin: '0 auto' }} />
          <h2 className="gradient-text">Registration Success!</h2>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', margin: '10px auto', width: 'fit-content' }}>
            <QRCodeCanvas value={success.id} size={180} level="H" />
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>ID: <strong>{success.id.toUpperCase()}</strong></div>
          <button onClick={() => window.print()} className="btn-primary">Download Pass</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '40px', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ marginBottom: '30px' }}>Join the <span className="gradient-text">Flow</span></h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input required placeholder="Name" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <input required placeholder="Email" type="email" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          <input required placeholder="Organization" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} value={form.college} onChange={e => setForm({...form, college: e.target.value})} />
          <button type="submit" className="btn-primary">Register Now</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [regs, setRegs] = useState([]);
  const [anns, setAnns] = useState([]);
  const [txt, setTxt] = useState('');

  useEffect(() => {
    setRegs(db.getRegistrations());
    setAnns(db.getAnnouncements());
  }, []);

  const post = () => {
    if (!txt) return;
    db.saveAnnouncement(txt);
    setAnns(db.getAnnouncements());
    setTxt('');
  };

  return (
    <div className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <h2>Organiser <span className="gradient-text">Dashboard</span></h2>
        <Link to="/admin/scan" className="btn-primary">Open Scanner</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Registered</div>
          <div style={{ fontSize: '2rem' }}>{regs.length}</div>
        </div>
        <div className="glass" style={{ padding: '20px' }}>
          <div style={{ color: 'var(--text-secondary)' }}>Checked-in</div>
          <div style={{ fontSize: '2rem' }}>{regs.filter(r => r.attended).length}</div>
        </div>
      </div>
      <div className="glass" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '20px' }}>Attendee Records</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {regs.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No registrations yet.</p> : 
            regs.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.college} • {r.email}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {r.attended ? (
                  <span style={{ color: '#22c55e', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '4px', background: '#22c55e10', padding: '4px 8px', borderRadius: '4px' }}>
                    <CheckCircle2 size={12} /> SCANNED
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '4px' }}>PENDING</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="glass" style={{ padding: '30px', marginTop: '20px' }}>
        <h3>Broadcast Update</h3>
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <input placeholder="Update message..." style={{ flex: 1, background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} value={txt} onChange={e => setTxt(e.target.value)} />
          <button onClick={post} className="btn-primary"><Plus /></button>
        </div>
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {anns.map(a => (
            <div key={a.id} className="glass" style={{ padding: '15px' }}>
              <small style={{ color: 'var(--accent-gold)' }}>{a.time}</small>
              <div>{a.msg}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Scanner = () => {
  const [stat, setStat] = useState(null);
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render((val) => {
      const u = db.markAttendance(val);
      if (u) { setStat(u); setTimeout(() => setStat(null), 3000); }
    }, () => {});
    return () => scanner.clear();
  }, []);

  return (
    <div className="container section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="glass" style={{ padding: '20px', width: '100%', maxWidth: '500px' }}>
        <div id="reader"></div>
      </div>
      <AnimatePresence>
        {stat && <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ opacity: 0 }} style={{ position: 'fixed', bottom: '40px', background: '#22c55e', color: '#000', padding: '15px 30px', borderRadius: '15px', fontWeight: 'bold' }}>
          CHECKED IN: {stat.name}
        </motion.div>}
      </AnimatePresence>
      <Link to="/admin" className="btn-secondary" style={{ marginTop: '20px' }}>Back</Link>
    </div>
  );
};

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/scan" element={<Scanner />} />
      <Route path="/schedule" element={
        <div className="container section"><h2>Event <span className="gradient-text">Timeline</span></h2><p>Loading sessions...</p></div>
      } />
    </Routes>
  </Router>
);

export default App;
