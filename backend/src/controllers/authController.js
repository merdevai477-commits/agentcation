import { clerk, serializeUser } from '../lib/clerk.js'

async function createSessionToken(userId) {
  const session = await clerk.sessions.createSession({ userId })
  const { jwt } = await clerk.sessions.getToken(session.id)
  return { sessionId: session.id, token: jwt }
}

export async function register(req, res, next) {
  try {
    const { email, password, firstName, lastName } = req.body ?? {}

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'email and password are required',
      })
    }

    if (String(password).length < 15) {
      return res.status(400).json({
        success: false,
        error: 'password must be at least 15 characters (Clerk policy)',
      })
    }

    const normalizedEmail = String(email).trim().toLowerCase()
    const { username } = req.body ?? {}
    const base =
      (username && String(username).trim().toLowerCase().replace(/[^a-z0-9]/g, '')) ||
      normalizedEmail.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 16) ||
      'user'
    const derivedUsername = `${base}${Date.now().toString(36)}`.slice(0, 30)

    const user = await clerk.users.createUser({
      emailAddress: [normalizedEmail],
      username: derivedUsername,
      password: String(password),
      firstName: firstName ? String(firstName).trim() : undefined,
      lastName: lastName ? String(lastName).trim() : undefined,
    })

    const session = await createSessionToken(user.id)

    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
      user: serializeUser(user),
      sessionId: session.sessionId,
      token: session.token,
    })
  } catch (err) {
    if (err?.status === 422 || err?.errors) {
      err.status = err.status || 400
    }
    return next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {}

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'email and password are required',
      })
    }

    const list = await clerk.users.getUserList({
      emailAddress: [String(email).trim().toLowerCase()],
      limit: 1,
    })

    const user = list.data?.[0]

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    try {
      await clerk.users.verifyPassword({
        userId: user.id,
        password: String(password),
      })
    } catch {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      })
    }

    const session = await createSessionToken(user.id)

    return res.json({
      success: true,
      message: 'Logged in successfully',
      user: serializeUser(user),
      sessionId: session.sessionId,
      token: session.token,
    })
  } catch (err) {
    return next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await clerk.users.getUser(req.userId)
    return res.json({
      success: true,
      user: serializeUser(user),
    })
  } catch (err) {
    return next(err)
  }
}

export async function logout(req, res, next) {
  try {
    const { sessionId } = req.body ?? {}

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required',
      })
    }

    await clerk.sessions.revokeSession(sessionId)

    return res.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (err) {
    return next(err)
  }
}
