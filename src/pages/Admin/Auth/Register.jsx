import SiResto from "../../../assets/images/logo/SiResto.png";
import Instagram from "../../../assets/images/login/Instagram.svg";
// import Linkedin from "../../../assets/images/login/Linkedin.svg"
import Twitter from "../../../assets/images/login/Twitter.svg";
import Facebook from "../../../assets/images/login/facebook.svg";
import Youtube from "../../../assets/images/login/youtube.svg";
import Icon from "../../../assets/images/login/icon.svg";
import Slider from "../../../components/auth/Slider";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ApiService from "../../../services/api.service";
import Alert from "../../../components/auth/Alert";
import Sikas from "../../../assets/images/logo/sikas.png";
import Siqasir from "../../../assets/images/logo/siqasir.png";
import Skrin from "../../../assets/images/logo/skrin.png";
import Kyoo from "../../../assets/images/logo/kyoo.png";
import axios from "../../../utils/axios";
import { findRenderedComponentWithType } from "react-dom/test-utils";

export default function Register() {
  const navigate = useNavigate();

  const [tnc, setTnc] = useState(false);
  const [province, setProvince] = useState("");
  const [businessName, setBusinessName] = useState();
  const [businessCategory, setBusinessCategory] = useState("");
  const [listProvinsi, setListProvince] = useState([]);
  const [city, setCity] = useState();
  const [listKota, setListCity] = useState([]);
  const pronvinceOption = [];
  // const cityOption = []
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setConfirmationPassword] = useState("");
  const [message, setMessage] = useState("Periksa kembali data anda.");
  const [type, setType] = useState("error");
  const [isLoaded, setIsLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isLoaded === false) {
      ApiService.init();
      ApiService.get(process.env.REACT_APP_BACKEND_DOMAIN + "/api/get-my-data")
        .then((response) => {
          navigate("/dashboard");
        })
        .catch((error) => {
          fetch(
            "https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json"
          )
            .then((response) => response.json())
            .then((res) => {
              setProvince(res[0].name);
              setListProvince([...res]);
            });

          fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies.json`
          )
            .then((response) => response.json())
            .then((city) => {
              setCity(city[0].name);
              setListCity([...city]);
            });

          fetch(process.env.REACT_APP_BACKEND_DOMAIN + "/api/product")
            .then((response) => response.json())
            .then((data) => {
              setProducts([...data.data.products]);
            });
        });
    }
  }, [isLoaded]);

  const [activeProduct, setActiveProduct] = useState(-1);

  function setSelectedProduct(index) {
    if (activeProduct === index) {
      setActiveProduct(-1);
    } else {
      setActiveProduct(index);
    }
  }

  function ProductList() {
    let productList = [];
    for (const [index, value] of products.entries()) {
      productList.push(
        <div
          className={
            activeProduct !== value.id
              ? "product cursor-pointer mb-[31px]"
              : "product cursor-pointer active mb-[31px]"
          }
          key={"product-" + value.name}
          onClick={setSelectedProduct.bind(this, value.id)}
        >
          <div className="flex justify-between">
            <div>{generateProductLogo(value.name)}</div>
            <div className="w-[90px] h-[25px] bg-[#EEEEFB] rounded-[8px] flex justify-center items-center tag">
              Gratis Ujicoba
            </div>
          </div>
          <div>{generateProductTagLine(value.name)}</div>
        </div>
      );
    }
    return productList;
  }

  function generateProductLogo(value) {
    if (value === "Sikasir") {
      return <img src={Siqasir} alt="sikasir" className="w-[69px]" />;
    } else if (value === "Kyoo") {
      return <img src={Kyoo} alt="kyoo" className="w-[69px]" />;
    } else if (value === "Sikas") {
      return <img src={Sikas} alt="Sikas" className="w-[69px]" />;
    } else if (value === "Skrin") {
      return <img src={Skrin} alt="Skrin" className="w-[69px]" />;
    } else if (value === "SiResto") {
      return <img src={SiResto} alt="SiResto" className="w-[69px]" />;
    }
  }

  const selectStyle = {
    border: "1px solid #d2d4d7",
  };

  function generateProductTagLine(value) {
    if (value === "Sikasir") {
      return <p className="!text-left">Aplikasi Kasir</p>;
    } else if (value === "Kyoo") {
      return (
        <p className="!text-left">
          <a href="https://kyoo.id/">Aplikasi Management Antrian</a>
        </p>
      );
    } else if (value === "Sikas") {
      return (
        <p className="!text-left">Aplikasi Management Keuangan dan Piutang</p>
      );
    } else if (value === "Skrin") {
      return <p className="!text-left">Aplikasi Digital Signage</p>;
    } else if (value === "SiResto") {
      return <p className="!text-left">Aplikasi SiResto</p>;
    }
  }

  for (const [index, item] of listProvinsi.entries()) {
    pronvinceOption.push(
      <option value={item.id + "-" + item.name} key={"province" + index}>
        {item.name}
      </option>
    );
  }

  const changeListKota = (e) => {
    e.preventDefault();
    var temporaryProvince = e.target.value.split("-");
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/` +
        temporaryProvince[0] +
        `.json`
    )
      .then((response) => response.json())
      .then((city) => {
        setCity(city[0].name);
        setListCity([...city]);
      });

    setProvince(e.target.value);
  };

  const updateCity = (e) => {
    e.preventDefault();
    setCity(e.target.value);
  };

  function optionKota() {
    let cityOption = [];

    for (const [index, item] of listKota.entries()) {
      cityOption.push(
        <option value={item.name} key={"city" + index}>
          {item.name}
        </option>
      );
    }
    return cityOption;
  }

  function register() {
    if (
      email === "" ||
      name === "" ||
      businessName === "" ||
      businessCategory === "" ||
      phone === "" ||
      province === "" ||
      city === "" ||
      password === "" ||
      passwordConfirmation === ""
    ) {
      setType("error");
      setMessage("Lengkapi semua data anda.");
      var alert = document.getElementById("alert");
      alert.classList.toggle("hidden");
      alert.classList.toggle("opacity-[0]");

      setTimeout(() => {
        alert.classList.toggle("opacity-[0]");
      }, 2000);

      setTimeout(() => {
        alert.classList.toggle("hidden");
      }, 2500);
    } else {
      if (passwordConfirmation !== password) {
        setType("error");
        setMessage("Password konfirmasi dan password tidak sama.");
        var alert = document.getElementById("alert");
        alert.classList.toggle("hidden");
        alert.classList.toggle("opacity-[0]");

        setTimeout(() => {
          alert.classList.toggle("opacity-[0]");
        }, 2000);

        setTimeout(() => {
          alert.classList.toggle("hidden");
        }, 2500);
      } else {
        ApiService.post("/api/user-available", {
          email: email,
        })
          .then((response) => {
            setType("error");
            setMessage("Email sudah terdaftar");
            var alert = document.getElementById("alert");
            alert.classList.toggle("hidden");
            alert.classList.toggle("opacity-[0]");

            setTimeout(() => {
              alert.classList.toggle("opacity-[0]");
            }, 2000);

            setTimeout(() => {
              alert.classList.toggle("hidden");
            }, 2500);
          })
          .catch((error) => {
            // var formRegister =
            //   document.getElementsByClassName("form-register")[0];
            // formRegister.classList.toggle("hidden");

            // var formProduct =
            //   document.getElementsByClassName("form-product")[0];
            // formProduct.classList.toggle("hidden");
            startNow();
          });
      }
    }
  }

  async function submitRegisterUser(data) {
    const response = await axios.post("auth/register", data);
    const res = response.data;

    if (res.meta.code != 200) {
      throw new Error(res.meta.message);
    }
  }

  function startNow() {
    let params = {
      email: email,
      name: name,
      password: password,
      passwordConfirmation: passwordConfirmation,
      businessName: businessName,
      businessCategory: businessCategory,
      phone: phone,
      province: province,
      city: city,
      product_id: 3,
    };

    // axios
    ApiService.post("/api/register", params)
      .then((response) => {
        setType("success");
        setMessage("Berhasil mendaftarkan akun anda.");

        submitRegisterUser(params);

        var alert = document.getElementById("alert");
        alert.classList.toggle("hidden");
        alert.classList.toggle("opacity-[0]");

        setTimeout(() => {
          alert.classList.toggle("opacity-[0]");
        }, 2000);

        setTimeout(() => {
          alert.classList.toggle("hidden");
          window.location = "/login";
        }, 2500);
      })

      .catch((error) => {
        setType("error");
        setMessage("Periksa kembali data anda.");
        var alert = document.getElementById("alert");
        alert.classList.toggle("hidden");
        alert.classList.toggle("opacity-[0]");

        setTimeout(() => {
          alert.classList.toggle("opacity-[0]");
        }, 2000);

        setTimeout(() => {
          alert.classList.toggle("hidden");
        }, 2500);
      });
  }

  return (
    <div className="w-screen block md:flex h-fit register">
      <div className="bg-[#ED5565] hidden md:flex items-center justify-center h-screen left">
        <div className="w-[308px]">
          <div>
            <img src={Icon} className="-ml-[24px]" alt="" />
          </div>
          <Slider />
          <div className="flex mt-[26.83px]">
            <a href="https://www.youtube.com/channel/UCtQgKQgDQlHS3sO_LTxxh0Q">
              <img src={Youtube} alt="youtube" />
            </a>
            <a href="https://www.instagram.com/SiRestoindonesia/">
              <img src={Instagram} alt="instagram" />
            </a>
            <a href="https://web.facebook.com/profile.php?id=100077383916860">
              <img src={Facebook} alt="facebook" />
            </a>
            <a href="https://twitter.com/AdiMaketing">
              <img src={Twitter} alt="twitter" />
            </a>
          </div>
        </div>
      </div>
      <div className="right h-screen bg-[#FFFFFF] relative">
        <div
          className="sticky z-[5] top-[50px] w-full flex justify-center mx-auto hidden opacity-[0]"
          id="alert"
        >
          <Alert type={type} msg={message} />
        </div>
        <div className="px-[20px] md:px-[39.73px] pt-[30.66px]">
          <Link to="/" className="/">
            <img src={SiResto} alt="" className="w-24" />
          </Link>
        </div>
        <div className="block md:flex px-[20px] md:px-[0] justify-center">
          <div className="form-register ">
            <div className="title">
              <h3>Register</h3>
              <p>Lengkapi form untuk membuat akun</p>
            </div>

            <div>
              <label htmlFor="nama">Nama Lengkap</label>
              <div className="relative">
                <div className="svg-email"></div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full pl-[50px]"
                  placeholder="Nama Bisnis"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nama">Nama Bisnis</label>
              <div className="relative">
                <div className="svg-business"></div>
                <input
                  type="text"
                  id="businessName"
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="input input-bordered w-full pl-[50px]"
                  placeholder="Nama Bisnis"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nama">Kategori Bisnis</label>
              <div className="relative">
                <div className="svg-business"></div>
                <select
                  style={selectStyle}
                  className="select w-full pl-[50px]"
                  id="businessCategory"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                >
                  {/* <option disabled>Pilih Kategori</option>
                  <option value="">Pilih Kategori</option>
                  <option value="Health">Health</option>
                  <option value="Beauty and Treatment">
                    Beauty and Treatment
                  </option>
                  <option value="Public Service">Public Service</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Education">Education</option>
                  <option value="Financial">Financial</option>
                  <option value="FnB">FnB</option>
                  <option value="Print and Design">Print and Design</option>
                  <option value="Telecom">Telecom</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Event and Exhibition">
                    Event and Exhibition
                  </option> */}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <div className="relative">
                <div className="svg-email"></div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input input-bordered w-full pl-[50px]"
                  placeholder="Email"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone">No. Handphone</label>
              <div className="relative">
                <div className="svg-phone"></div>
                <input
                  type="number"
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  className="input input-bordered w-full pl-[50px]"
                  placeholder="Ch. +628***"
                />
              </div>
            </div>

            <div className="lg:flex gap-x-[10px]">
              <div className="basis-6/12">
                <label htmlFor="province">Provinsi</label>
                <div className="relative">
                  <div className="svg-home"></div>
                  <select
                    style={selectStyle}
                    className="select w-full pl-[50px]"
                    id="province"
                    value={province}
                    onChange={(e) => changeListKota(e)}
                  >
                    <option disabled>Pilih Provinsi</option>
                    <option value="">Pilih Provinsi</option>
                    {pronvinceOption}
                  </select>
                </div>
              </div>

              <div className="basis-6/12">
                <label htmlFor="province">Kota</label>
                <div className="relative">
                  <div className="svg-pin"></div>
                  <select
                    style={selectStyle}
                    className="select w-full pl-[50px]"
                    id="city"
                    value={city}
                    onChange={(e) => updateCity(e)}
                  >
                    <option disabled>Pilih Kota</option>
                    <option value="">Pilih Kota</option>
                    {optionKota()}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <div className="relative">
                <div className="svg-password"></div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pl-[50px]"
                  placeholder="Masukan Password"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password">Konfirmasi Password</label>
              <div className="relative">
                <div className="svg-password"></div>
                <input
                  type="password"
                  id="konfirmasiPassword"
                  value={passwordConfirmation}
                  onChange={(e) => setConfirmationPassword(e.target.value)}
                  className="input input-bordered w-full pl-[50px]"
                  placeholder="Ketik Ulang Password"
                />
              </div>
            </div>

            <div
              className="flex flex-wrap tnc cursor-pointer label"
              onClick={() => setTnc(!tnc)}
            >
              <input
                type="checkbox"
                className="checkbox checkbox-custom border-2"
                checked={tnc}
                value={tnc}
                onChange={(e) => {}}
              />
              <p className="label-text">
                Saya telah membaca dan menyetujui{" "}
                <Link
                  to="https://awandigital.id/term_condition.html"
                  target="_blank"
                  className="mx-[2px]"
                >
                  {" "}
                  syarat dan ketentuan{" "}
                </Link>{" "}
                yang berlaku
              </p>
            </div>

            <div className="action mb-[111px]">
              <button
                className="btn w-full"
                disabled={!tnc}
                onClick={register.bind(this)}
              >
                Register
              </button>

              <p>
                Sudah punya akun?
                <Link to="/login" className="text-[#EB008B]">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
