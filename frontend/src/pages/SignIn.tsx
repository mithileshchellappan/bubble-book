import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

export const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-blue-50 to-purple-100 flex items-center justify-center p-4">
      <ClerkSignIn 
        routing="path" 
        path="/sign-in" 
        signUpUrl="/sign-up"
        redirectUrl="/"
      />
    </div>
  );
}; 