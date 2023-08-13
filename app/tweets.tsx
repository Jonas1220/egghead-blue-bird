"use client"

import Likes from "./likes"
import { experimental_useOptimistic as useOptimistic } from "react"

export default function Tweets({ tweets }: { tweets:TweetWithAuthor[]}) {
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