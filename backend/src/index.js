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
      whatsappSession: 'GET /api/bizniz/whatsapp/session',
      whatsappStart: 'POST /api/bizniz/whatsapp/start',
      whatsappStop: 'POST /api/bizniz/whatsapp/stop',
      whatsappClear: 'POST /api/bizniz/whatsapp/clear',
      whatsappEvents: 'GET /api/bizniz/whatsapp/events',
      businessStory: 'GET|PUT /api/bizniz/business-story',
    },
  })
})

app.use('/api', routes)

app.use(errorHandler)

app.listen(env.port, '0.0.0.0', () => {
  console.log(`API running on http://localhost:${env.port}`)
})
