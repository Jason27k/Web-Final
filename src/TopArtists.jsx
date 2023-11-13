import React, { useEffect, useState } from 'react'
import { getDocs } from "firebase/firestore";
import ArtistCard from "./ArtistCard";
import { fetchDatabase } from './SpotifyUtil';

const fetchArtists = async () => {
  const colRef = await fetchDatabase("Artists")
  const snapshot = await getDocs(colRef);
  const artists = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  return artists;
};

const TopArtists = () => {
    const [topArtist, setTopArtist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const localArtists = JSON.parse(localStorage.getItem('artists'));

      if (localArtists && localArtists.length >= 2) {
        setTopArtist(localArtists);
        setLoading(false);
      } else {
        console.log("fetching")
        fetchArtists()
          .then((artists) => {
            setTopArtist(artists);
            localStorage.setItem('artists', JSON.stringify(artists));
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setLoading(false);
          });
      }
    }, []);
  
      console.log(topArtist)
      if (loading) {
        return <div>Loading...</div>;
      }
    
      return (
        <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-3xl font-extrabold text-white text-center">Top Artists</h2>
          <div className="flex flex-wrap justify-center mt-8 gap-4">
            {topArtist
              .slice()
              .sort((a, b) => a.id - b.id)
              .map((artist) => (
                <ArtistCard key={artist.id} name={artist.name} image={artist.imageUrl} rank={artist.id} />
              ))}
          </div>
        </div>
      </div>
      );
    };
    

export default TopArtists