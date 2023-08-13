"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Likes from "./likes"
import { useEffect, experimental_useOptimistic as useOptimistic } from "react"
import { useRouter } from "next/navigation";

export default function Tweets({ tweets }: { tweets:TweetWithAuthor[]}) {
    const supabase = createClientComponentClient();
    const router = useRouter();
    useEffect(() => {
        const channel = supabase.channel('realtime tweets').on('postgres_changes', {
            event: '*',
            schema:'public',
            table: 'tweets'
        }, (payload) => {
            // console.log(payload);
            router.refresh();
        }).subscribe()

        return () => {
            supabase.removeChannel(channel);
        }
    },[supabase, router])
    // create a optimistic hook, write the 
    const [optimisticTweets, addOptimisticTweet] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(
        tweets,
        (currentOptimisticTweets, newTweet) => {
            const newOptimisticTweets = [... currentOptimisticTweets]
            const index = newOptimisticTweets.findIndex((tweet) => tweet.id === newTweet.id) // get index of old tweet
            newOptimisticTweets[index] = newTweet; // update index with new tweet
            return newOptimisticTweets;
        }
    )
    
    // map through tweets array
    return optimisticTweets.map((tweet) => (
        <div key={ tweet.id }>
            <p>{ tweet.author.name } @{ tweet.author.username }</p>
            <p>{ tweet.title }</p>
            <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweet} />
        </div>
    ))
}