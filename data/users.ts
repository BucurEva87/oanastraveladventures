import { faker } from "@faker-js/faker"

const roles = ['ADMIN', 'MODERATOR', 'USER']

function generateFakeUser() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: faker.datatype.boolean(),
    image: faker.image.avatar(),
    role: faker.helpers.arrayElement(roles)
  }
}

export const data: User[] = faker.helpers.multiple(
  generateFakeUser, { count: 20 }
)

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  role: string;
}
