import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts.documents)
            }
        })
    }, [])
  
    if (posts.length === 0) {
        return (
            <div className="w-full py-16 text-center bg-gradient-to-br from-slate-50 to-slate-100">
                <Container>
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                            <svg className="w-24 h-24 mx-auto text-slate-300 mb-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                            <h1 className="text-4xl font-bold text-slate-800 mb-4">
                                Welcome to BlogHub
                            </h1>
                            <p className="text-xl text-slate-600 mb-8">
                                Discover amazing stories and insights from our community
                            </p>
                            <div className="bg-white rounded-lg p-6 shadow-md border border-slate-200">
                                <h2 className="text-2xl font-semibold text-slate-700 mb-2">
                                    Login to read posts
                                </h2>
                                <p className="text-slate-500">
                                    Sign in to access all the amazing content
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }
    return (
        <div className='w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100'>
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
                <Container>
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl font-bold mb-6">
                            Discover Amazing Stories
                        </h1>
                        <p className="text-xl text-slate-300 mb-8">
                            Explore our collection of inspiring posts and share your own stories with the world
                        </p>
                        <div className="flex justify-center space-x-4">
                            <div className="bg-white bg-opacity-10 rounded-lg px-6 py-3">
                                <span className="text-2xl font-bold">{posts.length}</span>
                                <p className="text-sm text-slate-300">Posts</p>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Posts Grid */}
            <div className='py-16'>
                <Container>
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Latest Posts</h2>
                        <p className="text-slate-600">Discover what's new in our community</p>
                    </div>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {posts.map((post) => (
                            <PostCard key={post.$id} {...post} />
                        ))}
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default Home