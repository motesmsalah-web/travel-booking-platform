import { PrismaClient, TripType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminUsername = process.env.ADMIN_USERNAME || process.env.ADMIN_EMAIL?.split('@')[0];
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminUsername || !adminPassword) {
    throw new Error('ADMIN_EMAIL, ADMIN_USERNAME and ADMIN_PASSWORD are required for seeding.');
  }

  if (process.env.NODE_ENV === 'production' && adminPassword === 'admin123456') {
    throw new Error('Refusing to seed production with the default admin password.');
  }

  const hash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      username: adminUsername,
      passwordHash: hash,
      role: 'ADMIN',
    },
    create: {
      name: 'مدير النظام',
      email: adminEmail,
      username: adminUsername,
      passwordHash: hash,
      role: 'ADMIN',
    },
  });

  await prisma.siteSetting.upsert({
    where: { id: 'default-site-settings' },
    update: {
      officeName: 'مكتب السفريات',
      siteTitle: 'منصة حجز سفريات وسياحة',
      welcomeText:
        'احجز رحلتك إلى السعودية بسهولة عبر واتساب، واختر خط السير ونوع الرحلة وعدد الركاب ليظهر السعر تلقائيًا.',
      whatsappNumber: '967700000000',
      primaryColor: '#0B1F3A',
      secondaryColor: '#C8A24A',
      footerText: 'جميع الحقوق محفوظة لمكتب السفريات',
    },
    create: {
      id: 'default-site-settings',
      officeName: 'مكتب السفريات',
      siteTitle: 'منصة حجز سفريات وسياحة',
      welcomeText:
        'احجز رحلتك إلى السعودية بسهولة عبر واتساب، واختر خط السير ونوع الرحلة وعدد الركاب ليظهر السعر تلقائيًا.',
      whatsappNumber: '967700000000',
      primaryColor: '#0B1F3A',
      secondaryColor: '#C8A24A',
      footerText: 'جميع الحقوق محفوظة لمكتب السفريات',
    },
  });

  const departureCities = ['صنعاء', 'تعز', 'ذمار', 'رداع', 'مأرب', 'العبر', 'المكلا'];

  for (const [i, name] of departureCities.entries()) {
    await prisma.departureCity.upsert({
      where: { name },
      update: { sortOrder: i, isActive: true },
      create: { name, sortOrder: i, isActive: true },
    });
  }

  const destinationCities = ['جدة', 'الرياض'];

  for (const [i, name] of destinationCities.entries()) {
    await prisma.destinationCity.upsert({
      where: { name },
      update: { sortOrder: i, isActive: true },
      create: { name, sortOrder: i, isActive: true },
    });
  }

  const companies = ['البراق', 'الراهدة', 'النور'];

  for (const name of companies) {
    await prisma.transportCompany.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
  }

  const vehicleTypes = ['صالون', 'هايس', 'باص صغير', 'جيب'];

  for (const name of vehicleTypes) {
    await prisma.vehicleType.upsert({
      where: { name },
      update: { isActive: true },
      create: { name, isActive: true },
    });
  }

  const dep = await prisma.departureCity.findUnique({
    where: { name: 'صنعاء' },
  });

  const dest = await prisma.destinationCity.findUnique({
    where: { name: 'جدة' },
  });

  const comp = await prisma.transportCompany.findUnique({
    where: { name: 'البراق' },
  });

  const groupVehicle = await prisma.vehicleType.findUnique({
    where: { name: 'هايس' },
  });

  const privateVehicle = await prisma.vehicleType.findUnique({
    where: { name: 'صالون' },
  });

  if (!dep || !dest || !comp || !groupVehicle || !privateVehicle) {
    throw new Error('Required seed records were not created correctly.');
  }

  await prisma.pricingRule.upsert({
    where: {
      tripType_departureCityId_destinationCityId_transportCompanyId_vehicleTypeId: {
        tripType: TripType.GROUP_TRANSPORT,
        departureCityId: dep.id,
        destinationCityId: dest.id,
        transportCompanyId: comp.id,
        vehicleTypeId: groupVehicle.id,
      },
    },
    update: {
      pricePerPassenger: 200,
      isActive: true,
    },
    create: {
      tripType: TripType.GROUP_TRANSPORT,
      departureCityId: dep.id,
      destinationCityId: dest.id,
      transportCompanyId: comp.id,
      vehicleTypeId: groupVehicle.id,
      pricePerPassenger: 200,
      isActive: true,
    },
  });

  await prisma.pricingRule.upsert({
    where: {
      tripType_departureCityId_destinationCityId_transportCompanyId_vehicleTypeId: {
        tripType: TripType.PRIVATE_VEHICLE,
        departureCityId: dep.id,
        destinationCityId: dest.id,
        transportCompanyId: comp.id,
        vehicleTypeId: privateVehicle.id,
      },
    },
    update: {
      pricePerPassenger: 450,
      isActive: true,
    },
    create: {
      tripType: TripType.PRIVATE_VEHICLE,
      departureCityId: dep.id,
      destinationCityId: dest.id,
      transportCompanyId: comp.id,
      vehicleTypeId: privateVehicle.id,
      pricePerPassenger: 450,
      isActive: true,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });