import React, { useEffect, useState } from 'react';
import { Switch } from './components/ui/switch'
import { Button } from './components/ui/button'
import { Link } from 'react-router-dom';
import { fetchAlbumsBySearch } from './SpotifyUtil';


const SpotifySearch = () => {
  const clientId = import.meta.env.VITE_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_REDIRECT_URI;
  const authEndpoint = import.meta.env.VITE_AUTH_ENDPOINT;
  const responseType = import.meta.env.VITE_RESPONSE_TYPE;
  var scope = "streaming \
        user-read-email \
        user-read-private"
  
  const [token, setToken] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [artists, setArtists] = useState([]);
  const [searchType, setSearchType] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (hash) {
      token = hash
        .substring(1)
        .split('&')
        .find((elem) => elem.startsWith('access_token'))
        .split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }
    
    setToken(token);
    }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  const handleSearch = (e) => {
    setSearchKey(e.target.value);
  };

  return (
    <div className='flex flex-row items-center justify-evenly gap-2'>
      {!token ? (
        <a
          href={`${authEndpoint}?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&response_type=${responseType}&show_dialog=true`}
          className='text-black hover:bg-green-400 bg-red-400 p-2 rounded-lg'
        >
          Login to Spotify
        </a>
      ) : (
        <Button onClick={logout} className='bg-green-400 text-black rounded-lg hover:bg-red-400'>Logout</Button>
      )}
 
      {token && 
        <div className='flex flex-row justify-evenly items-center w-full'>
          <Switch id='search-type' onClick={(e) => setSearchType((type) => !type)} className='mr-2'/>
          <input type="text" onChange={handleSearch} placeholder={searchType? 'Search Arists' : "Search Posts"} value={searchKey} className={`text-black text-bold ${searchType ? "placeholder:text-green-400" : "placeholder:text-indigo-400"}`}/>
          <Link to={`/search/${searchKey + "-" + searchType}`}>
            <Button className={`ml-2 bg-white text-black rounded-lg ${searchType ? "hover:bg-green-300" : "hover:bg-indigo-400"}`}>Search</Button>
          </Link>
        </div>
      }
    </div>
  );
};

export default SpotifySearch;

