import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { createClient } from '@sanity/client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout'
import Spinner from './Spinner'


export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: 'production',
  apiVersion: '2021-11-16',
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN,
})



const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [pins, setPins] = useState(null);
  const {categoryId} = useParams();
  useEffect(()=>{
    setLoading(true)
    if(categoryId){
      const query = searchQuery(categoryId);
      client.fetch(query)
      .then((data)=>{
        setPins(data);
        setLoading(false);
      })
    }
    else{
      client.fetch(feedQuery)
      .then((data)=>{
        setPins(data);
        setLoading(false);
      })
    }
  },[categoryId])
 
  if(loading){ return (<Spinner message = "We are adding new ideas to your feed!" />);}
  
  if(!pins ?.length) return <h2>No pins available</h2>
  
  return (
    <div>
      {pins && <MasonryLayout pins={pins}/>}
    </div>
  )
}

export default Feed
