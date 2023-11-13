import { useParams } from 'react-router-dom'
import React, { useEffect, useState } from 'react';
import {  getDocs, query, where } from "firebase/firestore";
import { fetchArtists, fixDate, fetchDatabase } from './SpotifyUtil';
import SearchCard from './SearchCard.jsx';
import { Link } from 'react-router-dom';

const fetchResults = async (collectionName, postTitle, colName) => {
    if (!postTitle) {
      return [];
    }
    let resultRef = await fetchDatabase(collectionName);
    const snapshot = await getDocs(query(resultRef, where(colName, "==", postTitle)));
    const posts = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return posts;
  };

const SearchResults = () => {
  const { searchTerm } = useParams()
  const terms = searchTerm.split('-')
  const [searchKey, setSearchKey] = useState('');
  const [results, setResults] = useState([]);
  const isArtist = terms[1] === "true"
  const token = window.localStorage.getItem('token');
  if(terms[0] !== searchKey) {
    setSearchKey(terms[0])
  } 
  useEffect(() => {
    console.log("fetching")
    setResults([])
    async function fetchArtistData() {
      const artistsData = await fetchArtists(token, searchKey);
      setResults(artistsData);
    }
    if(isArtist) {
        fetchArtistData()
    } else {
        fetchResults("Posts", terms[0], "title")
        .then((posts) => {
            setResults(posts);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
    }
  }, [searchTerm]);
  console.log(results)
  return (
    <div className='flex flex-col items-center bg-white w-full'>
        <h1 className='text-4xl font-bold my-4'>{isArtist? "Artists" : "Posts"}</h1>
        {token && isArtist ? 
            <div>
                {results.map((result) => (
                    <Link to={`/artist/${result.name}`}>
                        <SearchCard key={result.id} name={result.name} 
                        image={result.images && result.images.length > 0 ? result.images[0].url : ''} followers={result.followers && result.followers.total} />
                    </Link>
                ))}
            </div>
          : <div className='w-screen'>
                {results.map((result) => (
                 <div
                 key={result.id}
                 className="w-3/4 mx-auto mb-4 border-black border-2 p-4">
                  <Link to={`/post/${result.id}`}>
                    <h2 className="text-xl font-bold">{result.title}</h2>
                    <p className="text-lg">{result.content}</p>
                    <p className="text-lg">{result.albumTitle}</p>
                    <div className="flex items-center justify-between mt-2">
                        <p className="">Upvotes: {result.votes}</p>
                        {result.date && <p className="">Date: {fixDate(result)}</p>}
                    </div>
                 </Link>
                </div>
                ))}
            </div>
        }
      </div>
  )
}

export default SearchResults