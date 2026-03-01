import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'

const CartTotal = () => {
    const {currency, delivery_fee, getCartAmount} = useContext(ShopContext)
  return (
    <div className='w-full'>
        <div className='text-2xl'>
            <Title text1={'CART'} text2={'TOTALS'}/>

        </div>
        <div className="flex flex-col gap-3 mt-3 text-sm text-white opacity-90">
            <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="font-medium text-white opacity-90">{currency}{getCartAmount()}</p>
            </div>
            <p className="border-t border-cream-200" />
            <div className="flex justify-between">
                <p>Shipping Fee</p>
                <p className="font-medium text-white opacity-90">{currency}{delivery_fee}</p>
            </div>
            <p className="border-t border-cream-200" />
            <div className="flex justify-between text-stone-900 font-semibold">
                <p>Total</p>
                <p>{currency}{getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}</p>
            </div>
        </div>
      
    </div>
  )
}

export default CartTotal
