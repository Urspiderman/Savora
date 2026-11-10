import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({error:"AI provider belum dikonfigurasi"},{status:501}); }
