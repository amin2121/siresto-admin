import React from 'react';

const Breadcrumb = ({ children }) => {
    return (
        <div class="text-xs breadcrumbs !pt-0">
          {children}
        </div>
    );
};

export default Breadcrumb;
