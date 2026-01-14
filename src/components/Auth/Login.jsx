import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { UserCircle, Lock, LogIn, Shield } from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedRole || !username || !password) {
      alert('Please fill in all fields');
      return;
    }
    login({ role: selectedRole, username });
    if (selectedRole === 'admin') {
      navigate('/');
    } else {
      navigate('/employee-dashboard');
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${c.primary[900]} 0%, ${c.primary[700]} 50%, ${c.primary[600]} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    },
    card: {
      width: '100%',
      maxWidth: '440px',
      backgroundColor: 'rgba(255, 255, 255, 0.98)',
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      padding: '40px',
      boxShadow: '0 24px 60px rgba(21, 42, 17, 0.4)',
      border: `1px solid rgba(255, 255, 255, 0.5)`,
    },
    logoSection: {
      textAlign: 'center',
      marginBottom: '32px',
    },
    logo: {
      width: '64px',
      height: '64px',
      background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px',
      boxShadow: `0 8px 24px ${c.primary[600]}40`,
    },
    title: {
      fontSize: '24px',
      fontWeight: '800',
      color: c.primary[900],
      marginBottom: '4px',
    },
    subtitle: {
      fontSize: '13px',
      color: c.primary[600],
      fontWeight: '500',
    },
    roleGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '24px',
    },
    roleBtn: (isActive) => ({
      padding: '16px 12px',
      borderRadius: '12px',
      border: `2px solid ${isActive ? c.primary[600] : c.neutral[200]}`,
      background: isActive ? `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)` : c.neutral.white,
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      boxShadow: isActive ? `0 4px 16px ${c.primary[600]}40` : 'none',
    }),
    roleText: (isActive) => ({
      fontSize: '13px',
      fontWeight: '700',
      color: isActive ? c.neutral.white : c.neutral[700],
    }),
    inputWrapper: {
      position: 'relative',
      marginBottom: '16px',
    },
    inputIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
    },
    input: {
      width: '100%',
      padding: '14px 16px 14px 44px',
      border: `2px solid ${c.neutral[200]}`,
      borderRadius: '12px',
      fontSize: '14px',
      color: c.neutral[900],
      backgroundColor: c.neutral.white,
      outline: 'none',
      transition: 'all 0.2s ease',
    },
    submitBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '14px 24px',
      borderRadius: '12px',
      border: 'none',
      background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[700]} 100%)`,
      color: c.neutral.white,
      fontSize: '15px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '8px',
      boxShadow: `0 4px 16px ${c.primary[600]}50`,
      transition: 'all 0.2s ease',
    },
    demoTag: {
      marginTop: '20px',
      padding: '10px',
      backgroundColor: c.primary[50],
      borderRadius: '10px',
      border: `1px solid ${c.primary[200]}`,
      textAlign: 'center',
      fontSize: '11px',
      color: c.primary[700],
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoSection}>
          <div style={styles.logo}>
            <Shield size={32} color={c.neutral.white} strokeWidth={2.5} />
          </div>
          <h1 style={styles.title}>Windscapes ERP</h1>
          <p style={styles.subtitle}>Inventory Management System</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={styles.roleGrid}>
            <button
              type="button"
              onClick={() => setSelectedRole('admin')}
              style={styles.roleBtn(selectedRole === 'admin')}
            >
              <UserCircle size={28} color={selectedRole === 'admin' ? c.neutral.white : c.primary[600]} strokeWidth={2} />
              <div style={styles.roleText(selectedRole === 'admin')}>Admin</div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('employee')}
              style={styles.roleBtn(selectedRole === 'employee')}
            >
              <UserCircle size={28} color={selectedRole === 'employee' ? c.neutral.white : c.primary[600]} strokeWidth={2} />
              <div style={styles.roleText(selectedRole === 'employee')}>Employee</div>
            </button>
          </div>

          <div style={styles.inputWrapper}>
            <div style={styles.inputIcon}>
              <UserCircle size={18} color={c.primary[600]} />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <div style={styles.inputIcon}>
              <Lock size={18} color={c.primary[600]} />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={styles.input}
              required
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            <LogIn size={18} />
            Login
          </button>

          <div style={styles.demoTag}>
            Demo Mode • Use any credentials to login
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
