"use client" // client component
// server componants can be async
// events cant be in server component
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtonClient({ session }: { session: Session | null}) {
    const supabase = createClientComponentClient();
    const router = useRouter();

    // sign in with github and redirect to auth/callback
    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider:'github',
            options: {
                redirectTo: 'http://localhost:3000/auth/callback'
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
        <button onClick={handleSignOut}>Logout</button>
    ) : (
        <button onClick={handleSignIn}>Login</button>
    )
}