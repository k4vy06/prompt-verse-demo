import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
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
  Menu,
  X,
  Plus,
  BarChart3,
  Download
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';

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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
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
};

const Home = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="container section" 
    style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px' }}
  >
    <div className="glass animate-float" style={{ padding: '8px 20px', color: 'var(--accent-gold)', fontSize: '0.9rem', fontWeight: '600', border: '1px solid var(--accent-gold-soft)' }}>
      COMING 2026: THE FUTURE OF EVENTS
    </div>
    <h1 style={{ fontSize: '4.5rem', lineHeight: '1', maxWidth: '900px' }}>
      Revolutionizing <span className="gradient-text">Physical Experiences</span> through Digital Flow.
    </h1>
    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
      The all-in-one platform for college fests, workshops, and hackathons. Paperless check-in, real-time updates, and instant engagement.
    </p>
    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        Get Your Pass <ArrowRight size={20} />
      </Link>
      <Link to="/schedule" className="btn-secondary">View Schedule</Link>
    </div>
    
    <div style={{ marginTop: '60px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px', width: '100%' }}>
      {[
        { icon: <QrCode />, title: 'In-Pass QR', desc: 'Instant pass generation on sign-up.' },
        { icon: <Bell />, title: 'Real-time News', desc: 'No refresh needed for live updates.' },
        { icon: <CheckCircle2 />, title: 'Fast Check-in', desc: 'Scan and entry in under 2 seconds.' }
      ].map((feat, i) => (
        <div key={i} className="glass" style={{ padding: '30px', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ color: 'var(--accent-gold)' }}>{feat.icon}</div>
          <h3>{feat.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{feat.desc}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', college: '' });
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const ticket = db.saveRegistration(form);
    setSuccess(ticket);
  };

  if (success) {
    return (
      <div className="container section" style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass" style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', width: '100%', display: 'flex', flexDirection: 'column', gap: '25px' }}>
          <div style={{ background: '#22c55e20', color: '#22c55e', padding: '15px', borderRadius: '50%', width: 'fit-content', margin: '0 auto' }}>
            <CheckCircle2 size={40} />
          </div>
          <h2 className="gradient-text">Registration Complete!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome to EventFlow, {success.name}. Here is your unique access pass.</p>
          <div style={{ background: '#fff', padding: '20px', borderRadius: '15px', margin: '10px auto', width: 'fit-content' }}>
            <QRCode value={success.id} size={180} />
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            ID: <span style={{ color: '#fff', fontWeight: 'bold' }}>{success.id.toUpperCase()}</span>
          </div>
          <button onClick={() => window.print()} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
            <Download size={20} /> Download PDF Pass
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container section" style={{ display: 'flex', justifyContent: 'center' }}>
      <div className="glass" style={{ padding: '40px', maxWidth: '500px', width: '100%' }}>
        <h2 style={{ marginBottom: '30px' }}>Attendee <span className="gradient-text">Registration</span></h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Name</label>
            <input required type="text" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email Address</label>
            <input required type="email" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} 
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>College/Organization</label>
            <input required type="text" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} 
              value={form.college} onChange={e => setForm({...form, college: e.target.value})} />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>Confirm Registration</button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [regs, setRegs] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnn, setNewAnn] = useState('');

  useEffect(() => {
    setRegs(db.getRegistrations());
    setAnnouncements(db.getAnnouncements());
  }, []);

  const handlePost = () => {
    if (!newAnn) return;
    db.saveAnnouncement(newAnn);
    setAnnouncements(db.getAnnouncements());
    setNewAnn('');
  };

  const attendedCount = regs.filter(r => r.attended).length;

  return (
    <div className="container section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h2>Organiser <span className="gradient-text">Control Center</span></h2>
        <Link to="/admin/scan" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Maximize2 size={20} /> Launch Scanner
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Registered', val: regs.length, icon: <User /> },
          { label: 'Attended', val: attendedCount, icon: <CheckCircle2 /> },
          { label: 'Attendance Rate', val: regs.length ? Math.round((attendedCount/regs.length)*100) + '%' : '0%', icon: <BarChart3 /> },
          { label: 'Live Announcements', val: announcements.length, icon: <Bell /> }
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ color: 'var(--accent-gold)' }}>{s.icon}</div>
            <div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.label}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{s.val}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Live Feedback & Announcements</h3>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
            <input type="text" placeholder="Pulse Update (e.g. Lunch is served!)" style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px', borderRadius: '10px', color: '#fff' }} 
              value={newAnn} onChange={e => setNewAnn(e.target.value)} />
            <button onClick={handlePost} className="btn-secondary"><Plus /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {announcements.map(a => (
              <div key={a.id} className="glass" style={{ padding: '15px', background: 'rgba(212,175,55,0.05)', borderColor: 'rgba(212,175,55,0.2)' }}>
                <div style={{ color: 'var(--accent-gold)', fontSize: '0.7rem' }}>{a.time}</div>
                <div>{a.msg}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass" style={{ padding: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Attendee List</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {regs.map(r => (
              <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '10px' }}>
                <div>
                  <div style={{ fontSize: '0.9rem' }}>{r.name}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{r.college}</div>
                </div>
                {r.attended ? <CheckCircle2 size={16} color="#22c55e" /> : <div style={{ width: 16 }} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Scanner = () => {
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render((decodedText) => {
      const user = db.markAttendance(decodedText);
      if (user) {
        setResult(user);
        setTimeout(() => setResult(null), 3000);
      }
    }, (error) => {
      // quiet fail
    });
    return () => scanner.clear();
  }, []);

  return (
    <div className="container section" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ marginBottom: '40px' }}>Entry <span className="gradient-text">Verification</span></h2>
      <div className="glass" style={{ padding: '20px', width: '100%', maxWidth: '500px', overflow: 'hidden' }}>
        <div id="reader" style={{ border: 'none' }}></div>
      </div>
      
      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'fixed', bottom: '40px', background: '#22c55e', color: '#000', padding: '20px 40px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 20px 50px rgba(34,197,94,0.4)' }}
          >
            <CheckCircle2 /> ACCESS GRANTED: {result.name.toUpperCase()}
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => navigate('/admin')} className="btn-secondary" style={{ marginTop: '40px' }}>Back to Dashboard</button>
    </div>
  );
};

