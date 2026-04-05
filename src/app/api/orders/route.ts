import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { modelSlug, name, idCardNumber, phone, email, city, vehicleType } =
    body;

  if (!modelSlug || !name || !idCardNumber || !phone) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 },
    );
  }

  const carModel = await prisma.carModel.findUnique({
    where: { slug: modelSlug },
  });

  if (!carModel) {
    return NextResponse.json(
      { error: "Car model not found" },
      { status: 404 },
    );
  }

  const order = await prisma.carOrderForm.create({
    data: {
      carModelId: carModel.id,
      name,
      idCardNumber,
      phone,
      email: email || null,
      city: city || null,
      vehicleType: vehicleType || null,
    },
  });

  return NextResponse.json({ data: order }, { status: 201 });
}
