import { theme } from '../../theme';

const c = theme.colors;

const ChartCard = ({ title, children }) => {
  const styles = {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '32px',
      border: `2px solid ${c.neutral[200]}`,
      boxShadow: '0 6px 24px rgba(21, 42, 17, 0.1)',
      transition: 'all 0.3s ease',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '28px',
      paddingBottom: '16px',
      borderBottom: `2px solid ${c.neutral[200]}`,
    },
    title: {
      fontSize: '20px',
      fontWeight: '800',
      color: c.primary[900],
      letterSpacing: '-0.5px',
    },
    chartContainer: {
      height: '340px',
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{title}</h3>
      </div>
      <div style={styles.chartContainer}>{children}</div>
    </div>
  );
};

export default ChartCard;
