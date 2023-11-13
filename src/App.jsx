import React, { useEffect, useState } from 'react'
import { getDocs } from "firebase/firestore";
import AlbumCard from "./AlbumCard";
import { fetchDatabase } from './SpotifyUtil';

const fetchAlbums = async () => {
  const colRef = await fetchDatabase("Albums")
  const snapshot = await getDocs(colRef);
  const albums = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return albums;
};


const App = () => {
  const [topAlbums, setTopAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localAlbums = JSON.parse(localStorage.getItem('albums'));

    if (localAlbums && localAlbums.length >= 2) {
      setTopAlbums(localAlbums);
      setLoading(false);
    } else {
      console.log("fetching")
      fetchAlbums()
        .then((albums) => {
          albums.pop();
          setTopAlbums(albums);
          localStorage.setItem('albums', JSON.stringify(albums));
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
        });
    }
  }, []);
  console.log(topAlbums)
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h2 className="text-3xl font-extrabold text-white text-center">Top Albums</h2>
        <div className="flex flex-wrap justify-center mt-8 gap-4">
          {topAlbums
            .slice()
            .sort((a, b) => a.id - b.id)
            .map((album) => (
              <AlbumCard key={album.id} name={album.name} image={album.imageUrl} rank={album.id} artists={album.artists} id={album.albumID} />
            ))}
        </div>
      </div>
    </div>
    );
  };

export default App