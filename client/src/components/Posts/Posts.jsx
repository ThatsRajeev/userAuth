import React, {useState, useEffect, useCallback, useRef} from "react";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import "./Posts.css";

function Posts() {
    const [posts, setPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState(new Set());
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);

    const toggleExpanded = (postId) => {
        setExpandedPosts(prevSet => {
            if (prevSet.has(postId)) {
                const newSet = new Set(prevSet);
                newSet.delete(postId);
                return newSet;
            } else {
                return new Set(prevSet).add(postId);
            }
        });
    };

    const observer = useRef();
    const lastPostElementRef = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPageNumber(prevPageNumber => prevPageNumber + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/posts?limit=10&skip=${(pageNumber - 1) * 10}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                    }
                });
                setPosts([...posts, ...response.data.posts]); 
                setHasMore(response.data.posts.length > 0); 
                setLoading(false);
            } catch (error) {
                toast.error('Error fetching posts:', error);
                setLoading(false);
            }
        };

        fetchPosts();
    }, [pageNumber]);

    return (
        <section className="container mx-auto p-4">
            <Toaster
            position="bottom-center"
            />
            <div className="grid grid-cols-1 gap-4">
                {posts.map((post, index) => {
                    if (posts.length === index + 1) {
                        return (
                            <div class="max-w-lg mx-auto">
                                <div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5" ref={lastPostElementRef} key={post.id} >
                                    <a href="#">
                                        <img class="rounded-t-lg" src="https://flowbite.com/docs/images/blog/image-1.jpg" alt="" />
                                    </a>
                                    <div class="p-5">
                                        <a href="#">
                                            <h5 class="text-gray-900 font-bold text-2xl tracking-tight mb-2">{post.title}</h5>
                                        </a>
                                        <p className={`font-normal text-gray-700 mb-3 ${expandedPosts.has(post.id) ? '' : 'line-clamp-4'}`}>{post.body}</p>
                                        <div class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center cursor-pointer" onClick={() => toggleExpanded(post.id)}>
                                            {expandedPosts.has(post.id) ? 'Read Less' : 'Read More'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div class="max-w-lg mx-auto">
                                <div class="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5" key={post.id} >
                                    <a href="#">
                                        <img class="rounded-t-lg" src={post.image} alt="" />
                                    </a>
                                    <div class="p-5">
                                        <a href="#">
                                            <h5 class="text-gray-900 font-bold text-2xl tracking-tight mb-2">{post.title}</h5>
                                        </a>
                                        <p className={`font-normal text-gray-700 mb-3 ${expandedPosts.has(post.id) ? '' : 'line-clamp-4'}`}>{post.body}</p>
                                        <div class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center cursor-pointer" onClick={() => toggleExpanded(post.id)}>
                                            {expandedPosts.has(post.id) ? 'Read Less' : 'Read More'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
            {loading && (
            <div className="flex items-center justify-center">
                <p className="text-gray-600 text-lg ">Loading...</p>
            </div>
            )}
        </section>
      );
}

export default Posts;