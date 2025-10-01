import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  console.log("Products API called"); // Log sẽ hiện
  const cookie = await cookies();
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const productsPerPage = parseInt(searchParams.get("limit") || "8", 10);
  try {
    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/products?search=${query}&page=${page}&limit=${productsPerPage}`,
      {
        method: "GET",
        headers: {
          Cookie: cookie.toString(),
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("External API data:", data);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
