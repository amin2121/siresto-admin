import React from 'react';

export const Button = React.forwardRef(({title, color, startIcon, gap, className, size, type, loading, onClick, ...prop}, ref) => {

    return (
		<button 
			type={type} 
			className={`btn 
				${gap || 'gap-3'}
				${className || ''}
				${size != null ? 'btn-' + size : ''}
				${color != null ? 'btn-' + color : ''}
				${loading === true ? 'btn-disabled' : ''}
			`}
			ref={ref}
			onClick={onClick}>
		  {loading === true ? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : startIcon }
		  {title}
		</button>
    );
})

export const ButtonAuth = React.forwardRef(({title, type, className, loading, ...prop}, ref) => {
	return (
		<button type={type} className={`btn text-sm text-white border-none bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium mb-3 border-transparent hover:border-transparent w-full ${className} ${loading && 'loading'}`} {...prop}>
			{title}
		</button>
	)
})

export const ButtonSecondary = React.forwardRef(({title, onClick, color = 'blue', type}, ref) => {
	return (
		<button 
			className={`inline-flex cursor-pointer justify-center rounded-md border border-transparent bg-${color}-100 px-6 py-2 text-sm font-medium text-${color}-900 hover:bg-${color}-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-${color}-500 focus-visible:ring-offset-2`}
			type={type}
			ref={ref}
			onClick={onClick}>
			{title}		
		</button>
	)
})

export const ButtonLabelSecondary = ({title, color = 'blue', forId, className}) => {
	return (
		<label 
			className={`inline-flex cursor-pointer justify-center rounded-md border border-transparent px-6 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${className}`}
			htmlFor={forId}>
			{title}		
		</label>
	)
}

export const ButtonIconOutline = ({ onClick, children }) => {
	return (<span className="py-2 px-2 border border-slate-300 rounded-lg inline-block cursor-pointer hover:bg-slate-200 duration-200" onClick={onClick}>{children}</span>)
}