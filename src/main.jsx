import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Layout from './Layout.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ArtistPresenter from './ArtistPresenter.jsx'
import AlbumReview from './AlbumReview.jsx'
import TopArtists from './TopArtists.jsx'
import About from './About.jsx'
import NotFound from './NotFound.jsx'
import Post from './Post.jsx'
import TopPosts from './TopPosts.jsx'
import SearchResults from './SearchResults.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route index={true} element={<TopPosts />} />
          <Route path='/albums' element={<App />} />
          <Route path='/artists' element={<TopArtists />} />
          <Route path='search/:searchTerm' element={<SearchResults />} />
          <Route path='/about' element={<About />} />
          <Route path='/#' element={<App />} />
          <Route path='artist/:artistName' element={<ArtistPresenter />}/>
          <Route path='album/:albumID' element={<AlbumReview />} />
          <Route path='/post/:postID' element={<Post />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
