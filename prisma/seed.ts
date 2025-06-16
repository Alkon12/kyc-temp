import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export const GROUPS = [
  {
    id: 'MANAGER',
    title: 'Manager',
  },
  {
    id: 'BACKOFFICE',
    title: 'Backoffice',
  },
];

export const ROLES = [
  {
    id: randomUUID(),
    roleName: 'Admin',
    description: 'Administrator with full access',
  },
  {
    id: randomUUID(),
    roleName: 'KYC Reviewer',
    description: 'User that reviews KYC verifications',
  },
  {
    id: randomUUID(),
    roleName: 'Data Operator',
    description: 'User that manages client data',
  },
];

export const PERMISSIONS = [
  {
    id: randomUUID(),
    permissionName: 'kyc:create',
    description: 'Create KYC verifications',
  },
  {
    id: randomUUID(),
    permissionName: 'kyc:review',
    description: 'Review KYC verifications',
  },
  {
    id: randomUUID(),
    permissionName: 'kyc:approve',
    description: 'Approve KYC verifications',
  },
  {
    id: randomUUID(),
    permissionName: 'kyc:reject',
    description: 'Reject KYC verifications',
  },
  {
    id: randomUUID(),
    permissionName: 'user:manage',
    description: 'Manage users',
  },
  {
    id: randomUUID(),
    permissionName: 'company:manage',
    description: 'Manage company settings',
  },
  {
    id: randomUUID(),
    permissionName: 'company:create',
    description: 'Create new companies',
  },
];

export const COMPANIES = [
  {
    id: randomUUID(),
    companyName: 'KYC Test Company',
    apiKey: 'test-api-key-1',
    status: 'active',
    callbackUrl: 'https://webhook.site/test-company',
    redirectUrl: 'https://testapp.com/kyc-complete',
  },
  {
    id: randomUUID(),
    companyName: 'Second Test Company',
    apiKey: 'test-api-key-2',
    status: 'active',
    callbackUrl: 'https://webhook.site/second-company',
    redirectUrl: 'https://secondapp.com/verification-done',
  },
];

// IDs constantes para facilitar tests
const USER_BO1 = 'c387646e-4ff6-4267-b7c2-8e1283040240';
const USER_ADMIN = 'a187646e-4ff6-4267-b7c2-8e1283040241';
const USER_REVIEWER = 'b287646e-4ff6-4267-b7c2-8e1283040242';

