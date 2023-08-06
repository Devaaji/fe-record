import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await axios.post("http://localhost:5050/auth/login", {
        email,
        password,
      });
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("email dan password salah");
      } else {
        setError("Server Sedang Bermasalah");
      }
    }
  };

  return (
    <section class="vh-100" style={{ backgroundColor: "#508bfc" }}>
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-8 col-lg-6 col-xl-5">
            <div class="card shadow-2-strong">
              <div class="card-body p-5">
                <h3 class="mb-3">Login</h3>
                {error && (
                  <div
                    class="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <strong>Ups!</strong> {error}
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="alert"
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="exampleFormControlInput1"
                    placeholder="Masukan Email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    class="form-control"
                    placeholder="******"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  class="btn btn-primary btn-lg btn-block"
                  onClick={handleLogin}
                >
                  Login
                </button>
                <div>
                  <p class="small fw-bold mt-2 pt-1 mb-0">
                    Belum Punya Akun?{" "}
                    <a href="/register" class="link-danger">
                      Register
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
