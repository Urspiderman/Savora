
import {
  NextResponse,
  type NextRequest,
} from "next/server";

import { createServerClient } from "@supabase/ssr";

type CookieOptions = {
  domain?: string;
  path?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  sameSite?: boolean | "lax" | "strict" | "none";
  secure?: boolean;
  priority?: "low" | "medium" | "high";
};

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function middleware(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // Pastikan konfigurasi Supabase tersedia.
  if (!supabaseUrl || !supabaseKey) {
    console.error(
      "[SAVORA] Supabase URL atau API Key belum tersedia. Periksa .env.local"
    );

    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet: CookieToSet[]) {
          // Perbarui cookie pada request.
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          // Buat response baru setelah request diperbarui.
          response = NextResponse.next({
            request,
          });

          // Perbarui cookie pada response.
          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  // Validasi dan refresh sesi Supabase.
  const { error } = await supabase.auth.getUser();

  if (error) {
    // Pengunjung yang belum login tetap dapat
    // membuka landing page, login, dan register.
    // Proteksi dashboard dilakukan pada layout role.
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
