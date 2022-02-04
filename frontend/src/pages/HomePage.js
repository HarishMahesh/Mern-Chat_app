import React, { useState, useEffect } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";

const HomePage = () => {
  const [loginSate, setLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    console.log(userInfo);
    if (userInfo) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <>
      <div className="container">
        <div className="row mt-5">
          <div className="col-lg-6 col-sm-8 col-10 offset-1 offset-sm-2 offset-lg-3">
            <div className="login-title">
              <h4>We Chat</h4>
            </div>
            <div className="login-form">
              <div className="login-form_button">
                <button
                  className={loginSate ? "isActivebtn" : ""}
                  onClick={() => setLogin(!loginSate)}
                >
                  Login
                </button>
                <button
                  className={!loginSate ? "isActivebtn" : ""}
                  onClick={() => setLogin(!loginSate)}
                >
                  Sign Up
                </button>
              </div>
              <div className="login-form_fileds">
                {loginSate ? <Login /> : <SignUp />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
