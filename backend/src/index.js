import express from 'express'
import cors from 'cors'
import { clerkMiddleware } from '@clerk/express'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
)
app.use(express.json())
app.use(clerkMiddleware())

app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Agenticatipon API is running',
    endpoints: {
      health: 'GET /api/health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      me: 'GET /api/auth/me',
      logout: 'POST /api/auth/logout',
    },
  })
})

app.use('/api', routes)

app.use(errorHandler)

app.listen(env.port, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${env.port}`)
})
