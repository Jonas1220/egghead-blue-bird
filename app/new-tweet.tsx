import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers'
import Image from "next/image";

export default function newTweet({user}:{user: User}) {
    const addTweet = async (formData: FormData) => {
        "use server" // make the functions a server function
        const title = formData.get('title')
        const supabase = createServerActionClient<Database>({ cookies })
        // const {data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase.from('tweets').insert({ title, user_id: user.id })
        }
    }
    return (
        // when functions are server functions it has to be action instead of onSubmit
        <form className="border border-gray-800 border-t-0" action={addTweet}>
            <div className="flex py-8 px-4">

                <div className="">
                    <Image className="rounded-full" src={user.user_metadata.avatar_url} alt={'user avatar'} height={48} width={48} />
                </div>
                <input name="title" className="bg-inherit flex-1 ml-2 px-2 leading-loose placeholder-gray-500 border-white" placeholder="What is happening?" />
            </div>
        </form>
    )
}
