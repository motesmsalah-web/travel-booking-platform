import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
const model=(prisma as any).departureCity;
async function rows(){return model.findMany({orderBy:{sortOrder:"asc"}});}
export async function GET(){await requireAdmin(); return NextResponse.json(await rows())}
export async function POST(req:Request){await requireAdmin(); const b=await req.json(); if(!b.name) return NextResponse.json({message:'الاسم مطلوب'},{status:400}); await model.create({data:{name:b.name,isActive:!!b.isActive,sortOrder:Number(b.sortOrder||0)}}); return NextResponse.json({rows:await rows()});}
export async function PUT(req:Request){await requireAdmin(); const b=await req.json(); if(!b.id||!b.name) return NextResponse.json({message:'البيانات غير مكتملة'},{status:400}); await model.update({where:{id:b.id},data:{name:b.name,isActive:!!b.isActive,sortOrder:Number(b.sortOrder||0)}}); return NextResponse.json({rows:await rows()});}
export async function DELETE(req:Request){await requireAdmin(); const id=new URL(req.url).searchParams.get('id'); if(!id)return NextResponse.json({message:'المعرف مطلوب'},{status:400}); try{await model.delete({where:{id}}); return NextResponse.json({rows:await rows()});}catch{return NextResponse.json({message:'هذه القيمة مرتبطة بأسعار موجودة. يمكنك إخفاؤها بدل حذفها.'},{status:400})}}
