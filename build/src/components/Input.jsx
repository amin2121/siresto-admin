import React from 'react';

// icons
import { IoSearchOutline } from 'react-icons/io5'

// libraries
import Cleave from 'cleave.js/react'
import { Controller } from 'react-hook-form'

export const InputGroup = ({ type, id, icon, directionIcon, placeholder, className, Controllerd, control, disabled, value, readOnly, error, rules = {required: true}, onChange, onBlur, name="" }) => {

	let directionLeft = ''
	let directionRight = ''
	let paddingIcon = ''
	if(directionIcon === 'left') {
		directionLeft = <span className='absolute left-4 text-gray-500 z-40'>{icon}</span>
		paddingIcon = 'pl-14'
	} else {
		directionRight = <span className='absolute right-4 text-gray-500 z-40'>{icon}</span>
		paddingIcon = 'pr-14'
	}

	let input = ''
	if(control !== undefined) {
		input = <Controller
				name={name}
				control={control}
				rules={{ required: true }}
				render={(props) => (
					<input 
						className={`input input-bordered ${paddingIcon} !outline-0 input-bordered border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full ${className ?? ''} ${error ? '!border-red-400 focus:ring-red-600' : ''}`} 
						type={type} 
						id={id}
						disabled={disabled}
						{...props.field}
						placeholder={placeholder}
						readOnly={readOnly}
						onChange={(event) => {
							onChange && onChange(event)
							props.field.onChange(event)
						}}
					/>
				)}
			/>
	} else {
		input = <input 
					type={type} 
					id={id} 
					disabled={disabled}
					className={`input input-bordered ${paddingIcon} !outline-0 input-bordered border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full ${className ?? ''}`} 
					placeholder={placeholder}
					onChange={onChange}
					name={name}
					value={value}
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
};

export const Input = ({type, id, placeholder, name, className, disabled, control, readOnly, rules, value, error, onChange, onBlur}) => {	
	let input = ''
	if(control !== undefined) {
		input = <Controller
					name={name}
					control={control}
					rules={rules}
					render={({ field }) => (
						<input 
							className={`input input-bordered !outline-0 input-bordered border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full ${className ?? ''} ${error ? '!border-red-400 focus:ring-red-600' : ''}`} 
							type={type} 
							id={id}
							disabled={disabled}
							placeholder={placeholder}
							readOnly={readOnly}
							{...field}
							onChange={(e) => {
								field.onChange(e)
								onChange && onChange(e)
							}}
						/>
					)}
				/>
	} else {
		input = <input 
					type={type} 
					id={id} 
					value={value}
					disabled={disabled}
					className={`input input-bordered !outline-0 input-bordered border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full ${className ?? ''}`} 
					placeholder={placeholder}
					onChange={onChange} 
					name={name}
				/>
	}

	return (
        <div className="relative">
		  	{input}
		</div>
    );
}

export const InputCurrency = ({id, placeholder, className, name, value, disabled, control, rules, error, onKeyUp, onChange, readOnly}) => {

	let input = ''
	if(control !== undefined) {
		input = <Controller
		      		name={name}
		      		control={control}
		      		rules={rules}
		      		render={({ field }) => (
        			<Cleave 
        				className={`input input-bordered !outline-0 border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full ${className ?? ''} ${error ? '!border-red-400 focus:ring-red-600' : ''}`}
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

	} else {
		input = <Cleave 
					className={`input input-bordered !outline-0 input-bordered border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full ${className ?? ''} `}
					id={id}
					name={name}
					disabled={disabled}
					readOnly={readOnly}
					value={value}
					placeholder={placeholder}
					onChange={onChange}
					options={{numeral: true, numeralDecimalMark: ",", delimiter: "."}}
				/>
	}

	return (
        <div className="relative">
        	{input}
		</div>
    );
}

export const InputGroupCurrency = ({ type, id, icon, directionIcon, disabled, placeholder, className, control, value, readOnly, error, rules = {required: false}, onChange, onBlur, name="" }) => {

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
						className={`input input-bordered ${paddingIcon} border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full p-2.5 ${className ?? ''} ${error ? 'border-red-400 focus:ring-red-600' : ''} `}
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
					className={`input input-bordered ${paddingIcon} border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full p-2.5 ${className ?? ''}`}
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

export const Textarea = ({id, placeholder, className, name, control, rules, error, onChange, readOnly, children}) => {
	let input = ''
	if(control !== undefined) {
		input = <Controller
					name={name}
					control={control}
					rules={rules}
					render={({ field }) => (
						<textarea 
							className={`textarea textarea-bordered w-full border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 ${className ?? ''} ${error ? 'border-red-400 focus:ring-red-600' : ''}`}
							placeholder={placeholder} 
							col="40"
							rows="5"
							{...field}
							onChange={(e) => {
								field.onChange(e)
								onChange && onChange(e)
							}}
							readOnly={readOnly}>
								{children}
						</textarea>
					)}
				/>
	} else {
		input = <textarea 
					className={`textarea textarea-bordered border-blue-500 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 ${className ?? ''}`} 
					placeholder={placeholder} 
					col="20"
					rows="5"
					onChange={onChange}
					readOnly={readOnly}
					name={name}>
						{children}
				</textarea>
	}

	return (
		<React.Fragment>
			{input}
		</React.Fragment>)
}

export const SearchProduct = ({type, id, placeholder, className, register, label, required, defaultValue, error, onKeyUp, onChange}) => {

	let input = ''
	if(register !== undefined) {
		input = <input 
					type={type} 
					id={id} 
					className={`!outline-0 input input-bordered border-gray-300 text-gray-900 text-sm !focus:ring-0 !focus:ring-offset-0 focus:border-2 block w-full p-2.5 ${className ?? ''} ${error ? 'border-red-400 focus:ring-red-600' : ''}`} 
					{...register(label, {required})}
					placeholder={placeholder} 
					defaultValue={defaultValue} 
					onKeyUp={onKeyUp} 
					onChange={onChange}
				/>
	} else {
		input = <input 
					type={type} 
					id={id} 
					className={`!!outline-0 input rounded-lg focus:bg-white input-bordered border-slate-100 text-slate-900 text-sm block w-full p-2.5 ${className ?? ''} ${error ? 'border-red-400 focus:ring-red-600' : ''}`} 
					style={{background:'#F9F9F9'}}
					placeholder={placeholder}
					defaultValue={defaultValue}
					onChange={onChange} 
					name={label}
				/>
	}

	return (
        <div className="relative flex items-center">
		  	{input}
			<IoSearchOutline size='20' className='absolute right-4 text-gray-300'/>
		</div>
    );

}

export const MessageError = ({children}) => {
	return (
		<span className="text-red-400 block text-xs mt-1">{children}</span>
	)
}
