import { UserButton, useUser } from '@clerk/clerk-react';
import { Mic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserMenu: React.FC = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (!isSignedIn) {
    return (
      <button
        onClick={() => navigate('/sign-in')}
        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        Sign in
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button 
        onClick={() => navigate('/voice-profile')}
        className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
      >
        <Mic className="w-4 h-4" />
        Voice Profiles
      </button>
      <UserButton afterSignOutUrl="/sign-in" />
    </div>
  );
}; 