const Schedule = () => (
  <div className="container section">
    <h2 style={{ marginBottom: '50px', textAlign: 'center' }}>Event <span className="gradient-text">Timeline</span></h2>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '20px', top: '0', bottom: '0', width: '2px', background: 'var(--glass-border)' }}></div>
      {[
        { time: '09:00 AM', title: 'Opening Keynote', desc: 'Future of Agentic AI in Engineering.' },
        { time: '11:30 AM', title: 'Workshop: React Flow', desc: 'Building high-fidelity node systems.' },
        { time: '02:00 PM', title: 'Lunch & Networking', desc: 'Exclusive buffet at the Sky Lounge.' },
        { time: '04:00 PM', title: 'Grand Finale', desc: 'Award ceremony and closing party.' }
      ].map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '40px', paddingLeft: '50px', position: 'relative' }}>
          <div style={{ position: 'absolute', left: '16px', top: '0', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-gold)', boxShadow: '0 0 15px var(--accent-gold)' }}></div>
          <div style={{ color: 'var(--accent-gold)', fontWeight: 'bold', width: '100px' }}>{item.time}</div>
          <div className="glass" style={{ padding: '20px', flex: 1 }}>
            <h4 style={{ marginBottom: '8px' }}>{item.title}</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- MAIN APP ---

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/scan" element={<Scanner />} />
      </Routes>
      <footer style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem', borderTop: '1px solid var(--glass-border)', marginTop: 'auto' }}>
        © 2026 EventFlow. Engineered for Prompt Wars. 
      </footer>
    </Router>
  );
};

export default App;
