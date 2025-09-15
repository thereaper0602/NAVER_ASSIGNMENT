import { useState } from "react";

interface EventModalProps {
  event: any;
  date: Date | null;
  onSave: (eventData: any) => Promise<void>;
  onDelete: (eventId: string) => Promise<void>;
  onClose: () => void;
}

const EventModal = ({ event, date, onSave, onDelete, onClose }: EventModalProps) => {
  const [title, setTitle] = useState(event?.title || '');
  const [description, setDescription] = useState(event?.description || '');
  const [priority, setPriority] = useState(event?.priority || 'medium');
  const [allDay, setAllDay] = useState(event?.allDay || false); // ← Thêm dòng này

  // Format datetime cho input datetime-local
  function formatForInput(inputDate: Date) {
    const localDate = new Date(inputDate.getTime() - (inputDate.getTimezoneOffset() * 60000));
    return localDate.toISOString().slice(0, 16);
  }

  const [startTime, setStartTime] = useState(() => {
    if (event?.start) {
      return formatForInput(new Date(event.start));
    } else if (date) {
      return formatForInput(date);
    } else {
      return formatForInput(new Date());
    }
  });

  const [endTime, setEndTime] = useState(() => {
    if (event?.end) {
      return formatForInput(new Date(event.end));
    } else if (date) {
      // Thêm đúng 1 tiếng (3600000 ms)
      const endDate = new Date(date.getTime() + 3600000);
      return formatForInput(endDate);
    } else {
      const endDate = new Date(Date.now() + 3600000);
      return formatForInput(endDate);
    }
  });

  // Validate trong handleSubmit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);
    
    console.log('Start:', startDate.toLocaleString());
    console.log('End:', endDate.toLocaleString());
    console.log('Duration (hours):', (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60));
    
    if (endDate <= startDate) {
      alert('Thời gian kết thúc phải sau thời gian bắt đầu!');
      return;
    }
    
    onSave({
      title,
      description,
      priority,
      start: startDate,
      end: endDate,
      allDay
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {event ? 'Edit Event' : 'Create New Event'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Enter event description (optional)"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">🟢 Low Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="high">🔴 High Priority</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="allDay" className="text-sm font-medium">All Day Event</label>
          </div>
          
          {!allDay && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="datetime-local"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </>
          )}
          
          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
            >
              {event ? 'Update Event' : 'Create Event'}
            </button>
            
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
          
          {event && onDelete && (
            <button
              type="button"
              onClick={() => onDelete(event.id)}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors mt-2"
            >
              Delete Event
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default EventModal;