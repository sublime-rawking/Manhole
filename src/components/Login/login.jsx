import React, { useState } from "react";
import { withPublic } from "../../context/protectedroutes";
import useAuth from "../../context/userContext.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPng from "../../assets/images/admin.png";
import logo from "../../assets/icons/Featherr.svg";
import "./styles.css";

// toast.configure();

export default withPublic(Login);
function Login() {
  const [userName, setUserName] = useState();
  const [password, setPassword] = useState();
  const { loginWithEmail } = useAuth();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginWithEmail({
        userName,
        password,
      });
      if (!result) {
        toast.error("Invalid Credentials", {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeonClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    // <section className="ftco-section">
    <div className="mx-5 my-4">
      <div className="text-center mx-2 ">
        <img
          src={logo}
          alt="logo"
          style={{
            width: "25%",
            objectFit: "cover",
          }}
        />
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
                  className="form-control rounded-left PlaceHolder"
                  placeholder="Username"
                  required
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              <div className="form-group d-flex">
                <input
                  type="password"
                  className="form-control rounded-left"
                  placeholder="Password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary rounded submit p-3 px-5 my-2"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    // </section>
  );
}
