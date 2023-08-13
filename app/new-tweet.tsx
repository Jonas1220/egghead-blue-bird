import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'

export default function newTweet() {
    const addTweet = async (formData: FormData) => {
        "use server" // make the functions a server function
        const title = formData.get('title')
        const supabase = createServerActionClient<Database>({ cookies })
        const {data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('tweets').insert({ title, user_id: user.id })
        }
    }
    return (
        // when functions are server functions it has to be action instead of onSubmit
        <form action={addTweet}>
            <input name="title" className="bg-inherit border-white border" />
        </form>
    )
}
