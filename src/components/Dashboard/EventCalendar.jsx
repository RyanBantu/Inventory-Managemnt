import { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addHours } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { Plus, X, Calendar as CalendarIcon, Clock, ChevronDown } from 'lucide-react';
import { theme } from '../../theme';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const c = theme.colors;

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const EventCalendar = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Team Meeting',
      start: new Date(),
      end: addHours(new Date(), 1),
    },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: format(new Date(), 'HH:mm'),
  });
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showViewDropdown, setShowViewDropdown] = useState(false);

  const viewOptions = [
    { value: 'day', label: 'Day View' },
    { value: 'week', label: 'Week View' },
    { value: 'month', label: 'Month View' },
  ];

  const handleAddEvent = useCallback(() => {
    if (!newEvent.title.trim()) return;

    const [hours, minutes] = newEvent.time.split(':').map(Number);
    const eventDate = new Date(newEvent.date);
    eventDate.setHours(hours, minutes, 0, 0);

    const event = {
      id: Date.now(),
      title: newEvent.title,
      start: eventDate,
      end: addHours(eventDate, 1),
    };

    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'HH:mm'),
    });
    setShowModal(false);
  }, [newEvent]);

  const handleSelectSlot = useCallback(({ start }) => {
    setNewEvent({
      title: '',
      date: format(start, 'yyyy-MM-dd'),
      time: format(start, 'HH:mm'),
    });
    setShowModal(true);
  }, []);

  const handleNavigate = useCallback((date) => {
    setCurrentDate(date);
  }, []);

  const handleViewChange = useCallback((view) => {
    setCurrentView(view);
    setShowViewDropdown(false);
  }, []);

  const eventStyleGetter = useCallback((event) => ({
    style: {
      backgroundColor: c.primary[600],
      borderRadius: '6px',
      border: 'none',
      color: c.neutral.white,
      fontSize: '12px',
      fontWeight: '600',
      padding: '2px 6px',
      boxShadow: `0 2px 4px ${c.primary[600]}40`,
    },
  }), []);

  const { calendarStyles } = useMemo(() => ({
    calendarStyles: `
      .rbc-calendar {
        font-family: ${theme.fonts.body};
        background: transparent;
      }
      .rbc-header {
        padding: 12px 8px;
        font-weight: 600;
        font-size: 13px;
        color: ${c.primary[800]};
        background: ${c.primary[50]};
        border-bottom: 1px solid ${c.neutral[200]} !important;
      }
      .rbc-header + .rbc-header {
        border-left: 1px solid ${c.neutral[200]} !important;
      }
      .rbc-month-view {
        border: 1px solid ${c.neutral[200]};
        border-radius: 12px;
        overflow: hidden;
      }
      .rbc-day-bg {
        transition: background-color 0.2s ease;
      }
      .rbc-day-bg:hover {
        background-color: ${c.primary[50]};
      }
      .rbc-off-range-bg {
        background-color: ${c.neutral[50]};
      }
      .rbc-today {
        background-color: ${c.primary[100]} !important;
      }
      .rbc-date-cell {
        padding: 8px;
        font-size: 13px;
        color: ${c.neutral[700]};
      }
      .rbc-date-cell.rbc-now {
        font-weight: 700;
        color: ${c.primary[700]};
      }
      .rbc-event {
        transition: transform 0.15s ease, box-shadow 0.15s ease;
      }
      .rbc-event:hover {
        transform: scale(1.02);
        box-shadow: 0 4px 8px ${c.primary[600]}50 !important;
      }
      .rbc-event-content {
        font-size: 11px;
      }
      .rbc-toolbar {
        margin-bottom: 16px;
        flex-wrap: wrap;
        gap: 8px;
      }
      .rbc-toolbar button {
        color: ${c.primary[700]};
        border: 1px solid ${c.neutral[200]};
        background: ${c.neutral.white};
        padding: 8px 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 500;
        transition: all 0.2s ease;
        cursor: pointer;
      }
      .rbc-toolbar button:hover {
        background: ${c.primary[50]};
        border-color: ${c.primary[300]};
      }
      .rbc-toolbar button.rbc-active {
        background: ${c.primary[600]};
        color: ${c.neutral.white};
        border-color: ${c.primary[600]};
      }
      .rbc-btn-group {
        display: flex;
        gap: 4px;
      }
      .rbc-btn-group button {
        border-radius: 8px !important;
      }
      .rbc-time-view {
        border: 1px solid ${c.neutral[200]};
        border-radius: 12px;
        overflow: hidden;
      }
      .rbc-time-header-content {
        border-left: 1px solid ${c.neutral[200]} !important;
      }
      .rbc-time-slot {
        font-size: 12px;
        color: ${c.neutral[500]};
      }
      .rbc-current-time-indicator {
        background-color: ${c.primary[500]};
        height: 2px;
      }
      .rbc-day-slot .rbc-time-slot {
        border-top: 1px solid ${c.neutral[100]} !important;
      }
      .rbc-timeslot-group {
        border-bottom: 1px solid ${c.neutral[200]} !important;
      }
      .rbc-time-content {
        border-top: 1px solid ${c.neutral[200]} !important;
      }
      .rbc-time-gutter {
        background: ${c.neutral[50]};
      }
      .rbc-allday-cell {
        display: none;
      }
      .rbc-time-header.rbc-overflowing {
        border-right: none !important;
      }
      .rbc-show-more {
        color: ${c.primary[600]};
        font-weight: 600;
        font-size: 11px;
      }
      .rbc-month-row {
        border-bottom: 1px solid ${c.neutral[200]} !important;
      }
      .rbc-day-bg + .rbc-day-bg {
        border-left: 1px solid ${c.neutral[200]} !important;
      }
    `,
  }), []);

  const styles = {
    container: {
      backgroundColor: c.neutral.white,
      borderRadius: '16px',
      border: `1px solid ${c.neutral[200]}`,
      boxShadow: theme.shadows.md,
      padding: '24px',
      marginTop: '28px',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '20px',
      flexWrap: 'wrap',
      gap: '12px',
    },
    titleSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    iconWrapper: {
      width: '44px',
      height: '44px',
      borderRadius: '12px',
      background: `linear-gradient(135deg, ${c.primary[500]} 0%, ${c.primary[700]} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: `0 4px 12px ${c.primary[500]}40`,
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      color: c.primary[900],
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
    },
    viewDropdown: {
      position: 'relative',
    },
    viewButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 16px',
      borderRadius: '10px',
      border: `1px solid ${c.neutral[200]}`,
      background: c.neutral.white,
      color: c.primary[700],
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    viewDropdownMenu: {
      position: 'absolute',
      top: '100%',
      right: 0,
      marginTop: '4px',
      backgroundColor: c.neutral.white,
      border: `1px solid ${c.neutral[200]}`,
      borderRadius: '10px',
      boxShadow: theme.shadows.lg,
      zIndex: 100,
      minWidth: '140px',
      overflow: 'hidden',
    },
    viewOption: {
      padding: '10px 16px',
      fontSize: '14px',
      color: c.neutral[700],
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      border: 'none',
      background: 'transparent',
      width: '100%',
      textAlign: 'left',
      display: 'block',
    },
    viewOptionActive: {
      backgroundColor: c.primary[50],
      color: c.primary[700],
      fontWeight: '600',
    },
    addBtn: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 18px',
      borderRadius: '10px',
      border: 'none',
      background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`,
      color: c.neutral.white,
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: `0 4px 12px ${c.primary[600]}40`,
      transition: 'all 0.2s ease',
    },
    calendarWrapper: {
      height: currentView === 'month' ? '500px' : '600px',
      transition: 'height 0.3s ease',
    },
    // Modal styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease',
    },
    modal: {
      backgroundColor: c.neutral.white,
      borderRadius: '16px',
      padding: '28px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: theme.shadows.xl,
      animation: 'slideUp 0.3s ease',
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
    },
    modalTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: c.primary[900],
    },
    closeBtn: {
      width: '36px',
      height: '36px',
      borderRadius: '10px',
      border: 'none',
      background: c.neutral[100],
      color: c.neutral[600],
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: c.primary[800],
      marginBottom: '8px',
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: `1px solid ${c.neutral[200]}`,
      borderRadius: '10px',
      fontSize: '15px',
      color: c.neutral[900],
      backgroundColor: c.neutral[50],
      transition: 'all 0.2s ease',
      outline: 'none',
      boxSizing: 'border-box',
    },
    inputRow: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
    },
    submitBtn: {
      width: '100%',
      padding: '14px 24px',
      borderRadius: '10px',
      border: 'none',
      background: `linear-gradient(135deg, ${c.primary[600]} 0%, ${c.primary[800]} 100%)`,
      color: c.neutral.white,
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
      boxShadow: `0 4px 12px ${c.primary[600]}40`,
      transition: 'all 0.2s ease',
      marginTop: '8px',
    },
  };

  return (
    <>
      <style>{calendarStyles}</style>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleSection}>
            <div style={styles.iconWrapper}>
              <CalendarIcon size={22} color={c.neutral.white} />
            </div>
            <h2 style={styles.title}>Event Calendar</h2>
          </div>
          
          <div style={styles.controls}>
            <div style={styles.viewDropdown}>
              <button
                style={styles.viewButton}
                onClick={() => setShowViewDropdown(!showViewDropdown)}
              >
                {viewOptions.find(v => v.value === currentView)?.label}
                <ChevronDown size={16} style={{ 
                  transform: showViewDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }} />
              </button>
              
              {showViewDropdown && (
                <div style={styles.viewDropdownMenu}>
                  {viewOptions.map(option => (
                    <button
                      key={option.value}
                      style={{
                        ...styles.viewOption,
                        ...(currentView === option.value ? styles.viewOptionActive : {}),
                      }}
                      onClick={() => handleViewChange(option.value)}
                      onMouseEnter={(e) => {
                        if (currentView !== option.value) {
                          e.target.style.backgroundColor = c.neutral[50];
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (currentView !== option.value) {
                          e.target.style.backgroundColor = 'transparent';
                        }
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              style={styles.addBtn}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = `0 6px 16px ${c.primary[600]}50`;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 12px ${c.primary[600]}40`;
              }}
            >
              <Plus size={18} />
              Add Event
            </button>
          </div>
        </div>

        <div style={styles.calendarWrapper}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            view={currentView}
            onView={setCurrentView}
            date={currentDate}
            onNavigate={handleNavigate}
            onSelectSlot={handleSelectSlot}
            selectable
            eventPropGetter={eventStyleGetter}
            style={{ height: '100%' }}
            views={['month', 'week', 'day']}
            toolbar={true}
            popup
            step={30}
            timeslots={2}
          />
        </div>
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Add New Event</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setShowModal(false)}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = c.neutral[200];
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = c.neutral[100];
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>
                <CalendarIcon size={16} color={c.primary[600]} />
                Event Name
              </label>
              <input
                type="text"
                placeholder="Enter event name..."
                value={newEvent.title}
                onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = c.primary[500];
                  e.target.style.boxShadow = `0 0 0 3px ${c.primary[100]}`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = c.neutral[200];
                  e.target.style.boxShadow = 'none';
                }}
                autoFocus
              />
            </div>

            <div style={styles.inputRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <CalendarIcon size={16} color={c.primary[600]} />
                  Date
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.primary[500];
                    e.target.style.boxShadow = `0 0 0 3px ${c.primary[100]}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = c.neutral[200];
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  <Clock size={16} color={c.primary[600]} />
                  Time
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.primary[500];
                    e.target.style.boxShadow = `0 0 0 3px ${c.primary[100]}`;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = c.neutral[200];
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              style={styles.submitBtn}
              onClick={handleAddEvent}
              disabled={!newEvent.title.trim()}
              onMouseEnter={(e) => {
                if (newEvent.title.trim()) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = `0 6px 16px ${c.primary[600]}50`;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = `0 4px 12px ${c.primary[600]}40`;
              }}
            >
              <Plus size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
              Add Event
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventCalendar;
