import { NextRequest } from "next/server";
import * as XLSX from "xlsx";
import { getAdminEmail } from "@/lib/auth";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!hasDatabaseUrl) {
    return new Response("Database setup required", { status: 503 });
  }

  const admin = await getAdminEmail();
  if (!admin) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const course = searchParams.get("course") || undefined;
  const district = searchParams.get("district") || undefined;
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: { course: true },
    where: {
      courseId: course,
      createdAt: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(`${to}T23:59:59`) : undefined
      }
    }
  });

  const rows = registrations
    .filter((item) => {
      if (!district) return true;
      const data = item.dataJson as Record<string, string>;
      return String(data.district ?? "").toLowerCase() === district.toLowerCase();
    })
    .map((item) => {
      const data = item.dataJson as Record<string, string>;
      return {
        Name: data.fullName ?? data.name ?? data["full-name"] ?? "",
        Phone: data.phone ?? data.phoneNumber ?? "",
        District: data.district ?? "",
        Course: item.course.title,
        Date: item.createdAt.toISOString(),
        Notes: data.notes ?? ""
      };
    });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": "attachment; filename=hoggaan-registrations.xlsx"
    }
  });
}
