import { useEffect } from "react"
import { supabase } from "../lib/supabaseClient"

export function useRealtime(onChange: (ev: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel("realtime:products_and_movements")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, onChange)
      .on("postgres_changes", { event: "*", schema: "public", table: "stock_movements" }, onChange)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [onChange])
}