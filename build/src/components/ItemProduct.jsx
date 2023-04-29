import React, { useState, useEffect } from 'react'
import { baseUrl, rupiah } from '../utils/strings'
import { AiOutlinePlus } from 'react-icons/ai'
import { AiFillStar } from 'react-icons/ai'
import './ItemProduct.css'

export default function ItemProduct({id, gambar, judul, harga_jual, clickAction}) {
    const [coords, setCoords] = useState({ x: -1, y: -1 })
    const [isRippling, setIsRippling] = useState(false)

    useEffect(() => {
        if(coords.x !== -1 && coords.y !== -1) {
            setIsRippling(true)
            setTimeout(() => setIsRippling(false), 800)
        } else setIsRippling(false)
    }, [coords])

    useEffect(() => {
        if(!isRippling) setCoords({ x: -1, y: -1 })
    }, [isRippling])

    const addClickAction = (component) => {
        const rect = component.target.getBoundingClientRect()
        setCoords({ x: component.clientX - rect.left, y: component.clientY - rect.top });
        clickAction && clickAction();
    }

    return (
        <>
            <div key={id} className='p-3 rounded-[20px] bg-white flex flex-col shadow cursor-pointer relative overflow-hidden item-product' onClick={(e) => addClickAction(e)}>
                
                {isRippling ? (
                    <span
                      className="ripple"
                      style={{
                        left: coords.x,
                        top: coords.y
                      }}
                    />
                ) : (
                    ''
                )}
                <div className="content">
                    <img src={baseUrl + gambar} alt={judul} className="h-24 object-cover w-full rounded-lg self-center"/>
                    <div className='mt-2'>
                        <h5 className='text-sm font-semibold tracking-wide'>{judul}</h5>
                        <div>
                            <AiFillStar size="14" className='inline-block mr-2 text-yellow-500'/>
                            <span className='inline-block mr-1 text-xs'>5.0</span>
                            <span className='text-xs'>/</span>
                            <span className='inline-block mb-2 ml-1 text-xs'>by SiResto</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-xs block text-blue-500">IDR {rupiah(harga_jual)}</p>
                          <button className="py-1 rounded-lg px-2 bg-blue-500"><AiOutlinePlus size={14} className="text-white"/></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
