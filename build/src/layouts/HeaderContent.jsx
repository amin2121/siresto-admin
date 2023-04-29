import React, {useState} from 'react';
import { Link } from 'react-router-dom'
import { BiArrowBack } from 'react-icons/bi'

const HeaderContent = ({linkBack, title, breadcrumbs, children}) => {

	let arrowBack = linkBack ? <Link to={linkBack}><BiArrowBack size="20" className="text-blue-500"/></Link> : ''

	let componentsBreadcrumbs = breadcrumbs ? breadcrumbs.map((obj, key) => {
		let className = 'font-medium'
		if(key == breadcrumbs.length - 1) {
			className = 'font-semibold text-slate-700'
		}

		return (
			<li key={key} className={className}><a href={obj.link}>{obj.menu}</a></li> 
		)
	}) : ''

    return (
        <div>
        	<div className="flex justify-between w-full items-center px-6 mt-4">
	        	<div>
	        		<div className="flex space-x-2 items-center">
	        			{arrowBack}
	        			<h2 className="text-lg mb-0 font-semibold text-slate-700">{title}</h2>
	        		</div>
					<div className="text-sm breadcrumbs">
					  <ul>
		        		{breadcrumbs && componentsBreadcrumbs}
					  </ul>
					</div>
	        	</div>
	        	{children}
        	</div>
        </div>
    );
};

export default HeaderContent;
