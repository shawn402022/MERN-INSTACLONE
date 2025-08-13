import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {
    const { posts } = useSelector((store) => store.post)
    const safePosts = Array.isArray(posts) ? posts : []
    return (
        <div>
            {
                safePosts.map((post) => (
                    <Post key={post._id} post={post} />
                ))
            }
        </div>
    )
}

export default Posts
