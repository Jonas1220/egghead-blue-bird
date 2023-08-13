import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AuthButtonServer from './auth-button-server';
import NewTweet from './new-tweet';
import { redirect } from 'next/navigation';
import Likes from './likes';

export default async function Home() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session }} = await supabase.auth.getSession();

    if (!session) {
        redirect('/login')
    }
    
    const { data } = await supabase.from("tweets").select('*, author: profiles(*), likes(user_id)');

    // if data is available map through if not empty array
    const tweets = data?.map(tweet => ({
        ...tweet,
        user_has_liked: tweet.likes.find(like => like.user_id === session.user.id),
        likes: tweet.likes.length
    })) ?? []
    return (
        <>
            <AuthButtonServer />
            <NewTweet />
            {/* map through tweets array */}
            {tweets?.map((tweet) => (
                <div key={ tweet.id }>
                    <p>{ tweet?.author?.name } @{ tweet?.author?.username }</p>
                    <p>{ tweet.title }</p>
                    <Likes tweet={tweet} />
                </div>
            ))}
        </>
    )
}
