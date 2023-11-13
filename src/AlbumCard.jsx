import React from 'react'
import { Link } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "./components/ui/card"

const AlbumCard = ({ name, rank, image, artists, id }) => {
    return (
        <Card className="w-2/3 h-64 flex flex-row justify-between items-center bg-black text-white rounded-xl">
          <CardHeader className="w-full">
            <Link to={`/album/${id}`}>
              <div className="relative">
                <img src={image} alt={name} className="h-60 rounded-full object-cover" />
                <div className="absolute inset-0 bg-black opacity-40"></div>
              </div>
            </Link>
          </CardHeader>
          <CardContent className="w-full">
            <Link to={`/album/${id}`}>
              <CardTitle className="font-bold text-white">{name}</CardTitle>
              <h1 className="text-white">{artists}</h1>
              <CardDescription className="font-bold text-lg text-green-700">
                #{rank}
              </CardDescription>
            </Link>
          </CardContent>
        </Card>
      );
}

export default AlbumCard
