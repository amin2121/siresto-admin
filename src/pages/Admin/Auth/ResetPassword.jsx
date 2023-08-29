import React, { useState } from "react";
import AwanDigital from "../../../assets/images/logo/awandigital.png";
import Instagram from "../../../assets/images/login/Instagram.svg";
// import Linkedin from "../../assets/images/login/Linkedin.svg"
import Twitter from "../../../assets/images/login/Twitter.svg";
import Facebook from "../../../assets/images/login/facebook.svg";
import Youtube from "../../../assets/images/login/youtube.svg";
import Icon from "../../../assets/images/login/icon.svg";
import Slider from "../../../components/auth/Slider";
import ApiService from "../../../services/api.service";
import Alert from "../../../components/auth/Alert";
import { Link, useParams, useSearchParams } from "react-router-dom";
import axios from "../../../utils/axios";

export default function ResetPassword() {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Periksa kembali data anda.");
  const [type, setType] = useState("error");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setConfirmationPassword] = useState("");
  const email = searchParams.get("email");

  function reset() {
    ApiService.post(
      process.env.REACT_APP_BACKEND_DOMAIN + "/api/reset-password",
      {
        token: token,
        email: searchParams.get("email"),
        password: password,
        password_confirmation: passwordConfirmation,
      }
    )
      .then((response) => {
        setType("success");
        setMessage("Berhasil mengganti password anda");

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
        setMessage("Silahkan periksa kembali password anda");
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
    <div className="w-screen flex h-screen forgot-password">
      <div className="bg-[#27AE61] hidden md:flex items-center justify-center h-screen left">
        <div className="w-[308px]">
          <div>
            <img src={Icon} className="-ml-[24px]" alt="" />
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
          <Alert type={type} msg={message} />
        </div>
        <div className="px-[20px] md:px-[39.73px] pt-[30.66px]">
          <Link to="/" className="/">
            <img src={AwanDigital} alt="" />
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="form-login">
            <div className="title">
              <h3>Password Baru Anda</h3>
              <p>Kami bantu pulihkan akunmu kembali</p>
            </div>

            <div className="mb-[31px]">
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

            <div className="action">
              <button className="btn w-full" onClick={reset.bind(this)}>
                Continue
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
