import React, { Fragment, useState } from "react";
import { baseUrl } from "../utils/strings";
import { Menu, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";
import User from "../assets/images/user/user-1.jpg";
import { useNavigate } from "react-router-dom";
import JwtService from "../services/jwt.service";
import { swConfirm } from "../utils/sw";
import Avatar from "react-avatar";

const links = [
  { href: "/account-settings", label: "Account settings" },
  { href: "/support", label: "Support" },
  { href: "/license", label: "License" },
  { href: "/sign-out", label: "Sign out" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const DropdownHeader = ({ nama, gambar }) => {
  const navigate = useNavigate();
  const [isShowModal, setIsShowModal] = useState(false);
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("image");
    JwtService.destroyToken();
    window.location.replace("/login");
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center text-sm font-medium text-gray-700">
          <div className="flex items-center space-x-3">
            <h5 className="text-xs font-semibold">{nama}</h5>
            {gambar !== null ? (
              <img
                src={baseUrl + gambar}
                alt="user"
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <Avatar
                color={Avatar.getRandomColor("sitebase", [
                  "red",
                  "green",
                  "blue",
                ])}
                name={nama}
                className="w-8 h-8 rounded-full"
                size="30"
              />
            )}
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
                  onClick={() => setIsShowModal(true)}
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block px-4 py-2 text-sm cursor-pointer"
                  )}
                >
                  Logout
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
      <>
        {isShowModal ? (
          <>
            <div className="fixed inset-0 z-30 overflow-y-auto">
              <div className="fixed inset-0 w-full h-full bg-black opacity-50"></div>
              <div className="flex items-center min-h-screen px-4 py-8">
                <div className="relative w-90 max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg">
                  <div className="mt-3 sm:flex">
                    <div className="flex items-center justify-center flex-none w-5 h-5 mx-auto mt-2 mr-3 bg-red-100 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="mt-1 mx-auto">
                      <h4 className="text-lg text-left font-medium text-gray-800">
                        Apakah Anda Yakin?
                      </h4>
                      <p className="mt-2 text-left text-[15px] leading-relaxed text-gray-500">
                        Ingin Keluar Dari Akun ini?
                      </p>
                      <div className="items-center gap-2 mt-4 sm:flex">
                        <button
                          className="w-full h-10 px-12 py-1 mt-2 p-2.5 flex-1 text-white bg-red-600 rounded-md outline-none ring-offset-2 ring-red-600 focus:ring-2"
                          onClick={logout}
                        >
                          Keluar
                        </button>
                        <button
                          className="w-full h-10 px-12 py-1 mt-2 mr-6 p-2.5 flex-1 text-gray-800 rounded-md outline-none border ring-offset-2 ring-indigo-600 focus:ring-2"
                          onClick={() => setIsShowModal(false)}
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </>
    </Menu>
  );
};

export default DropdownHeader;
