import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import type { Role } from "../types/domain"

export function useAuthRole() {
  const [role, setRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function fetchRole() {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setRole(null); setLoading(false); return }
      const { data, error } = await supabase
        .from("roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle()
      if (!active) return
      if (error) { console.error(error); setRole(null) }
      else setRole((data?.role ?? "viewer") as Role)
      setLoading(false)
    }

    fetchRole()
    const { data: sub } = supabase.auth.onAuthStateChange(() => fetchRole())
    return () => { active = false; sub.subscription.unsubscribe() }
  }, [])

  return { role, loading }
}