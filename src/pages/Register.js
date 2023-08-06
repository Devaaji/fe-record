import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [namaLengkap, setNamaLengkap] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5050/auth/register", {
        full_name: namaLengkap,
        email,
        password,
      });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Email Sudah Terdaftar");
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
                <h3 class="mb-3">Register</h3>
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
                  <label for="full_name" class="form-label">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="full_name"
                    placeholder="Masukan Nama Lengkap"
                    onChange={(e) => setNamaLengkap(e.target.value)}
                  />
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
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
                  onClick={handleRegister}
                >
                  Register
                </button>
                <div>
                  <p class="small fw-bold mt-2 pt-1 mb-0">
                    Sudah Punya Akun?{" "}
                    <a href="/login" class="link-danger">
                      Login
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

export default Register;
