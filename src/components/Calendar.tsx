import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  getCalendarEvents,
  addCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent
} from '../services/calendarService';
import type { CalendarEvent } from '../types/calendar';
import EventModal from './EventModal';

const Calendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Load events from Firebase
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const calendarEvents = await getCalendarEvents();
      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle date/time slot selection - lấy chính xác giờ được click
  const handleDateSelect = (selectInfo: any) => {
    console.log('Calendar selectInfo:', {
      start: selectInfo.start,
      end: selectInfo.end,
      startStr: selectInfo.startStr,
      endStr: selectInfo.endStr
    });
    
    // Sử dụng thời gian từ selectInfo
    const selectedStart = new Date(selectInfo.start);
    const selectedEnd = new Date(selectInfo.end);
    
    console.log('Parsed times:', {
      start: selectedStart.toLocaleString(),
      end: selectedEnd.toLocaleString(),
      durationHours: (selectedEnd.getTime() - selectedStart.getTime()) / (1000 * 60 * 60)
    });
    
    setSelectedDate(selectedStart);
    setSelectedEvent(null);
    setShowModal(true);
    
    selectInfo.view.calendar.unselect();
  };

  // Handle event click - edit existing event
  const handleEventClick = (clickInfo: any) => {
    const event = events.find(e => e.id === clickInfo.event.id);
    if (event) {
      setSelectedEvent(event);
      setSelectedDate(null); // Reset selectedDate khi edit event
      setShowModal(true);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'high': '#ef4444',
      'medium': '#f59e0b',
      'low': '#10b981'
    };
    return colors[priority as keyof typeof colors] || '#6b7280';
  };

  // Convert events for FullCalendar
  const fullCalendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.start,
    end: event.end,
    allDay: event.allDay,
    backgroundColor: getPriorityColor(event.priority),
    borderColor: getPriorityColor(event.priority),
    extendedProps: {
      description: event.description,
      priority: event.priority,
      status: event.status
    }
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Calendar</h2>
        <p className="text-gray-600">Manage your events and schedule</p>
      </div>

      <div className="calendar-container">
        <FullCalendar
          // Bỏ dòng này: timeZone='Asia/Ho_Chi_Minh'
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='timeGridWeek'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={fullCalendarEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="auto"
          eventDisplay="block"
          eventTextColor="white"
          // Timezone và localization
          locale='vi'
          firstDay={1}
          // Hiển thị toàn bộ khung giờ 24h
          slotMinTime="00:00:00"
          slotMaxTime="24:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          allDaySlot={true}
          scrollTime="08:00:00"
          selectConstraint={{
            start: '00:00',
            end: '24:00'
          }}
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal
          event={selectedEvent}
          date={selectedDate}
          onSave={async (eventData: any) => {
            try {
              if (selectedEvent) {
                // Update existing event
                await updateCalendarEvent(selectedEvent.id, eventData);
              } else {
                // Create new event - giữ nguyên timezone local
                await addCalendarEvent({
                  ...eventData,
                  status: 'scheduled' as const
                });
              }
              await loadEvents();
              setShowModal(false);
            } catch (error) {
              console.error('Error saving event:', error);
            }
          }}
          onDelete={async (eventId: string) => {
            if (window.confirm('Are you sure you want to delete this event?')) {
              try {
                await deleteCalendarEvent(eventId);
                await loadEvents();
                setShowModal(false);
              } catch (error) {
                console.error('Error deleting event:', error);
              }
            }
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default Calendar;