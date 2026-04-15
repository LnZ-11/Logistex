import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const categorySchema = z.object({
  nom: z.string().min(1),
  description: z.string().optional(),
  parentId: z.coerce.number().int().positive().optional().nullable(),
});

export async function GET(request: Request) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { nom: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);
    
    const category = await prisma.category.create({
      data: validatedData
    });
    
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
