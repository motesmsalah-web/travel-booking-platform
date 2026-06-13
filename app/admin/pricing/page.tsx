import { prisma } from '@/lib/db';
import PricingManager from '@/components/admin/PricingManager';

export const dynamic = 'force-dynamic';
export default async function Page(){const [rows,departures,destinations,companies,vehicles]=await Promise.all([prisma.pricingRule.findMany({include:{departureCity:true,destinationCity:true,transportCompany:true,vehicleType:true},orderBy:{createdAt:'desc'}}),prisma.departureCity.findMany({orderBy:{sortOrder:'asc'}}),prisma.destinationCity.findMany({orderBy:{sortOrder:'asc'}}),prisma.transportCompany.findMany({orderBy:{name:'asc'}}),prisma.vehicleType.findMany({orderBy:{name:'asc'}})]); return <PricingManager initial={rows} lookups={{departures,destinations,companies,vehicles}}/>}
