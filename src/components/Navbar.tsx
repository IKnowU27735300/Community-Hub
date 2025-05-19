import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, LogIn, UserCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
            <Calendar className="w-6 h-6" />
            <span>Community Hub</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link to="/events" className="text-gray-600 hover:text-gray-900">
              Events
            </Link>
            {user ? (
              <>
                <Link to="/create-event" className="text-gray-600 hover:text-gray-900">
                  Create Event
                </Link>
                <Link to="/profile" className="text-gray-600 hover:text-gray-900">
                  <UserCircle className="w-6 h-6" />
                </Link>
              </>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;