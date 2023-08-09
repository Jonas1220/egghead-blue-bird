import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { cookies } from "next/headers";
import AuthButtonClient from "./auth-button-client";

export default async function AuthButtonServer() {
    // get supabase session and load AuthButtonClient
    const supabase = createServerComponentClient({ cookies })
    const { data: { session }} = await supabase.auth.getSession();
    return <AuthButtonClient session={session} />
}