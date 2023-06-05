import React, { useState } from "react";
import "./sidebar.css";
import Logo from "../assets/images/logo/SiResto.png";

import {
  MdSpaceDashboard,
  MdChat,
  MdLoyalty,
  MdOutlineCategory,
} from "react-icons/md";
import { BsFillCartPlusFill, BsFillPersonLinesFill } from "react-icons/bs";
import { BiChevronDown, BiReceipt } from "react-icons/bi";
import { AiFillSetting, AiOutlineFileDone } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import { GiTable } from "react-icons/gi";
import { TbBrandAirtable, TbDiscount } from "react-icons/tb";
import { FiCoffee } from "react-icons/fi";
import { Link } from "react-router-dom";
import { slugify } from "../utils/strings";
import { useSelector, useDispatch } from "react-redux";
import { openSidebar } from "../features/sidebarSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { capitalize } from "../utils/strings";

const Sidebar = () => {
  const open = useSelector((state) => state.sidebar.open);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeMenu, setActiveMenu] = useState(
    capitalize(location.pathname.split("/").join(""))
  );

  const MenusSuperadmin = [
    {
      title: "Dashboard",
      src: <MdSpaceDashboard className={`duration-200`} size="20" />,
      type: "link",
      lisence: "trial",
      link: "dashboard/superadmin",
    },
    {
      title: "Kategori Bisnis",
      src: <MdOutlineCategory className={`duration-200`} size="20" />,
      type: "link",
      lisence: "trial",
      link: "kategori-bisnis",
    },
    {
      title: "Resto",
      src: <FiCoffee className={`duration-200`} size="20" />,
      type: "link",
      lisence: "trial",
      link: "resto",
    },
    {
      title: "Setting",
      src: <AiFillSetting className={`duration-200`} size="20" />,
      type: "submenu",
      lisence: "trial",
      submenu: [
        {
          title: "Ubah Profile",
          lisence: "trial",
          link: "setting/ubah-profile",
        },
        {
          title: "Reset Password",
          lisence: "trial",
          link: "setting/reset-password",
        },
      ],
    },
  ];

  const MenusOwner = [
    {
      title: "Dashboard",
      src: <MdSpaceDashboard className={`duration-200`} size="20" />,
      type: "link",
      lisence: "trial",
      link: "dashboard/owner",
    },
    {
      title: "Produk",
      src: <MdLoyalty className={`duration-200`} size="20" />,
      type: "submenu",
      lisence: "trial",
      submenu: [
        { title: "Kategori Produk", lisence: "trial", link: "kategori-produk" },
        { title: "Produk", lisence: "trial", link: "produk" },
      ],
    },
    {
      title: "Promo",
      src: <TbDiscount className={`duration-200`} size="20" />,
      type: "link",
      link: "promo",
      lisence: "trial",
    },
    {
      title: "Meja",
      src: <TbBrandAirtable className={`duration-200`} size="20" />,
      type: "link",
      link: "meja",
      lisence: "trial",
    },
    {
      title: "Order",
      src: <BiReceipt className={`duration-200`} size="20" />,
      type: "link",
      lisence: "trial",
      link: "order",
    },
    {
      title: "Laporan",
      src: <AiOutlineFileDone className={`duration-200`} size="20" />,
      type: "submenu",
      //   lisence: "premium",
      submenu: [
        { title: "Penjualan", link: "laporan/penjualan" },
        { title: "Pendapatan", link: "laporan/pendapatan" },
      ],
      //   submenu: [
      //     { title: "Penjualan", lisence: "premium", link: "laporan/penjualan" },
      //     { title: "Pendapatan", lisence: "premium", link: "laporan/pendapatan" },
      //   ],
    },
    {
      title: "Staff",
      src: <BsFillPersonLinesFill className={`duration-200`} size="20" />,
      type: "link",
      link: "staff",
    },
    {
      title: "Setting",
      src: <AiFillSetting className={`duration-200`} size="20" />,
      type: "submenu",
      lisence: "trial",
      submenu: [
        {
          title: "Konfigurasi Resto",
          lisence: "trial",
          link: "setting/konfigurasi-resto",
        },
        { title: "Pembayaran", lisence: "trial", link: "setting/pembayaran" },
        {
          title: "Ubah Profile",
          lisence: "trial",
          link: "setting/ubah-profile",
        },
        {
          title: "Reset Password",
          lisence: "trial",
          link: "setting/reset-password",
        },
      ],
    },
  ];

  const MenusStaff = [
    {
      title: "Order",
      src: <BiReceipt className={`duration-200`} size="20" />,
      type: "link",
      lisence: "trial",
      link: "order",
    },
    {
      title: "Setting",
      src: <AiFillSetting className={`duration-200`} size="20" />,
      type: "submenu",
      lisence: "trial",
      submenu: [
        {
          title: "Ubah Profile",
          lisence: "trial",
          link: "setting/ubah-profile",
        },
        {
          title: "Reset Password",
          lisence: "trial",
          link: "setting/reset-password",
        },
      ],
    },
  ];

  const pilihMenu = () => {
    if (user?.level != undefined) {
      switch (user.level) {
        case "Superadmin":
          return MenusSuperadmin;
        case "Owner":
          return MenusOwner;
        case "Staff":
          return MenusStaff;
        default:
          return [];
      }
    }

    return [];
  };

  const settingItemMenu = (menu) => {
    setActiveMenu(menu.title);

    if (menu.type == "submenu") {
      document
        .getElementById(`nav-submenu-${slugify(menu.title)}`)
        .classList.toggle("hidden");
      document
        .getElementById(`arrow-submenu-${slugify(menu.title)}`)
        .classList.toggle("rotate-180");
    } else {
      navigate(`/${menu.link}`);
      dispatch(openSidebar());
    }
  };

  const Menus = pilihMenu();

  const menusLayout = Menus.map((menu, index) => {
    if (menu.lisence == "premium" && user?.lisence.toLowerCase() != "premium") {
      return;
    }

    return (
      <li
        key={index}
        className={`text-sm cursor-pointer py-2 duration-500 `}
        onClick={() => settingItemMenu(menu)}
      >
        <div
          className={`flex gap-x-3 hover:text-blue-500 duration-100 py-1 px-6 mx-1 mb-2 ${
            activeMenu === menu.title ? "text-blue-500" : "text-slate-600"
          } items-center`}
        >
          {menu.src}
          {menu.type == "submenu" ? (
            <span className={`flex justify-between flex-1`}>
              {menu.title}{" "}
              <BiChevronDown
                size="20"
                className="duration-300"
                id={`arrow-submenu-${slugify(menu.title)}`}
              />
            </span>
          ) : (
            <span className={`duration-300 flex justify-between`}>
              {menu.title}
            </span>
          )}
        </div>
        {menu.type == "submenu" && (
          <ul
            id={`nav-submenu-${slugify(menu.title)}`}
            className="duration-500 hidden py-2 space-y-2"
          >
            {menu.submenu.map((item, key) => {
              if (
                item.lisence == "premium" &&
                user?.lisence.toLowerCase() != "premium"
              ) {
                return;
              }

              return (
                <li
                  key={key}
                  className={`duration-500 text-sm cursor-pointer hover:text-blue-500 duration-100 py-2 px-8 mx-1 mb-1 text-slate-600`}
                  onClick={() => settingItemMenu(item)}
                >
                  <span className="origin-left w-full text-gray-900 transition duration-75">
                    {item.title}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </li>
    );
  });

  return (
    <React.Fragment>
      <div
        className={`${
          open ? "w-full" : "w-0"
        } overflow-hidden lg:w-64 absolute top-0 left-0 z-20 lg:relative duration-300 mt-14 lg:mt-0 bg-white mr-1 border-r border-slate-200`}
      >
        <div className="hidden lg:flex px-4 items-center justify-center items-center border-b border-border-light h-16">
          <img src={Logo} alt={Logo} className="w-24" />
        </div>
        <ul className="pt-4">{menusLayout}</ul>
      </div>
    </React.Fragment>
  );
};

export default Sidebar;
