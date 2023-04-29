import React from 'react';
import "cleave.js/dist/addons/cleave-phone.id";
import Cleave from 'cleave.js/react'
import { Controller } from 'react-hook-form'
import { BsFillTelephoneFill } from 'react-icons/bs'

export const InputUserRupiah = ({title, value, rules, disabled, onChange, control, name, id, readOnly, placeholder, error}) => {
    
    let inputCleave = <Controller
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
                            />
                        )}
                    />

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

export const InputUser = ({title, value, type = 'text', rules, disabled, onChange, control, name, id, readOnly, placeholder, error}) => {
    
    let input = <input 
                    className='py-3 outline-0 pl-4 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800' 
                    value={value}
                    type={type}
                    onChange={onChange}
                    name={name}
                    id={id}
                />

    if (control !== undefined) {
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

export const InputUserWithIcon = ({ type, id, icon, directionIcon, disabled, placeholder, className, value, readOnly, error, onChange, name="" }) => {
    let directionLeft = ''
    let directionRight = ''
    let paddingIcon = ''
    if(directionIcon === 'left') {
        directionLeft = <span className='absolute left-4 text-gray-500 z-40'>{icon}</span>
        paddingIcon = 'pl-12'
    } else {
        directionRight = <span className='absolute right-4 text-gray-500 z-40'>{icon}</span>
        paddingIcon = 'pr-12'
    }

    let input = <input 
                    className={`input input-bordered ${paddingIcon} border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full p-2.5 ${className ?? ''} ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
                    type={type}
                    id={id}
                    name={name}
                    disabled={disabled}
                    value={value}
                    readOnly={readOnly}
                    placeholder={placeholder} 
                    onChange={onChange}
                />

    return (
        <React.Fragment>
            <div className="relative flex items-center">
                {directionLeft}
                {input}
                {directionRight}
            </div>
        </React.Fragment>
    );
}

export const InputUserTelepon = ({ id, directionIcon, disabled, placeholder, className, control, value, readOnly, error, rules = {required: false}, onChange, name="" }) => {
    let directionLeft = ''
    let directionRight = ''
    let paddingIcon = ''
    let icon = <BsFillTelephoneFill size="20"/>
    if(directionIcon === 'left') {
        directionLeft = <span className='absolute left-4 text-gray-500 z-40'>{icon}</span>
        paddingIcon = 'pl-12'
    } else {
        directionRight = <span className='absolute right-4 text-gray-500 z-40'>{icon}</span>
        paddingIcon = 'pr-12'
    }

    let input = <Cleave 
                    className={`input input-bordered ${paddingIcon} border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full p-2.5 ${className ?? ''} ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
                    id={id}
                    name={name}
                    disabled={disabled}
                    value={value}
                    options={{ phone: true, phoneRegionCode: "ID" }}
                    readOnly={readOnly}
                    placeholder={placeholder} 
                    onChange={onChange}
                />

    return (
        <React.Fragment>
            <div className="relative flex items-center">
                {directionLeft}
                {input}
                {directionRight}
            </div>
        </React.Fragment>
    );
}

export const InputGroupCurrency = ({ type, id, icon, directionIcon, disabled, placeholder, control, value, readOnly, error, rules = {required: false}, onChange, name="" }) => {

    let input = ''

    let directionLeft = ''
    let directionRight = ''
    let paddingIcon = ''
    if(directionIcon === 'left') {
        directionLeft = <span className='absolute left-4 text-gray-500 z-40'>{icon}</span>
        paddingIcon = 'pl-12'
    } else {
        directionRight = <span className='absolute right-4 text-gray-500 z-40'>{icon}</span>
        paddingIcon = 'pr-12'
    }

    if(control !== undefined) {
        input = <Controller
                name={name}
                control={control}
                defaultValue={value}
                rules={rules}
                render={({ field }) => (
                    <Cleave 
                        className={`py-3 outline-0 pl-14 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800 ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
                        type={type}
                        id={id} 
                        disabled={disabled}
                        readOnly={readOnly}
                        {...field}
                        placeholder={placeholder} 
                        options={{numeral: true, numeralDecimalMark: ",", delimiter: "."}}
                        onChange={(e) => {
                            field.onChange(e)
                            onChange && onChange(e)
                        }}
                    />
                )}
            />
    } else {
        input = <Cleave 
                    className={`py-3 outline-0 pl-14 w-full bg-slate-100 border border-slate-100 rounded-lg box-border focus:border-blue-800 ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
                    type={type}
                    id={id}
                    name={name}
                    disabled={disabled}
                    value={value}
                    readOnly={readOnly}
                    placeholder={placeholder} 
                    options={{numeral: true, numeralDecimalMark: ",", delimiter: "."}}
                    onChange={onChange}
                />
    }

    return (
        <React.Fragment>
            <div className="relative flex items-center">
                {directionLeft}
                {input}
                {directionRight}
            </div>
        </React.Fragment>
    );
}