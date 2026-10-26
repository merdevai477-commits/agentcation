import { getAuth } from '@clerk/express'

export function requireAuth(req, res, next) {
  const { isAuthenticated, userId } = getAuth(req)

  if (!isAuthenticated || !userId) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized — send a valid Clerk session Bearer token',
    })
  }

  req.userId = userId
  return next()
}
