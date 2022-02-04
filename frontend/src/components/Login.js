import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isloading, setIsloading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [errMsg, setErrorMsg] = useState("");

  async function submitHandeler(event) {
    event.preventDefault();
    setIsloading(true);

    try {
      const { data } = await axios.post("/api/users/", {
        email: email,
        password: password,
      });
      console.log(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsloading(false);
      navigate("/chats");
    } catch (err) {
      console.log(err.response.data);
      setErrorMsg(err.response.data.message);
      setIsloading(false);
    }
  }

  return (
    <>
      <form onSubmit={submitHandeler}>
        <div>
          <label htmlFor="email">
            <b>Email address</b>
          </label>
          <br />
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>
        </div>
        <div>
          <label htmlFor="password">
            <b>Password</b>
          </label>
          <br />
          <input
            type="password"
            name="password"
            id="password"
            required
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          ></input>
        </div>

        <button
          type="submit"
          className="login-btn"
          disabled={isloading ? true : ""}
        >
          {isloading ? (
            <>
              <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span class="sr-only"></span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {errMsg && (
        <div
          class="alert alert-warning alert-dismissible fade show alert-popup"
          role="alert"
        >
          <strong>Error </strong> {errMsg}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setErrorMsg("")}
          ></button>
        </div>
      )}
    </>
  );
};

export default Login;
