import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  PackagePlus, 
  Package,
  Scan,
  ShoppingCart, 
  FileText, 
  TrendingUp,
  LogOut,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';
import { theme } from '../../theme';

const c = theme.colors;

const Sidebar = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/add-product', icon: PackagePlus, label: 'Add Product' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/scan-product', icon: Scan, label: 'Scan Product' },
    { path: '/create-order', icon: ShoppingCart, label: 'Create Order' },
    { path: '/orders', icon: FileText, label: 'Orders' },
    { path: '/sales', icon: TrendingUp, label: 'Sales History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const employeeNavItems = [
    { path: '/employee-dashboard', icon: Users, label: 'Employee Dashboard' },
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : employeeNavItems;

  const styles = {
    sidebar: {
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100%',
      width: '260px',
      backgroundColor: c.neutral.white,
      borderRight: `1px solid ${c.neutral[200]}`,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
    },
    header: {
      padding: '20px',
      borderBottom: `1px solid ${c.neutral[100]}`,
    },
    logoRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    logoBox: {
      width: '40px',
      height: '40px',
      background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 2px 8px ${c.primary[600]}40`,
    },
    logoText: {
      fontSize: '18px',
      fontWeight: '700',
      color: c.primary[900],
      letterSpacing: '-0.3px',
    },
    logoSubtext: {
      fontSize: '11px',
      color: c.neutral[500],
      marginTop: '1px',
    },
    nav: {
      flex: 1,
      padding: '16px 12px',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
    },
    navLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '500',
      color: c.neutral[600],
      transition: 'all 0.15s ease',
    },
    navLinkActive: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '8px',
      textDecoration: 'none',
      fontSize: '13px',
      fontWeight: '600',
      backgroundColor: c.primary[600],
      color: c.neutral.white,
    },
    footer: {
      padding: '12px',
      borderTop: `1px solid ${c.neutral[100]}`,
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '10px 12px',
      backgroundColor: c.neutral[50],
      borderRadius: '10px',
      marginBottom: '10px',
    },
    userAvatar: {
      width: '36px',
      height: '36px',
      background: `linear-gradient(135deg, ${c.primary[500]} 0%, ${c.primary[700]} 100%)`,
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: c.neutral.white,
      fontSize: '14px',
      fontWeight: '700',
    },
    userInfo: {
      flex: 1,
      minWidth: 0,
    },
    userName: {
      fontSize: '13px',
      fontWeight: '600',
      color: c.primary[900],
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    userRole: {
      fontSize: '11px',
      color: c.neutral[500],
      textTransform: 'capitalize',
    },
    logoutBtn: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '8px',
      border: `1px solid ${c.neutral[200]}`,
      backgroundColor: c.neutral.white,
      color: c.neutral[600],
      fontSize: '13px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
    },
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <div style={styles.logoBox}>
            <LayoutDashboard size={20} color={c.neutral.white} />
          </div>
          <div>
            <div style={styles.logoText}>Windscapes</div>
            <div style={styles.logoSubtext}>ERP System</div>
          </div>
        </div>
      </div>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => isActive ? styles.navLinkActive : styles.navLink}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={styles.footer}>
        {user && (
          <div style={styles.userCard}>
            <div style={styles.userAvatar}>{getInitials(user.username)}</div>
            <div style={styles.userInfo}>
              <div style={styles.userName}>{user.username}</div>
              <div style={styles.userRole}>{user.role}</div>
            </div>
            <ChevronRight size={16} color={c.neutral[400]} />
          </div>
        )}
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
