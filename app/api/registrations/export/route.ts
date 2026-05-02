import { NextRequest } from "next/server";
import * as XLSX from "xlsx";
import { getAdminEmail } from "@/lib/auth";
import { schemaFromJson } from "@/lib/form-schema";
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
    include: { course: { include: { form: true } } },
    where: {
      courseId: course,
      createdAt: {
        gte: from ? new Date(from) : undefined,
        lte: to ? new Date(`${to}T23:59:59`) : undefined
      }
    }
  });

  const filteredRegistrations = registrations
    .filter((item) => {
      if (!district) return true;
      const data = item.dataJson as Record<string, string>;
      return String(data.district ?? "").toLowerCase() === district.toLowerCase();
    });
  const selectedCourse = course
    ? await prisma.course.findUnique({ where: { id: course }, include: { form: true } })
    : null;
  const labelByKey = new Map<string, string>();

  for (const item of filteredRegistrations) {
    const schema = schemaFromJson(item.course.form?.schemaJson);
    for (const field of schema.fields) {
      labelByKey.set(field.name, field.label);
    }
  }

  const columns = selectedCourse
    ? schemaFromJson(selectedCourse.form?.schemaJson).fields.map((field) => ({ key: field.name, label: field.label }))
    : Array.from(
        filteredRegistrations.reduce((keys, item) => {
          const data = item.dataJson as Record<string, unknown>;
          Object.keys(data).forEach((key) => keys.add(key));
          return keys;
        }, new Set<string>())
      ).map((key) => ({ key, label: labelByKey.get(key) ?? key }));

  const rows = filteredRegistrations.map((item) => {
      const data = item.dataJson as Record<string, string>;
      return {
        ...(!selectedCourse ? { Course: item.course.title } : {}),
        ...Object.fromEntries(columns.map((column) => [column.label, data[column.key] ?? ""])),
        Date: item.createdAt.toISOString()
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
