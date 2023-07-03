import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SiResto from "../../../assets/images/logo/SiResto.png";
import Instagram from "../../../assets/images/login/Instagram.svg";
import Twitter from "../../../assets/images/login/Twitter.svg";
import Facebook from "../../../assets/images/login/facebook.svg";
import Youtube from "../../../assets/images/login/youtube.svg";
import Icon from "../../../assets/images/login/icon.svg";
import Slider from "../../../components/auth/Slider";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../../services/api.service";
import JwtService from "../../../services/jwt.service";
import Alert from "../../../components/auth/Alert";
import { useEffect } from "react";
import axios from "../../../utils/axios";
import { setProfile } from "../../../features/profileSlice";

export default function Login() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  function login() {
    axios
      .post("auth/login", { email, password })
      .then((response) => {
        const res = response.data.data;

        ApiService.post(process.env.REACT_APP_BACKEND_DOMAIN + "/oauth/token", {
          username: email,
          password: password,
          grantType: "password",
          clientId: process.env.REACT_APP_CLIENT_ID,
          clientSecret: process.env.REACT_APP_CLIENT_SECRET,
        })
          .then((response) => {
            if (response.status === 200) {
              dispatch(setProfile({ nama: res.name, gambar: res.gambar }));
              localStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.token,
                  level: res.level,
                  lisence: res.lisence,
                  name: res.name,
                  tambahanMasaTrial: res.masa_trial,
                  tanggal: res.created_at,
                })
              );
              JwtService.saveToken(res.token);

              if (res.level === "Superadmin") {
                navigate("/dashboard/superadmin");
              } else if (res.level === "Owner") {
                navigate("/dashboard/owner");
              }
            }
          })
          .catch((error) => {
            if (res.level === "Staff") {
              localStorage.setItem(
                "user",
                JSON.stringify({
                  token: res.token,
                  level: res.level,
                  lisence: res.lisence,
                  name: res.name,
                  tambahanMasaTrial: res.masa_trial,
                  tanggal: res.created_at,
                })
              );
              JwtService.saveToken(res.token);

              navigate("/order");
            } else {
              var alert = document.getElementById("alert");
              alert.classList.toggle("hidden");
              alert.classList.toggle("opacity-[0]");

              setTimeout(() => {
                alert.classList.toggle("opacity-[0]");
              }, 2000);

              setTimeout(() => {
                alert.classList.toggle("hidden");
              }, 2500);
            }
          });
      })
      .catch((error) => {
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

  function setProfileState() {
    setProfile();
  }

  useEffect(() => {
    if (isLoaded === false) {
      setIsLoaded(true);
      ApiService.init();
      ApiService.get(process.env.REACT_APP_BACKEND_DOMAIN + "/api/get-my-data")
        .then((response) => {
          let data = response.data.data;
        })
        .catch((error) => {});
    }
  });

  return (
    <div className="w-screen md:flex h-screen login">
      <div className="bg-[#5557DB] hidden md:flex items-center justify-center h-screen left">
        <div className="w-[308px]">
          <div>
            <img src={Icon} className="-ml-[24px] w-24" alt="" />
          </div>
          <Slider />
          <div className="flex mt-[26.83px]">
            <a href="https://www.youtube.com/channel/UCtQgKQgDQlHS3sO_LTxxh0Q">
              <img src={Youtube} alt="youtube" />
            </a>
            <a href="https://www.instagram.com/awandigitalindonesia/">
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
      <div className="right h-screen relative">
        <div
          className="absolute top-[50px] w-full mx-auto flex justify-center hidden opacity-[0]"
          id="alert"
        >
          <Alert type={"error"} msg={"Akun Email atau Password Anda Salah."} />
        </div>
        <div className="px-[20px] md:px-[39.73px] pt-[11px] md:pt-[30.66px]">
          <Link to="/" className="/">
            <img src={SiResto} alt="" className="w-24" />
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="form-login">
            <div className="title">
              <h3>Login</h3>
              <p>Selamat datang kembali di SiResto</p>
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
                />
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
                />
              </div>
            </div>

            <div className="flex flex-wrap">
              <div className="forgot-password hidden md:block ml-auto">
                <Link to="/forgot-password" className="/">
                  Lupa Password?
                </Link>
              </div>
            </div>

            <div className="action">
              <button className="btn w-full" onClick={login.bind(this)}>
                Login
              </button>

              <p>
                Belum punya akun?
                <Link to="/register" className="text-[#EB008B]">
                  Daftar Sekarang
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
