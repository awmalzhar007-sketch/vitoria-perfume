const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:d:/APPs/VITORIA/VITORIA/prisma/dev.db"
    }
  }
});

async function run() {
  const product = await prisma.product.findFirst({
    where: { slug: "1-million-royal" },
    include: { images: true, sizes: true, category: true }
  });
  console.log(JSON.stringify(product, null, 2));
}

run().catch(console.error).finally(() => prisma.$disconnect());
