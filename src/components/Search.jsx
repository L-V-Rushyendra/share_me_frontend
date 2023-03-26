import React,{useState, useEffect} from 'react'


import MasonryLayout from './MasonryLayout';
import { feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
    dataset: 'production',
    apiVersion: '2021-11-16',
    useCdn: true,
    token: process.env.REACT_APP_SANITY_TOKEN,
  })
const Search = ({searchTerm}) => {
  const [pins, setPins] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchTerm !== '') {
      setLoading(true);
      const query = searchQuery(searchTerm.toLowerCase());
      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [searchTerm]);
  return (
    <div>
      Search
      
      {loading && <Spinner message="Searching pins" />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== '' && !loading && (
        <div className="mt-10 text-center text-xl ">No Pins Found!</div>
      )}
    </div>
  )
}

export default Search
