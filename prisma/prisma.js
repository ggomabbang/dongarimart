import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

prisma.$connect()
  .then(() => {
    console.log('connected');
  })
  .catch((err) => {
    console.log(err);
  });

export default prisma;