async function main() {
  console.log('Starting database seed...');

  // Limpiar datos existentes para evitar conflictos
  console.log('Cleaning existing data...');
  
  // Eliminar en orden correcto respetando restricciones de clave foránea
  await prisma.activityLog.deleteMany();
  await prisma.verificationWorkflow.deleteMany();
  await prisma.externalVerification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.facetecResult.deleteMany();
  await prisma.kycPerson.deleteMany();
  await prisma.kycVerification.deleteMany();
  await prisma.verificationSetting.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.company.deleteMany();
  await prisma.userGroup.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.group.deleteMany();

  console.log('Creating groups...');
  await prisma.group.createMany({
    data: GROUPS,
  });

  console.log('Creating users...');
  // 🔹 Hashear contraseña con bcrypt
  const hashedPassword = bcrypt.hashSync('1234', 10);

  // Crear usuarios
  const userBo1 = await prisma.user.create({
    data: {
      id: USER_BO1,
      email: 'bo1@grupoautofin.com',
      firstName: 'BO1',
      lastName: 'BO 1',
      emailVerified: new Date(),
      hashedPassword: hashedPassword,
    },
  });

  const userAdmin = await prisma.user.create({
    data: {
      id: USER_ADMIN,
      email: 'admin@kycservice.com',
      firstName: 'Admin',
      lastName: 'User',
      emailVerified: new Date(),
      hashedPassword: hashedPassword,
    },
  });

  const userReviewer = await prisma.user.create({
    data: {
      id: USER_REVIEWER,
      email: 'reviewer@kycservice.com',
      firstName: 'KYC',
      lastName: 'Reviewer',
      emailVerified: new Date(),
      hashedPassword: hashedPassword,
    },
  });

  console.log('Assigning users to groups...');
  // Asignar usuarios a grupos
  await prisma.userGroup.create({
    data: {
      groupId: 'BACKOFFICE',
      userId: userBo1.id,
      assignedBy: userBo1.id,
      assignedAt: new Date(),
    },
  });

  await prisma.userGroup.create({
    data: {
      groupId: 'MANAGER',
      userId: userAdmin.id,
      assignedBy: userAdmin.id,
      assignedAt: new Date(),
    },
  });

  await prisma.userGroup.create({
    data: {
      groupId: 'BACKOFFICE',
      userId: userReviewer.id,
      assignedBy: userAdmin.id,
      assignedAt: new Date(),
    },
  });

  console.log('Creating companies...');
  // Crear compañías
  const createdCompanies = await Promise.all(
    COMPANIES.map(company => 
      prisma.company.create({
        data: company,
      })
    )
  );

  console.log('Creating roles...');
  // Crear roles
  const createdRoles = await prisma.role.createMany({
    data: ROLES,
  });

  console.log('Creating permissions...');
  // Crear permisos
  const createdPermissions = await prisma.permission.createMany({
    data: PERMISSIONS,
  });

  console.log('Assigning permissions to roles...');
  // Asignar permisos a roles
  const adminRole = await prisma.role.findFirst({
    where: { roleName: 'Admin' },
  });

  const kycReviewerRole = await prisma.role.findFirst({
    where: { roleName: 'KYC Reviewer' },
  });

  const dataOperatorRole = await prisma.role.findFirst({
    where: { roleName: 'Data Operator' },
  });

  // Obtener todos los permisos
  const permissions = await prisma.permission.findMany();

  // Asignar todos los permisos al rol Admin
  if (adminRole) {
    await Promise.all(
      permissions.map(permission =>
        prisma.rolePermission.create({
          data: {
            roleId: adminRole.id,
            permissionId: permission.id,
          },
        })
      )
    );
  }

  // Asignar permisos específicos al rol KYC Reviewer
  if (kycReviewerRole) {
    const reviewerPermissions = permissions.filter(p => 
      ['kyc:review', 'kyc:approve', 'kyc:reject'].includes(p.permissionName)
    );
    
    await Promise.all(
      reviewerPermissions.map(permission =>
        prisma.rolePermission.create({
          data: {
            roleId: kycReviewerRole.id,
            permissionId: permission.id,
          },
        })
      )
    );
  }

  // Asignar permisos específicos al rol Data Operator
  if (dataOperatorRole) {
    const operatorPermissions = permissions.filter(p => 
      ['kyc:create'].includes(p.permissionName)
    );
    
    await Promise.all(
      operatorPermissions.map(permission =>
        prisma.rolePermission.create({
          data: {
            roleId: dataOperatorRole.id,
            permissionId: permission.id,
          },
        })
      )
    );
  }

  console.log('Assigning roles to users...');
  // Asignar roles a usuarios
  if (adminRole && createdCompanies[0]) {
    await prisma.userRole.create({
      data: {
        userId: userAdmin.id,
        roleId: adminRole.id,
        companyId: createdCompanies[0].id,
      },
    });
  }

  if (kycReviewerRole && createdCompanies[0]) {
    await prisma.userRole.create({
      data: {
        userId: userReviewer.id,
        roleId: kycReviewerRole.id,
        companyId: createdCompanies[0].id,
      },
    });
  }

  if (dataOperatorRole && createdCompanies[0]) {
    await prisma.userRole.create({
      data: {
        userId: userBo1.id,
        roleId: dataOperatorRole.id,
        companyId: createdCompanies[0].id,
      },
    });
  }

  console.log('Creating verification settings...');
  // Crear configuración de verificación para cada compañía
  await Promise.all(
    createdCompanies.map(company =>
      prisma.verificationSetting.create({
        data: {
          companyId: company.id,
          facetecMatchThreshold: 80.00,
          requiredDocuments: {
            identity: ['passport', 'national_id'],
            address: ['utility_bill', 'bank_statement'],
          },
          autoApprovalRules: {
            minFacetecScore: 85,
            requiredDocuments: true,
            amlCheck: true,
          },
        },
      })
    )
  );

  console.log('Creating sample KYC verifications...');
  // Crear algunas verificaciones KYC de ejemplo
  const kycVerifications = await Promise.all([
    // Verificación pendiente
    prisma.kycVerification.create({
      data: {
        companyId: createdCompanies[0].id,
        status: 'pending',
        verificationType: 'bronze',
        priority: 1,
        notes: 'Cliente importante, procesar con prioridad',
        externalReferenceId: 'EXT-REF-001',
        kycPersons: {
          create: {
            firstName: 'Ana',
            lastName: 'García',
            dateOfBirth: new Date('1985-05-15'),
            nationality: 'Española',
            documentNumber: '12345678A',
            documentType: 'DNI',
            email: 'ana.garcia@example.com',
            phone: '+34600000000',
            address: 'Calle Gran Vía 1, Madrid',
          },
        },
      },
    }),
    
    // Verificación en progreso
    prisma.kycVerification.create({
      data: {
        companyId: createdCompanies[0].id,
        status: 'in_progress',
        verificationType: 'gold',
        priority: 2,
        assignedTo: userReviewer.id,
        notes: 'Documentación pendiente de revisión',
        externalReferenceId: 'EXT-REF-002',
        kycPersons: {
          create: {
            firstName: 'Carlos',
            lastName: 'Rodríguez',
            dateOfBirth: new Date('1990-10-20'),
            nationality: 'Española',
            documentNumber: '87654321B',
            documentType: 'DNI',
            email: 'carlos.rodriguez@example.com',
            phone: '+34611111111',
            address: 'Avenida Diagonal 300, Barcelona',
          },
        },
      },
    }),
    
    // Verificación aprobada
    prisma.kycVerification.create({
      data: {
        companyId: createdCompanies[0].id,
        status: 'approved',
        verificationType: 'silver',
        priority: 0,
        assignedTo: userReviewer.id,
        notes: 'Verificación completada correctamente',
        externalReferenceId: 'EXT-REF-003',
        completedAt: new Date(),
        kycPersons: {
          create: {
            firstName: 'María',
            lastName: 'López',
            dateOfBirth: new Date('1988-03-25'),
            nationality: 'Española',
            documentNumber: '11223344C',
            documentType: 'DNI',
            email: 'maria.lopez@example.com',
            phone: '+34622222222',
            address: 'Calle Serrano 50, Madrid',
          },
        },
      },
    }),
  ]);

  console.log('Creating sample FaceTec results...');
  // Crear resultados de FaceTec para algunas verificaciones
  await prisma.facetecResult.create({
    data: {
      verificationId: kycVerifications[1].id,
      sessionId: 'facetec-session-001',
      livenessStatus: 'passed',
      enrollmentStatus: 'success',
      matchLevel: 85.75,
      fullResponse: {
        success: true,
        timestamp: new Date().toISOString(),
        details: {
          faceMatch: {
            score: 85.75,
            thresholdPassed: true,
          },
          liveness: {
            score: 98.50,
            thresholdPassed: true,
          },
        },
      },
      manualReviewRequired: false,
    },
  });

  await prisma.facetecResult.create({
    data: {
      verificationId: kycVerifications[2].id,
      sessionId: 'facetec-session-002',
      livenessStatus: 'passed',
      enrollmentStatus: 'success',
      matchLevel: 95.20,
      fullResponse: {
        success: true,
        timestamp: new Date().toISOString(),
        details: {
          faceMatch: {
            score: 95.20,
            thresholdPassed: true,
          },
          liveness: {
            score: 99.10,
            thresholdPassed: true,
          },
        },
      },
      manualReviewRequired: false,
    },
  });

  console.log('Creating sample documents...');
  // Crear documentos de ejemplo
  await prisma.document.create({
    data: {
      verificationId: kycVerifications[1].id,
      documentType: 'national_id_front',
      filePath: '/uploads/documents/id_front_001.jpg',
      fileName: 'id_front_001.jpg',
      fileSize: 1500000,
      mimeType: 'image/jpeg',
      verificationStatus: 'pending',
      ocrData: {
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        documentNumber: '87654321B',
        dateOfBirth: '1990-10-20',
        expiryDate: '2030-10-20',
      },
    },
  });

  await prisma.document.create({
    data: {
      verificationId: kycVerifications[1].id,
      documentType: 'national_id_back',
      filePath: '/uploads/documents/id_back_001.jpg',
      fileName: 'id_back_001.jpg',
      fileSize: 1400000,
      mimeType: 'image/jpeg',
      verificationStatus: 'pending',
      ocrData: {
        address: 'Avenida Diagonal 300, Barcelona',
        issueDate: '2020-10-20',
      },
    },
  });

  await prisma.document.create({
    data: {
      verificationId: kycVerifications[2].id,
      documentType: 'national_id_front',
      filePath: '/uploads/documents/id_front_002.jpg',
      fileName: 'id_front_002.jpg',
      fileSize: 1600000,
      mimeType: 'image/jpeg',
      verificationStatus: 'approved',
      reviewerId: userReviewer.id,
      reviewNotes: 'Documento válido y legible',
      ocrData: {
        firstName: 'María',
        lastName: 'López',
        documentNumber: '11223344C',
        dateOfBirth: '1988-03-25',
        expiryDate: '2028-03-25',
      },
    },
  });

  console.log('Creating activity logs...');
  // Crear registros de actividad
  await prisma.activityLog.create({
    data: {
      userId: userReviewer.id,
      verificationId: kycVerifications[1].id,
      action: 'verification_assigned',
      description: 'Verificación asignada a revisor',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: userReviewer.id,
      verificationId: kycVerifications[2].id,
      action: 'verification_approved',
      description: 'Verificación aprobada después de revisar la documentación',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
  });

  console.log('Creating verification workflows...');
  // Crear flujos de trabajo de verificación
  await prisma.verificationWorkflow.create({
    data: {
      verificationId: kycVerifications[1].id,
      currentStep: 'document_verification',
      stepStatus: 'in_progress',
      nextStep: 'face_matching',
      stepRequirements: {
        requiredDocuments: ['national_id_front', 'national_id_back'],
        minQualityScore: 80,
      },
    },
  });

  await prisma.verificationWorkflow.create({
    data: {
      verificationId: kycVerifications[2].id,
      currentStep: 'completed',
      stepStatus: 'success',
      nextStep: null,
      stepRequirements: Prisma.JsonNull,
    },
  });

  console.log('Seed data inserted successfully!');
  
  // Imprimir información útil para pruebas
  console.log('\n--------- INFORMACIÓN PARA PRUEBAS ---------');
  console.log(`ID de Compañía para pruebas: ${createdCompanies[0].id}`);
  console.log(`ID de Usuario Revisor: ${userReviewer.id}`);
  console.log('--------------------------------------------\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
