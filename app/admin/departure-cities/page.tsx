import { prisma } from '@/lib/db';
import SimpleCrud from '@/components/admin/SimpleCrud';


export const dynamic = 'force-dynamic';
export default async function Page() {
  const rows = await prisma.departureCity.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <SimpleCrud
      title="مدن الانطلاق"
      endpoint="/api/admin/departure-cities"
      initial={rows}
      hasSort={true}
      hasLogo={false}
    />
  );
}