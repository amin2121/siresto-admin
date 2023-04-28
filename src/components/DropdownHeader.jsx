import React, { Fragment } from 'react';
import { baseUrl } from '../utils/strings'
import { Menu, Transition } from '@headlessui/react'
import { BiChevronDown } from 'react-icons/bi'
import User from '../assets/images/user/user-1.jpg'
import { useNavigate } from 'react-router-dom'
import JwtService from '../services/jwt.service'
import { swConfirm } from '../utils/sw'

const links = [
  { href: '/account-settings', label: 'Account settings' },
  { href: '/support', label: 'Support' },
  { href: '/license', label: 'License' },
  { href: '/sign-out', label: 'Sign out' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const DropdownHeader = ({ name, gambar }) => {
  const navigate = useNavigate()
  const logout = () => {
    const confirm = swConfirm('Apakah Anda Yakin', 'Ingin Keluar Dari Aplikasi?', 'Iya, Saya Keluar')
    confirm.then(result => {
      if (result.isConfirmed) {
          localStorage.removeItem('user')
          JwtService.destroyToken()
          navigate('/login')
      }
    })
  }

  return (
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-3">
                  <h5 className="text-xs font-semibold">{name}</h5>  
                  <img src={gambar != undefined ? baseUrl + gambar : User} alt="user" className="w-8 h-8 rounded-full"/>
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
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      onClick={logout}
                      className={classNames(
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                        'block px-4 py-2 text-sm'
                      )}
                    >
                      Logout
                    </a>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
    );
};

export default DropdownHeader;
