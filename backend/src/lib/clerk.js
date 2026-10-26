import { createClerkClient } from '@clerk/express'
import { env } from '../config/env.js'

export const clerk = createClerkClient({
  secretKey: env.clerkSecretKey,
  publishableKey: env.clerkPublishableKey,
})

export function serializeUser(user) {
  return {
    id: user.id,
    email: user.emailAddresses?.[0]?.emailAddress ?? null,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
    imageUrl: user.imageUrl,
    createdAt: user.createdAt,
  }
}
