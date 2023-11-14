import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchAlbumInfo, fetchDatabase } from "./SpotifyUtil";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, addDoc } from "firebase/firestore";

const fetchPosts = async (albumName) => {
  if (!albumName) {
    return [];
  }
  const colRef = await fetchDatabase("Posts");
  const que = query(colRef, where("albumTitle", "==", albumName));
  const snapshot = await getDocs(que);
  const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return posts;
};

const AlbumReview = () => {
  const { albumID } = useParams();
  const [album, setAlbum] = useState(null);
  const [artists, setArtists] = useState([]);
  const [name, setName] = useState('');
  const [tracks, setTracks] = useState([]);
  const [totalTracks, setTotalTracks] = useState(0);
  const [image, setImage] = useState('');
  const [review, setReview] = useState('');
  let token = window.localStorage.getItem('token');
  const [expanded, setExpanded] = useState(false);
  const [posts, setPosts] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [title, setTitle] = useState('');

  const toggleTracksVisibility = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    async function fetchAlbumData() {
      const albumData = await fetchAlbumInfo(token, albumID);
      setArtists(albumData.artists);
      setName(albumData.name);
      setTracks(albumData.tracks.items);
      setTotalTracks(albumData.total_tracks);
      setAlbum(albumData);
      setImage(albumData.images[0].url);
    }
    fetchAlbumData();

    console.log("fetching")
    fetchPosts(name)
      .then((posts) => {
        setPosts(posts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [name, submitted]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const db = getFirestore();
    const colRef = collection(db, "Posts");
    addDoc(colRef, {
      albumTitle: name, 
      content: review, 
      date: new Date(),
      albumID: albumID,
      title: title,
      votes: 0
    })
      .then(() => {
        console.log("Document successfully written!");
        setSubmitted((prev) => !prev)
        setTitle('');
        setReview('');
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  
  if (!album) {
    return <div>Loading...</div>;
  } else {
    console.log(tracks[0].external_urls.spotify)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6">
        <div className="">
          <h1 className="text-4xl font-bold text-black mb-4">Album Review</h1>
        </div>
        <a href={album.external_urls.spotify}>
          <img src={image} alt={name} className="h-48 rounded-lg mx-auto" />
          <h2 className="text-2xl font-semibold text-black mb-2">{name}</h2>
        </a>

        <div className="flex flex-wrap mb-4">
          {artists.map((artist) => (
            <span
              key={artist.id}
              className="bg-green-400 text-white px-2 py-1 rounded-full text-sm mr-2"
            >
              {artist.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-bold text-black mb-2">{totalTracks} Tracks</h2>

          <button className="bg-green-400 text-white px-4 py-2 rounded-md font-semibold" onClick={toggleTracksVisibility}>
            {expanded ? 'Hide Tracks' : 'Show All Tracks'}
          </button>

          {expanded && (
            <div className="flex flex-col">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  className="bg-white p-4 rounded-md shadow-md mb-4 w-full flex flex-col items-center"
                >
                  <a href={track.external_urls.spotify} className="text-xl font-semibold text-black mb-2">
                    {track.track_number} - {track.name}
                  </a>

                  <p className="text-base text-black mr-4">
                    Duration: {(track.duration_ms / 1000 / 60).toFixed(0)} minutes
                  </p>

                  <p className="text-base text-black my-2">
                    Artists: {track.artists.map((artist) => artist.name).join(", ")}
                  </p>

                  <audio controls>
                    <source src={track.preview_url} type="audio/mpeg" />
                  </audio>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col items-center mt-4">
          <h2 className="text-xl font-semibold text-black mb-2">Leave a Review</h2>

          <form onSubmit={handleReviewSubmit} className="flex flex-col items-center">
            <input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-[600px] p-2 border rounded-md shadow-sm mb-4 "
              placeholder="Title"
            />
            <textarea
              id="review"
              name="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-[600px] p-2 border rounded-md shadow-sm mb-4 "
              rows="4"
            />

            <button
              type="submit"
              className="bg-green-400 text-white px-4 py-2 rounded-md font-semibold self-center mx-auto"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <div>
      {console.log(posts)}
        {posts && posts.map((post) => (
          <div key={post.id} className="border-b-2 border-gray-300 py-4">
            <Link to={`/post/${post.id}`}>
              <h2 className="text-xl font-semibold text-black mb-2">{post.title}</h2>
              <p className="text-base text-gray-800">{post.content}</p>
              <p className="text-sm text-gray-400">{post.date.toDate().toDateString()}</p>
              <p className="text-sm text-gray-400">Votes: {post.votes}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumReview;