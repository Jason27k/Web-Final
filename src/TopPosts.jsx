import React, { useEffect, useState } from 'react'
import { getDocs, query, orderBy, limit } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { fixDate, fetchDatabase } from './SpotifyUtil';
import Albums from "./assets/albums.png"

const fetchTopPosts = async (sortOrder) => {
    const ref = await fetchDatabase("Posts")
    const postQuery = query(ref, sortOrder === "highest_voted" ? orderBy("votes", "desc") : orderBy("date", "desc"), limit(20))
    const snapshot = await getDocs(postQuery);
    const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return posts;
};

const TopPosts = () => {
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("highest_voted");

  useEffect(() => {
    console.log("fetching");
    fetchTopPosts(sortOrder)
    .then((posts) => {
        setTopPosts(posts);
        localStorage.setItem("posts", JSON.stringify(posts));
        setLoading(false);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
    });
  }, [sortOrder]);

  const handleSortChange = (newSortOrder) => {
    if (newSortOrder === sortOrder) {
        return;
    }
    setSortOrder(newSortOrder);
    fetchTopPosts(newSortOrder);
  };

  console.log(topPosts.length)

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-6xl font-extrabold text-white text-center mb-8">
          Top Posts
        </h2>
        <img src={Albums} alt="Albums" className="h-64 object-cover mx-auto" />
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-white text-black px-2 py-1 rounded-md"
            onClick={() => handleSortChange("highest_voted")}
          >
            Highest Voted
          </button>
          <button
            className="bg-white text-black px-2 py-1 rounded-md"
            onClick={() => handleSortChange("most_recent")}
          >
            Most Recent
          </button>
        </div>

        <div className="flex flex-col items-center flex-wrap justify-center mt-8 gap-4">
          {topPosts.map((post) => (
            <div
              key={post.id}
              className="w-full mb-4 border-white border-2 p-4">
              <Link to={`/post/${post.id}`}>
                <h2 className="text-xl font-bold">{post.title}</h2>
                <p className="text-lg">{post.content}</p>
                <p className="text-lg">{post.albumTitle}</p>
                <div className="flex items-center justify-between mt-2">
                    <p className="">Upvotes: {post.votes}</p>
                    <p className="">Date: {fixDate(post)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default TopPosts