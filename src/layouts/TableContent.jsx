import React, {useState} from 'react';

const TableContent = ({children}) => {
	return (
		<div className="shadow-md overflow-x-auto overflow-y-hidden">
		    <table className="w-full">
		    	{children}
		    </table>
		</div>
    );
}

export default TableContent