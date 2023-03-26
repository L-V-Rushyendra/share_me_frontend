import React from 'react'
import { GoogleLogin, GoogleOAuthProvider, googleLogout }from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { FcGoogle }from 'react-icons/fc'
import shareVideo from '../assets/share.mp4'
import logo from '../assets/logowhite.png';
import jwt_decode from "jwt-decode";
import { createClient } from '@sanity/client';


const Login = () => {
  const navigate = useNavigate();
  const responseGoogle=(response)=>{
    var decodedHeader = jwt_decode(response.credential);
    
    localStorage.setItem('user', JSON.stringify(decodedHeader))
    console.log(JSON.stringify(decodedHeader));
    const { name, sub, picture } = decodedHeader;
      const client = createClient({
        projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
        dataset: 'production',
        apiVersion: '2021-11-16',
        useCdn: true,
        token: process.env.REACT_APP_SANITY_TOKEN,
    })
      const doc = {
        _id:sub,
        _type:'user',
        userName: name,
        image: picture,
      }
      client.createIfNotExists(doc)
      .then(()=>{
        navigate('/', {replace: true})
      })
  }
  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video src={shareVideo}
        type="video/mp4"
        loop
        muted
        controls={false}
        autoPlay
        className='w-full h-full object-cover'
        />
        <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
          <div className="p-5">
            <img src={logo} width="130px" />
          </div>
          <GoogleOAuthProvider 
            clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}
          >
          <GoogleLogin 
            render={(renderProps)=>(
              <button
                type='button'
                className='bg-mainColor flex justify-center item-center p-3 rounded-lg cursor-pointer outline-none'
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
              </button>
            )}
            onSuccess={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy={'single_host_origin'}
          />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  )
}

export default Login
