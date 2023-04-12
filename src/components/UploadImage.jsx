import React, { PropTypes } from 'react';

const UploadImage = ({ className }) => {
    return (
        <div className="py-2 px-6 border border-blue-500 rounded-md min-h-[200px] text-xs text-center">
        	<input type="file" className="w-min"/>
        	<button>Upload</button>
        </div>
    );
};

export default UploadImage;
