import path from "path";

export async function GET() {
  const contentPath = path.join(process.cwd(), "content", "resume.json");
  const resume = (await import(`file:///${contentPath}`)) as { default: unknown };
  return Response.json(resume.default);
}
