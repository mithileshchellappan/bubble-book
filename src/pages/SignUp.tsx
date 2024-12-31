import { SignUp as ClerkSignUp } from '@clerk/clerk-react';

export const SignUp = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
      <ClerkSignUp 
        routing="path" 
        path="/sign-up" 
        signInUrl="/sign-in"
        redirectUrl="/"
      />
    </div>
  );
}; 