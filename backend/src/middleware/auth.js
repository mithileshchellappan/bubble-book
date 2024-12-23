import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';

export const requireAuth = ClerkExpressRequireAuth({
  // Optional configuration
  onError: (err, req, res) => {
    console.error('Auth error:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

export const getUserId = (req) => {
  return req.auth.userId;
}; 