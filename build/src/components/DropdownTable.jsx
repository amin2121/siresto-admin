import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react'
import User from '../assets/users/user-1.jpg'

const DropdownTable = ({ children }) => {
  return (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              <div className="flex items-center space-x-3">
              </div>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {children}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
    );
};

export default DropdownTable;
