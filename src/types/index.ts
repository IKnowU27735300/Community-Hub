export interface User {
  id: string;
  email: string;
  role: 'organizer' | 'attendee';
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  organizer_id: string;
  volunteer_slots: number;
  available_slots: number;
  is_paid: boolean;
  price?: number;
  created_at: string;
}

export interface Comment {
  id: string;
  event_id: string;
  user_id: string;
  content: string;
  created_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  role: 'attendee' | 'volunteer';
  created_at: string;
}