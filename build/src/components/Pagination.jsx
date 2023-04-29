import React from "react";

const Pagination = ({totalPage, active, onPreviousPage, onNextPage}) => {

  let layout_page = []
  for(let i = 1; i <= totalPage; i++) {
    if(active == i) {
      layout_page.push(<li key={i}><button aria-current="page" className="py-2 leading-tight px-3 text-blue-600 bg-blue-50 border border-gray-300 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white">{i}</button></li>)
    } else {
      layout_page.push(<li key={i}><button className="py-2 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">{i}</button></li>)
    }

  }

  return (
    <div className="mt-5">
      <nav aria-label="Page navigation example">
        <ul className="inline-flex -space-x-px">
          <li>
            <button className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={onPreviousPage} disabled={active == 1 ? true : false }>Previous</button>
          </li>
          {layout_page}
          <li>
            <button className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white" onClick={onNextPage} disabled={active == totalPage ? true : false}>Next</button>
          </li>
        </ul>
      </nav>
      
    </div>

 );
};

export default Pagination;