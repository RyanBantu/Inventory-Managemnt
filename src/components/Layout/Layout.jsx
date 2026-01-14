import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { theme } from '../../theme';

const c = theme.colors;

const Layout = () => {
  const styles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${c.neutral[50]} 0%, ${c.primary[50]}30 50%, ${c.neutral[100]} 100%)`,
    },
    main: {
      marginLeft: '260px',
      minHeight: '100vh',
    },
    content: {
      padding: '24px',
      maxWidth: '1600px',
      margin: '0 auto',
    },
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <main style={styles.main}>
        <div style={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
