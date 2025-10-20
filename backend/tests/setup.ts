import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.user.deleteMany({});
  await prisma.task.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});