import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { pricingSchema } from '@/lib/validators';
async function rows(){return prisma.pricingRule.findMany({include:{departureCity:true,destinationCity:true,transportCompany:true,vehicleType:true},orderBy:{createdAt:'desc'}})}
export async function POST(req:Request){
  await requireAdmin();
  try{
    const b=pricingSchema.parse(await req.json());
    if(b.tripType==='GROUP_TRANSPORT'&&!b.transportCompanyId) return NextResponse.json({message:'يرجى اختيار شركة النقل'},{status:400});
    if(b.tripType==='PRIVATE_VEHICLE'&&!b.vehicleTypeId) return NextResponse.json({message:'يرجى اختيار نوع السيارة'},{status:400});
    for(const d of b.departureCityIds){
      for(const dest of b.destinationCityIds){
        const where={tripType:b.tripType,departureCityId:d,destinationCityId:dest,transportCompanyId:b.tripType==='GROUP_TRANSPORT'?b.transportCompanyId:null,vehicleTypeId:b.tripType==='PRIVATE_VEHICLE'?b.vehicleTypeId:null};
        const ex=await prisma.pricingRule.findFirst({where});
        if(ex) await prisma.pricingRule.update({where:{id:ex.id},data:{pricePerPassenger:b.pricePerPassenger,isActive:b.isActive}});
        else await prisma.pricingRule.create({data:{...where,pricePerPassenger:b.pricePerPassenger,isActive:b.isActive}});
      }
    }
    return NextResponse.json({rows:await rows()});
  }catch(e){return NextResponse.json({message:'بيانات السعر غير صحيحة'},{status:400})}
}
export async function DELETE(req:Request){await requireAdmin(); const id=new URL(req.url).searchParams.get('id'); if(!id)return NextResponse.json({message:'المعرف مطلوب'},{status:400}); await prisma.pricingRule.delete({where:{id}}); return NextResponse.json({rows:await rows()})}
