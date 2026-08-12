const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
(async () => {
  const campaign = await prisma.campaign.findFirst({ select: { id: true, slug: true } });
  console.log('campaign:', campaign);
  const job = await prisma.post.findFirst({ where: { type: 'JOB' }, select: { id: true, title: true } });
  console.log('job post:', job);
  await prisma.$disconnect();
})().catch(e => { console.error(e); process.exit(1); });
