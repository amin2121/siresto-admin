import React from 'react';

const Breadcrumb = ({ children }) => {
    return (
        <div className="text-xs breadcrumbs !pt-0">
          {children}
        </div>
    );
};

export default Breadcrumb;
