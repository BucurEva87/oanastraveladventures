import prisma from '../prisma/client'
import { cache } from 'react'

async function getCachedUsers() {
  const users = await prisma.user.findMany()

  return users
}

export const getUsers = cache(getCachedUsers)
