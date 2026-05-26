export const runtime = "nodejs";

export async function POST() {
  return Response.json(
    { error: "L'export LaTeX direct est desactive." },
    {
      status: 410,
      headers: {
        "Cache-Control": "no-store"
      }
    }
  );
}
