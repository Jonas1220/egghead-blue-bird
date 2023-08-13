"use client" // client component
// server componants can be async
// events cant be in server component
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient<Database>({ session }: { session: Session | null}) {
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    // sign in with github and redirect to auth/callback
    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider:'github',
            options: {
                redirectTo: `${location.origin}/auth/callback`
            }
        })
    }
    
    // sign out and refresh page
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    }

    // check for session
    return session ? (
        <button className="text-xs text-gray-400" onClick={handleSignOut}>Logout</button>
    ) : (
        <button className="text-xs text-gray-400" onClick={handleSignIn}>Login</button>
    )
}