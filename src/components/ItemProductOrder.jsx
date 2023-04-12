import React from 'react'
import { FaTimes } from 'react-icons/fa'

export default function ItemProductOrder() {
  return (
    <div className='flex items-center space-x-3 mb-1 border-b border-slate-300 py-2'>
        <div className='w-6 h-6 border border-slate-400 flex justify-center items-center'>
            <span className='text-sm'>1</span>
        </div>
        <span className='text-slate-400'><FaTimes size={16}/></span>
        <div className='flex-1 flex justify-between items-center'>
            <div>
                <h3 className='font-bold text-sm mb-0'>Spaghetti Aglio Olio</h3>
                <span className='text-gray-300 text-xs'>Mie</span>
            </div>
            <p className='font-bold text-sm text-blue-500'>IDR 15.000</p>
        </div>
    </div>
  )
}
