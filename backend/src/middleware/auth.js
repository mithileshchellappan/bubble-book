import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

// Use the newer networkless verification
export const requireAuth = ClerkExpressRequireAuth({
  // Optional configuration
  onError: (err, req, res) => {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
}); 