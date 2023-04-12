import React from 'react';

const Badge = ({ title, type, className }) => {
	let typeColor = ''
	switch(type) {
		case 'success' :
			typeColor = ' bg-green-200 text-green-500'
		break
		case 'error' :
			typeColor = ' bg-red-200 text-red-500'
		break
		default :
			typeColor = ' bg-slate-200 text-slate-500'
	}

    return (
        <div className={`py-0.5 px-2 font-semibold rounded-md text-xs inline-block w-fit ${typeColor} ${className == undefined || ''}`}>
          {title}
        </div>
    );
};

export default Badge;