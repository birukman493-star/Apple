import React from 'react'
import Hero from  '../components/Hero'
import ProductSection from '../components/ProductSection'
import Home from '../components/Home'
import YouTube from '../YouTube/YouTube'
import Entertainment from '../components/Entertainment'


const main = () => {
  return (
   <>
        <Hero/>
      {/* <ProductSection/> */}
      <Home/>
      <YouTube/>
      <Entertainment/>
   </>
  )
}

export default main
