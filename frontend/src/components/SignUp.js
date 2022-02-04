import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState("");
  const [isloading, setIsloading] = useState(false);
  const navigate = useNavigate();
  const [errMsg, setErrorMsg] = useState("");

  function postImage(pic) {
    setIsloading(true);

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dlzzrfrx1");
      fetch("https://api.cloudinary.com/v1_1/dlzzrfrx1/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setIsloading(false);
          console.log(data);
        });
    }
  }

  async function submitHandeler(event) {
    event.preventDefault();
    setIsloading(true);

    try {
      const { data } = await axios.post("/api/users/register", {
        name: name,
        email: email,
        password: password,
        pic: pic
          ? pic
          : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setIsloading(false);
      navigate("/chats");
    } catch (err) {
      console.log(err.response.data.message);
      setErrorMsg(err.response.data.message);
      setIsloading(false);
    }
  }

  return (
    <>
      <form onSubmit={submitHandeler}>
        <div>
          <label htmlFor="name">
            <b>Name</b>
          </label>
          <br />
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
          ></input>
        </div>
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
            onChange={(e) => setEmail(e.target.value)}
            required
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
        <div>
          <label htmlFor="password">
            <b>Upload your pic</b>
          </label>
          <br />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => postImage(e.target.files[0])}
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

export default SignUp;
