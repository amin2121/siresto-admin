import React, { useState } from "react";
import SiResto from "../../../assets/images/logo/SiResto.png";
import Instagram from "../../../assets/images/login/Instagram.svg";
// import Linkedin from "../../assets/images/login/Linkedin.svg"
import Twitter from "../../../assets/images/login/Twitter.svg";
import Facebook from "../../../assets/images/login/facebook.svg";
import Youtube from "../../../assets/images/login/youtube.svg";
import Icon from "../../../assets/images/login/icon.svg";
import Slider from "../../../components/auth/Slider";
import { Link } from "react-router-dom";
import ApiService from "../../../services/api.service";
import Alert from "../../../components/auth/Alert";

export default function ForgotPassword() {
  const [message, setMessage] = useState("Periksa kembali data anda.");
  const [type, setType] = useState("error");
  const [email, setEmail] = useState("");
  const [isEnableButton, setIsEnableButton] = useState(false);

  function setBannerNotification(type, message) {
    setType(type);
    setMessage(message);

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

  function reset() {
    if (!validateEmail(email)) {
      setBannerNotification("error", "Email anda tidak valid.");
      return;
    }

    ApiService.post(process.env.REACT_APP_BACKEND_DOMAIN + "/api/forgot-password", {
      email: email,
    })
      .then((response) => {
        setBannerNotification("success", "Silahkan cek email anda.");
      })
      .catch((error) => {
        setBannerNotification("error", "Periksa kembali data anda.");
      });
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleInputEmail = (event) => {
    setEmail(event.target.value);

    if (event.target.value.trim().length > 0) {
      setIsEnableButton(true);
    } else {
      setIsEnableButton(false);
    }
  };

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
        <div className="px-[20px] md:px-[39.73px] pt-[11px] md:pt-[30.66px]">
          <Link to="/" className="/">
            <img src={SiResto} alt="" className="w-24" />
          </Link>
        </div>
        <div className="flex justify-center">
          <div className="form-login">
            <div className="title">
              <h3>Reset Password</h3>
              <p>Kami bantu pulihkan akunmu kembali</p>
            </div>

            <div>
              <label htmlFor="email">Email</label>
              <div className="relative">
                <div className="svg-email"></div>
                <input
                  type="email"
                  placeholder="mail@website.com"
                  value={email}
                  onChange={handleInputEmail}
                  className="input input-bordered w-full pl-[50px]"
                />
              </div>
            </div>
            <div className="action">
              <button
                className="btn w-full"
                onClick={reset.bind(this)}
                disabled={!isEnableButton}
              >
                Kirim Email Pemulihan
              </button>

              <p>
                Kembali ke
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
