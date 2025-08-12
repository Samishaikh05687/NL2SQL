import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      { name: 'Alice', department: 'HR', salary: 60000 },
      { name: 'Bob', department: 'Engineering', salary: 80000 },
    ],
  });
}

main().catch(e => console.error(e)).finally(async () => await prisma.$disconnect());