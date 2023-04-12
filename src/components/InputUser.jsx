import React from 'react';
import Cleave from 'cleave.js/react'
import { Controller } from 'react-hook-form'

export const InputUserRupiah = ({title, value, rules, disabled, onChange, control, name, id, readOnly, placeholder, error}) => {
    
    let inputCleave = <Cleave 
                            className='py-3 outline-0 pl-14 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800' 
                            value={value}
                            onChange={onChange}
                            name={name}
                            id={id}
                            options={{numeral: true, numeralDecimalMark: ",", delimiter: "."}}
                        />

    if (control != undefined) {
        inputCleave = <Controller
                        name={name}
                        control={control}
                        rules={rules}
                        render={({ field }) => (
                        <Cleave 
                            className={`py-3 outline-0 pl-14 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800 ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
                            {...field} 
                            id={id}
                            disabled={disabled}
                            readOnly={readOnly} 
                            placeholder={placeholder} 
                            options={{numeral: true, numeralDecimalMark: ",", delimiter: "."}} 
                            onChange={(e) => {
                                field.onChange(e)
                                onChange && onChange(e)
                            }}
                        />
                    )}
                />
    }

    return (
        <div className='flex flex-col mb-2'>
            <span className='text-xs font-bold mb-2'>{title}</span>
            <div className='relative w-100 flex-1'>
                <div className="flex items-center absolute inset-y-0 left-0 pl-3 pointer-events-none">
                    IDR
                </div>
                {inputCleave}
            </div>
        </div>
    );
}

export const InputUser = ({title, value, rules, disabled, onChange, control, name, id, readOnly, placeholder, error}) => {
    
    let input = <input 
                    className='py-3 outline-0 pl-4 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800' 
                    value={value}
                    onChange={onChange}
                    name={name}
                    id={id}
                />

    if (control != undefined) {
        input = <Controller
                        name={name}
                        control={control}
                        rules={rules}
                        render={({ field }) => (
                        <input
                            className={`py-3 outline-0 pl-4 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800 ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
                            {...field} 
                            id={id}
                            disabled={disabled}
                            readOnly={readOnly} 
                            placeholder={placeholder}
                            onChange={(e) => {
                                field.onChange(e)
                                onChange && onChange(e)
                            }}
                        />
                    )}
                />
    }

    return (
        <div className='flex flex-col mb-2'>
            <span className='text-xs font-bold mb-2'>{title}</span>
            <div className='relative w-100 flex-1'>
                {input}
            </div>
        </div>
    );
}