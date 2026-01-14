import { theme } from '../../theme';

const c = theme.colors;

const StatsCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => {
  const colorMap = {
    primary: { bg: `linear-gradient(135deg, ${c.primary[100]} 0%, ${c.primary[200]} 100%)`, icon: c.primary[700], accent: c.primary[600], shadow: c.primary[500] },
    blue: { bg: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)', icon: '#1565C0', accent: '#1976D2', shadow: '#2196F3' },
    purple: { bg: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)', icon: '#7B1FA2', accent: '#8E24AA', shadow: '#9C27B0' },
    amber: { bg: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)', icon: '#F57C00', accent: '#FF8F00', shadow: '#FFA726' },
    green: { bg: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)', icon: '#388E3C', accent: '#43A047', shadow: '#66BB6A' },
  };

  const colors = colorMap[color] || colorMap.primary;

  const styles = {
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      borderRadius: '20px',
      padding: '28px',
      border: `2px solid ${c.neutral[200]}`,
      boxShadow: '0 6px 24px rgba(21, 42, 17, 0.1)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
    },
    content: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '20px',
    },
    textContent: {
      flex: 1,
    },
    title: {
      fontSize: '13px',
      fontWeight: '700',
      color: c.neutral[600],
      marginBottom: '10px',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
    },
    value: {
      fontSize: '36px',
      fontWeight: '900',
      color: c.primary[900],
      lineHeight: 1.1,
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '14px',
      color: c.neutral[600],
      fontWeight: '500',
    },
    iconBox: {
      width: '64px',
      height: '64px',
      background: colors.bg,
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 16px ${colors.shadow}30`,
    },
    accent: {
      height: '6px',
      borderRadius: '3px',
      background: `linear-gradient(90deg, ${colors.accent} 0%, ${colors.shadow} 100%)`,
      boxShadow: `0 2px 8px ${colors.accent}40`,
    },
  };

  return (
    <div 
      style={styles.card}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(21, 42, 17, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 6px 24px rgba(21, 42, 17, 0.1)';
      }}
    >
      <div style={styles.content}>
        <div style={styles.textContent}>
          <p style={styles.title}>{title}</p>
          <p style={styles.value}>{value}</p>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>
        <div style={styles.iconBox}>
          <Icon size={30} color={colors.icon} strokeWidth={2.5} />
        </div>
      </div>
      <div style={styles.accent}></div>
    </div>
  );
};

export default StatsCard;
