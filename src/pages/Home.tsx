import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Event } from '../types';

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = React.useState<Event[]>([]);

  React.useEffect(() => {
    const fetchFeaturedEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setFeaturedEvents(data);
      }
    };

    fetchFeaturedEvents();
  }, []);

  return (
    <div>
      <section className="text-center py-16 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Welcome to Community Hub</h1>
        <p className="text-xl mb-8">Connect, Volunteer, and Make a Difference</p>
        <div className="flex justify-center gap-4">
          <Link
            to="/events"
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Browse Events
          </Link>
          <Link
            to="/auth"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="mt-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Events</h2>
          <Link to="/events" className="text-blue-600 hover:text-blue-700 flex items-center gap-2">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 mt-2">
                  <Users className="w-4 h-4" />
                  <span>{event.available_slots} spots left</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;