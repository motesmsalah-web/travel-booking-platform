import { prisma } from '@/lib/db';
import SimpleCrud from '@/components/admin/SimpleCrud';


export const dynamic = 'force-dynamic';
export default async function Page() {
  const rows = await prisma.transportCompany.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <SimpleCrud
      title="شركات النقل"
      endpoint="/api/admin/transport-companies"
      initial={rows}
      hasSort={false}
      hasLogo={true}
    />
  );
}