import { prisma } from '@/lib/db';
import SimpleCrud from '@/components/admin/SimpleCrud';


export const dynamic = 'force-dynamic';
export default async function Page() {
  const rows = await prisma.vehicleType.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <SimpleCrud
      title="أنواع السيارات"
      endpoint="/api/admin/vehicle-types"
      initial={rows}
      hasSort={false}
      hasLogo={false}
    />
  );
}