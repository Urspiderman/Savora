
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  ROLE_CONFIG, isAppRole, type AppRole,
} from "@/lib/auth/roles";

export async function requireRole(requiredRole: AppRole) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: roles, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  if (roleError) {
    throw new Error("Gagal memeriksa hak akses pengguna.");
  }

  const allowedRoles = (roles ?? [])
    .map((item) => item.role)
    .filter(isAppRole);

  if (allowedRoles.length === 0) {
    redirect("/pending");
  }

  if (!allowedRoles.includes(requiredRole)) {
    redirect(ROLE_CONFIG[allowedRoles[0]].path);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  return {
    user,
    fullName: profile?.full_name || user.email?.split("@")[0] || "Pengguna",
    allowedRoles,
  };
}
