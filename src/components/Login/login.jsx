import React, { useState } from "react";
import { withPublic } from "../../context/protectedroutes";
import useAuth from "../../context/userContext.js";
import "react-toastify/dist/ReactToastify.css";
import AdminPng from "../../assets/images/admin.png";
import logo from "../../assets/icons/Featherr.svg";
import "./styles.css";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlineCloseCircle,
} from "react-icons/ai";

// toast.configure();

export default withPublic(Login);
function Login() {
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);

  const { logIn } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await logIn({
        userName,
        password,
      });
      if (!result) {
        alert("Invalid Credentials")
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleTogglePassword = (setter, value) => {
    setter(!value);
  };

  return (
    <div className="mx-5 my-4">
      <div className="text-center mx-2 ">
        <h1>MANHOLE</h1>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-5">
          <div className="login-wrap p-5 ">
            <div className="icon d-flex align-items-center justify-content-center">
              {/* <span className="fa fa-user-o"></span> */}
              <img alt="" className="dashbord-header-img" src={AdminPng} />
            </div>
            <h3 className="text-center mb-3 mt-3">Admin</h3>
            <form action="#" className="login-form" onSubmit={handleSubmit}>
              <div className="form-group mb-2">
                <input
                  type="text"
                  className="form-control PlaceHolder"
                  placeholder="Username"
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div className="form-group-login d-flex position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control PlaceHolder"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="eye-icon"
                  onClick={() =>
                    handleTogglePassword(setShowPassword, showPassword)
                  }
                >
                  {showPassword ? (
                    <AiFillEye color="#2d83b5" size={20} />
                  ) : (
                    <AiFillEyeInvisible color="#2d83b5" size={20} />
                  )}
                </div>
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary rounded submit py-3 px-5 my-2"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
