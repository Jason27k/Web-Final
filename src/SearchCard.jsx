import React from "react"
import { Link } from "react-router-dom"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "./components/ui/card"
  
  const SearchCard = ({name, image, followers}) => {
    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    console.log(image)
    return (
        <Card className="w-full h-80 flex flex-row justify-between items-center text-black">
          <CardHeader>
              <img src={image} className="h-56 w-56" alt={name} />
          </CardHeader>
          <CardContent>
              <CardTitle className='w-96'>{name}</CardTitle>
          </CardContent>
          <CardFooter>
              <CardDescription className='font-bold'>{followers && formatNumberWithCommas(followers)}</CardDescription>
          </CardFooter>
        </Card>
      );
    };
    
    export default SearchCard;