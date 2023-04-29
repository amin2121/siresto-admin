import React from 'react';
import { MdSpaceDashboard } from 'react-icons/md'

const CardCount = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white flex flex-col p-5 rounded-3xl border border-gray-300">
			<span className="text-xs font-semibold text-slate-400">{title}</span>
			<div className="flex mt-3 items-center">
				<div className={`w-10 h-10 rounded-full bg-${color}-100 flex justify-center items-center`}>
					{icon}
				</div>
				<h1 className="font-bold ml-4 text-xl">{value}</h1>
			</div>
		</div>
    );
};

export default CardCount;
