export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    status: 'scheduled' | 'completed' | 'cancelled';
    priority: 'low' | 'medium' | 'high';
    createdAt: number;
    updatedAt: number;
};

export interface CalendarEventInput {
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  priority: 'low' | 'medium' | 'high';
};