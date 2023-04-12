import React from 'react';
import { RiArrowLeftSFill, RiArrowRightSFill } from 'react-icons/ri'

const PaginationTable = ({ setLimit, fromRow, toRow, totalRows, prevPageUrl, nextPageUrl, prevPage, nextPage }) => {
    return (
        <div className="bg-blue-50 text-blue-500 flex md:justify-end justify-between px-4 space-x-3 rounded-bl-md rounded-br-md">
  		    <div className="flex space-x-3 items-center">
      			<p>Baris Per Halaman : </p>
      			<select className="select select-ghost w-24 !outline-none !border-none focus:bg-transparent" onChange={(e) => setLimit(e.target.value)} defaultValue="10">
						  <option value="10">10</option>
						  <option value="20">20</option>
						  <option value="50">50</option>
						  <option value="100">100</option>
						</select>
  		    </div>
  		    <div className="flex space-x-1 items-center justify-end">
  		    	<span>{fromRow}-{toRow} dari {totalRows}</span>
  		    	<div className="mr-5 flex items-center">
  		    		<RiArrowLeftSFill size="30" className={`hover:text-blue-700 ${prevPageUrl == null ? 'text-blue-300 cursor-no-drop' : 'cursor-pointer'}`} onClick={() => prevPage()}/>
  		    		<RiArrowRightSFill size="30" className={`hover:text-blue-700 ${nextPageUrl == null ? 'text-blue-300 cursor-no-drop' : 'cursor-pointer'}`} onClick={() => nextPage()}/>
  		    	</div>
  		    </div>
  			</div>
    );
};

export default PaginationTable;