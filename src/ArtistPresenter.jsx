import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchArtists, fetchAlbums } from './SpotifyUtil'; 
import { Link } from 'react-router-dom';

const ArtistPresenter = () => {
  const [artist, setArtist] = useState(null);
  const [albums, setAlbums] = useState(null);
  const { artistName } = useParams();
  let token = window.localStorage.getItem('token');
  useEffect(() => {
    async function fetchArtistData() {
      const artistsData = await fetchArtists(token, artistName);
      if (artistsData.length > 0) {
        setArtist(artistsData[0]);
        const tracksData = await fetchAlbums(token, artistsData[0].id);
        setAlbums(tracksData);
      }
    }

    fetchArtistData();
  }, [artistName]);
  console.log(artist)
  if (!artist) {
    return (
      <div
        className="w-screen h-screen flex items-center justify-center text-2xl font-semibold bg-black text-white"
      >
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <div className="w-screen h-96 flex flex-col items-center justify-center">
        <img
          src={artist.images[0].url}
          alt={artist.name}
          className="w-64 h-64 rounded-full object-cover"
        />
        <div className="mt-4">
          <h1 className="text-4xl font-bold">{artist.name}</h1>
          <p className="text-xl text-center">{artist.genres.join(', ')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <h2 className="text-3xl font-extrabold text-white text-center">Discography</h2>
        <div className="flex flex-wrap justify-center mt-8 gap-4">
          {albums && albums.map((album) => (
            <div key={album.id} className="w-64 h-64 rounded-lg overflow-hidden shadow-md">
              <Link to={`/album/${album.id}`}>
                <div className="relative">
                  <img src={album.images[0].url} alt={album.name} className="w-full h-full object-cover" />

                  <div className="absolute inset-0 bg-black opacity-70"></div>
                  <div className="absolute bottom-0 w-full p-4">
                    <h3 className="text-white font-bold text-xl">{album.name}</h3>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistPresenter;
