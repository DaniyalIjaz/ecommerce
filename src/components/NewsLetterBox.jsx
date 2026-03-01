import React from 'react'

const NewsLetterBox = () => {
    const onSubmitHandler = (event) =>{
        event.preventDefault();
    }
  return (
    <div className='text-center'>
        <p className="text-2xl font-medium text-stone-900">Subscribe now & get 20% off</p>
        <p className="text-stone-600 mt-3">
        Sign up for our newsletter to stay updated on the newest fashion drops, styling tips, and exclusive offers from our clothing line!
        </p>
        <form onSubmit={onSubmitHandler} className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-cream-300 rounded-full pl-4 overflow-hidden bg-cream-50">
            <input type="email" placeholder="Enter your email" className="w-full sm:flex-1 outline-none bg-transparent text-stone-800 placeholder-stone-400" required />
            <button type="submit" className="bg-stone-900 text-cream-100 text-xs font-medium px-10 py-4 hover:bg-stone-800 transition-colors">SUBSCRIBE</button>
        </form>
      
    </div>
  )
}

export default NewsLetterBox 
