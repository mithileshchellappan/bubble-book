import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../../auth/config';

export const LoginButton = () => {
  const { instance } = useMsal();

  const handleLogin = async () => {
    try {
      const response = await instance.loginPopup(loginRequest);
      console.log('Login successful:', response);
      
      // Send auth code to backend
      const result = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code: response.code })
      });
      
      const data = await result.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <button 
      onClick={handleLogin}
      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      Sign in with Microsoft
    </button>
  );
}; 