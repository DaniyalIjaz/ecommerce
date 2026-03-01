import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/frontend_assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 border-t border-cream-200">
        <Title text1='CONTACT' text2='US' />

      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6 '>
          <p className="font-semibold text-xl text-stone-800">Our Store</p>
          <p className="text-stone-600">5324 Williams Station <br /> Suit 360, Washington, USA</p>
          <p className='text-gray-500'>Ph: 21321312321 <br /> Email: asdasd@gmail.com</p>
          <p className="font-semibold text-xl text-stone-800">Careers at Forever</p>
          <p className="text-stone-600">Learn more about opportunities with us.</p>
          <button className="border border-stone-900 px-8 py-4 text-sm rounded-xl hover:bg-stone-900 hover:text-cream-100 transition-all duration-300">Explore</button>
        </div>
      </div>
      <NewsLetterBox/>
    </div>
  )
}

export default Contact
