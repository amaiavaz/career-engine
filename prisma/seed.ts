import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.evaluation.deleteMany();
  await prisma.person.deleteMany();
  await prisma.specialty.deleteMany();
  await prisma.level.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: 'admin@empresa.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
    },
  });

  const specialties = await Promise.all([
    prisma.specialty.create({ data: { name: 'Estrategia', color: '#6366F1' } }),
    prisma.specialty.create({ data: { name: 'Tecnología', color: '#10B981' } }),
    prisma.specialty.create({ data: { name: 'SAP', color: '#F59E0B' } }),
    prisma.specialty.create({ data: { name: 'Auditoría', color: '#EF4444' } }),
    prisma.specialty.create({ data: { name: 'Riesgos', color: '#8B5CF6' } }),
  ]);

  const [estrategia, tecnologia, sap, auditoria, riesgos] = specialties;

  const levels = await Promise.all([
    prisma.level.create({ data: { name: 'Analista', order: 1 } }),
    prisma.level.create({ data: { name: 'Consultor', order: 2 } }),
    prisma.level.create({ data: { name: 'Consultor Sr.', order: 3 } }),
    prisma.level.create({ data: { name: 'Manager', order: 4 } }),
    prisma.level.create({ data: { name: 'Director', order: 5 } }),
    prisma.level.create({ data: { name: 'Partner', order: 6 } }),
  ]);

  const [analista, consultor, consultorSr, manager, director] = levels;

  // Crear personas sin evaluador primero
  const anaM = await prisma.person.create({
    data: {
      name: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      specialtyId: auditoria.id,
      levelId: consultorSr.id,
    },
  });
  const carlosL = await prisma.person.create({
    data: {
      name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      specialtyId: tecnologia.id,
      levelId: manager.id,
    },
  });
  const davidT = await prisma.person.create({
    data: {
      name: 'David Torres',
      email: 'david.torres@empresa.com',
      specialtyId: sap.id,
      levelId: consultorSr.id,
    },
  });
  const diegoF = await prisma.person.create({
    data: {
      name: 'Diego Fernández',
      email: 'diego.fernandez@empresa.com',
      specialtyId: riesgos.id,
      levelId: consultorSr.id,
    },
  });
  const elenaV = await prisma.person.create({
    data: {
      name: 'Elena Vega',
      email: 'elena.vega@empresa.com',
      specialtyId: tecnologia.id,
      levelId: director.id,
    },
  });
  const javierM = await prisma.person.create({
    data: {
      name: 'Javier Moreno',
      email: 'javier.moreno@empresa.com',
      specialtyId: estrategia.id,
      levelId: consultor.id,
    },
  });
  const lauraS = await prisma.person.create({
    data: {
      name: 'Laura Sánchez',
      email: 'laura.sanchez@empresa.com',
      specialtyId: riesgos.id,
      levelId: analista.id,
    },
  });
  const mariaG = await prisma.person.create({
    data: {
      name: 'María García',
      email: 'maria.garcia@empresa.com',
      specialtyId: estrategia.id,
      levelId: manager.id,
    },
  });
  const pedroR = await prisma.person.create({
    data: {
      name: 'Pedro Ruiz',
      email: 'pedro.ruiz@empresa.com',
      specialtyId: auditoria.id,
      levelId: director.id,
    },
  });

  // Asignar evaluadores
  await prisma.person.update({
    where: { id: anaM.id },
    data: { evaluatorId: pedroR.id },
  });
  await prisma.person.update({
    where: { id: carlosL.id },
    data: { evaluatorId: elenaV.id },
  });
  await prisma.person.update({
    where: { id: davidT.id },
    data: { evaluatorId: pedroR.id },
  });
  await prisma.person.update({
    where: { id: diegoF.id },
    data: { evaluatorId: lauraS.id },
  });
  await prisma.person.update({
    where: { id: javierM.id },
    data: { evaluatorId: carlosL.id },
  });
  await prisma.person.update({
    where: { id: lauraS.id },
    data: { evaluatorId: mariaG.id },
  });

  // Evaluaciones
  const evaluationData = [
    { personId: anaM.id, score: 94 },
    { personId: carlosL.id, score: 65 },
    { personId: davidT.id, score: 76 },
    { personId: diegoF.id, score: 68 },
    { personId: elenaV.id, score: 82 },
    { personId: javierM.id, score: 58 },
    { personId: lauraS.id, score: 100 },
    { personId: mariaG.id, score: 88 },
    { personId: pedroR.id, score: 79 },
  ];

  for (const data of evaluationData) {
    await prisma.evaluation.create({
      data: { ...data, status: 'COMPLETED' },
    });
  }

  console.log('Seed completado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
