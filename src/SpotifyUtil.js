import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

export async function fetchArtists(token, searchKey) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        q: searchKey,
        type: 'artist',
      },
    });
    return response.data.artists.items;
  } catch (error) {
    console.error('Error fetching artists:', error);
    return [];
  }
}

export async function fetchTopTracks(token, artistID) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/artists/'+ artistID +'/top-tracks?market=US&limit=10', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.tracks;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }
}

export async function fetchAlbums(token, artistID) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/artists/'+ artistID +'/albums?limit=40', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

export async function fetchAlbumsBySearch(token, albumName, artists) {
  if(artists === "Soundtrack") {
    artists = "various artists";
  }
  try {
    const response = await axios.get('https://api.spotify.com/v1/search/?q='+ albumName + " " + artists +'&type=album&market=US&limit=1', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.albums;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

export async function fetchAlbumInfo(token, albumID) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/albums/'+ albumID, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

export async function fetchAlbumTracks(token, albumID) {
  try {
    const response = await axios.get('https://api.spotify.com/v1/albums/'+ albumID +'/tracks', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    return [];
  }
}

export const fixDate = (post) => {
  let date = new Date(
    post.date.seconds * 1000 + post.date.nanoseconds / 1000000
  );
  return date.toLocaleString();
};

export const fetchDatabase = async (collectionName) => {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_DOMAIN + ".firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_DOMAIN,
    storageBucket: import.meta.env.VITE_FIREBASE_DOMAIN + ".appspot.com",
    messagingSenderId: import.meta.env.VITE_MESSAGE_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
  };

  initializeApp(firebaseConfig);
  const db = getFirestore();
  const collectionRef = collection(db, collectionName);
  return collectionRef;
};