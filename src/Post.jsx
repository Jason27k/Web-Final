import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
import { initializeApp } from "firebase/app";
import { getFirestore, 
    collection, 
    getDocs, 
    query, 
    where, 
    addDoc, 
    updateDoc, 
    doc, 
    getDoc, 
    deleteDoc } from "firebase/firestore";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Textarea } from './components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
  } from "./components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from './components/ui/alert-dialog';
import NotFound from './NotFound';

const fetchPostAndComments = async (postID) => {
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
  const ref = doc(db, `Posts/${postID}`);
  const docSnap = await getDoc(ref);
  const postData = docSnap.data();
  const commentRef = collection(db, "Comments");
  const commentQue = query(commentRef, where("postID", "==", postID));
  const commentSnapshot = await getDocs(commentQue);
  const commentData = commentSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

  return [postData, commentData];
};

const Post = () => {
  const { postID } = useParams();
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postAlbumTitle, setPostAlbumTitle] = useState("");
  const [postAlbumID, setPostAlbumID] = useState("");
  const [postDate, setPostDate] = useState("");
  const [postVotes, setPostVotes] = useState(0);
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if(isDeleted) {
        setPostTitle("");
        setPostContent("");
        setPostAlbumTitle("");
        setPostAlbumID("");
        setPostDate("");
        setPostVotes(0);
        setComments([]);
        return;
    }
    async function fetchPostData() {
      const [postData, commentData] = await fetchPostAndComments(postID);
      setPostTitle(postData.title);
      setPostContent(postData.content);
      setPostAlbumTitle(postData.albumTitle);
      setPostAlbumID(postData.albumID);
      setPostDate(postData.date.toDate().toDateString());
      setPostVotes(postData.votes);
      setComments(commentData);
    }

    fetchPostData();
  }, [postID, submitted, isDeleted]);

  const handleVote = async (postID, vote) => {
    const db = getFirestore();
    const ref = doc(db, `Posts/${postID}`);
    const docSnap = await getDoc(ref);
    const postData = docSnap.data();
    const newVotes = postData.votes + vote;
    await updateDoc(ref, { votes: newVotes });
  }

  const handleUpvote = () => {
    handleVote(postID, 1);
    setPostVotes((vote) => vote + 1);
  };

  const handleDownvote = () => {
    handleVote(postID, -1);
    setPostVotes((vote) => vote - 1);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const db = getFirestore();
    const colRef = collection(db, "Comments");
    addDoc(colRef, {
      content: newCommentContent, 
      date: new Date(),
      postID: postID
    })
      .then(() => {
        console.log("Document successfully written!");
        setSubmitted((prev) => !prev)
        setNewCommentContent('');
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const handleDeletePost = async () => {
    const db = getFirestore();
    const commentRef = collection(db, "Comments");
    const commentQuery = query(commentRef, where("postID", "==", postID));
    const commentSnapshot = await getDocs(commentQuery);

    commentSnapshot.docs.forEach(async (doc) => {
        await deleteDoc(doc);
    });
    const ref = doc(db, `Posts/${postID}`);
    await deleteDoc(ref);
    setIsDeleted(true);
  };

  const handleEditPost = async () => {
    console.log("edit post")
    const db = getFirestore();
    const ref = doc(db, `Posts/${postID}`);
    await updateDoc(ref, { title: editedTitle, content: editedContent, date: new Date() });
    setPostTitle(editedTitle);
    setPostContent(editedContent);
    setEditedTitle('');
    setEditedContent('');
  }

  return (
  <div className="flex flex-col items-center mt-10">
    <Link to={`/album/${postAlbumID}`}> 
      <h1 className="text-6xl font-bold text-gray-900 mb-4">{postAlbumTitle}</h1>
    </Link>
    <div className="w-full max-w-2xl rounded-lg shadow-md bg-white p-6">
      <div className="flex flex-col items-start">
        <h1 className="text-5xl font-bold text-gray-800">{postTitle}</h1>
        <h2 className="text-3xl font-semibold text-gray-700">{postContent}</h2>
        <div className='flex flex-row justify-between w-full'>
          <p className="text-lg text-gray-500">Votes: {postVotes}</p>
          <p className="text-lg text-gray-500">Date: {postDate}</p>
        </div>
        
      </div>
      <div className="flex items-center justify-between mt-4">
        {!isDeleted  &&
        <div className="flex items-center">
            <button
            className="bg-green-400 text-white px-2 py-1 mr-2 rounded-md"
            onClick={handleUpvote}>
                Upvote (+1)
            </button>

            <button
            className="bg-red-400 text-white px-2 py-1 rounded-md"
            onClick={handleDownvote}>
                Downvote (-1)
            </button>
        </div>
        }

        <div className="flex items-center">
            {!isDeleted && 
            <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className='bg-green-400 text-white px-2 py-1 rounded-md'>Edit Post</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your post here. Click save when you're done.
                    </DialogDescription>
                    </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="title" className="text-right">
                                    Title
                                </Label>
                                <Input id="title" value={editedTitle} 
                                    onChange={(e) => setEditedTitle(e.target.value)} 
                                    className="col-span-3" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="content" className="text-right">
                                    Content
                                </Label>
                                <Textarea id="content" value={editedContent} 
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="col-span-3" />
                            </div>
                        </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" onClick={handleEditPost}>Save changes</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <AlertDialog>
                <AlertDialogTrigger className=''>
                <Button variant="outline" className='bg-red-400 text-white px-2 py-1 rounded-md'>Delete</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your post
                            and remove all comments from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeletePost}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            </div>
            }
        </div>
      </div>
      <div className="flex flex-col mt-20">
        <h2 className="text-3xl font-semibold text-gray-700">Comments</h2>
        <div className="flex flex-col">
          {comments && comments.map((comment) => (
            <div key={comment.id} className="w-full max-w-2xl rounded-lg shadow-md bg-white p-6 my-5">
              <h2 className="text-3xl font-semibold text-gray-700">{comment.content}</h2>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment}>
          <textarea
            className="w-full max-w-2xl rounded-lg shadow-md bg-white p-2"
            placeholder="Add a comment..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          />
          {!isDeleted && <button
            className="bg-green-400 text-white px-2 py-1 mr-2 rounded-md mt-2"
            type="submit"
          >
            Add Comment
          </button>
          }
        </form>
      </div>
    </div>
  </div>
 );
}

export default Post;