import { prisma } from '@/lib/db';
import SimpleCrud from '@/components/admin/SimpleCrud';


export const dynamic = 'force-dynamic';
export default async function Page() {
  const rows = await prisma.destinationCity.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  return (
    <SimpleCrud
      title="مدن الوصول"
      endpoint="/api/admin/destination-cities"
      initial={rows}
      hasSort={true}
      hasLogo={false}
    />
  );
}