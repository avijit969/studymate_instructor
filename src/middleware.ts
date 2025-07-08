import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const protectedRoutes = ["/"];
const publicRoutes = ["/login", "/signup"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("accessToken")?.value;
  let session = { userId: null };

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/isLoggedIn`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${cookie}`,
        },
      }
    );

    if (response.status === 200) {
      const data = response.data;
      session.userId = data?._id || null;
    } else {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
  } catch (error) {
    console.error("Error fetching session data:", error);
  }

  if (isProtectedRoute && !session.userId) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/signup"],
};
