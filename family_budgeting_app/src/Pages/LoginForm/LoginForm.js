import React, { useEffect, useState } from "react";
import "./LoginForm.css";
import Logo from "../../assets/images/fampic.jpg";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import NNavbar from "../../Components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
// import Loading from "../../Components/Loading/Loading";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Actions/userActions";
import { registerUser } from "../../Actions/userActions";
import AES from "crypto-js/aes";

const FormPage = () => {
  const navigate = useNavigate();
  // const loginstate = useSelector((state) => state.loginUserReducer);
  // const { loading } = loginstate;
  const dispatch = useDispatch();
  const [userType, setUserType] = useState("regularUser");
  const [showSignInForm, setShowSignInForm] = useState(true);
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  const [signupCredentials, setSignupCredentials] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [loginErrors, setLoginErrors] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  useEffect(() => {
    if (window.location.pathname == "/login") {
      setShowSignInForm(true);
    } else {
      setShowSignInForm(false);
    }
  }, [window.location.pathname]);
  // useEffect(() => {
  //   console.log("loading >>>>>>", loading);
  // }, [loading]);
  /*/*** */
  // const login = () => {
  //   console.log("login credentials", loginCredentials);
  //   navigate("/dashboard");
  // };
  // const signup = () => {
  //   console.log("signup credentials", signupCredentials, userType);
  //   navigate("/dashboard");
  // };
  /*** */
  const login = () => {
    //setLoginErrors(loginValidation(loginCredentials));
    let errors = {};
    if (!loginCredentials.email) {
      errors.email = "enter email";
    } else if (!validateEmail(loginCredentials.email)) {
      errors.email = "Please enter a valid email";
    }
    if (!loginCredentials.password) {
      errors.password = "enter password";
    }
    setLoginErrors(errors);
    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      // alert("log in");
      dispatch(loginUser(loginCredentials, navigate));
    }
  };
  const signup = async () => {
    //setSignupErrors(signupValidation(signupCredentials));
    let errors = {};
    if (!signupCredentials.name) {
      errors.name = "name required";
    }
    // } else if (!onlyLettersAndSpaces(signupCredentials.name)) {
    //   errors.name = "enter correct name";
    // }
    if (!signupCredentials.password) {
      errors.password = "Password is required";
    } else if (signupCredentials.password.length < 5) {
      errors.password = "Password needs to be 5 characters or more";
    }
    // if (!onlyLettersAndSpaces(signupCredentials.name)) {
    //   errors.name = "enter correct name";
    // }
    if (!signupCredentials.cpassword) {
      errors.cpassword = "Password is required";
    } else if (signupCredentials.cpassword !== signupCredentials.password) {
      errors.cpassword = "Passwords do not match";
    }
    if (!signupCredentials.email) {
      errors.email = "enter email";
    } else if (!validateEmail(signupCredentials.email)) {
      errors.email = "Please enter a valid email";
    }
    setSignupErrors(errors);

    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      console.log("signup errors while dispatching,", signupErrors);
      var pass = signupCredentials.password;
      // .encrypt(
      //   signupCredentials.password,
      //   "CONNECTLEGAL"
      // ).toString();
      let user;

      user = {
        name: signupCredentials.name,
        email: signupCredentials.email,
        password: signupCredentials.password,
        usertype: userType,
      };

      dispatch(registerUser(user, navigate));
    }
  };
  useEffect(() => {
    console.log("signUp erors>>>", signupErrors);
  }, [signupErrors]);
  return (
    <div className="body__wrapper">
      {/* <NNavbar /> */}
      <div className="login__page">
        <div className="main">
          {/* {loading && <Loading />} */}
          {showSignInForm ? (
            <section className="sign-in" style={{ zIndex: "100000" }}>
              <div className="container">
                <div className="signin-content">
                  <div className="signin-image">
                    <figure>
                      {/* <img src={signInImage} alt="sing up image" /> */}
                      <img src={Logo} alt="sing up image" />
                    </figure>
                    <a
                      href="#"
                      className="signup-image-link"
                      onClick={() => setShowSignInForm(!showSignInForm)}
                    >
                      Create an account
                    </a>
                  </div>

                  <div className="signin-form">
                    <h2 className="form-title">Sign In</h2>
                    <form method="#" className="register-form" id="login-form">
                      <div className="form-group">
                        <label htmlFor="your_name">
                          {/* <i className="zmdi zmdi-account material-icons-name"></i> */}
                          <EmailIcon />
                        </label>
                        <input
                          defaultValue={loginCredentials.email}
                          type="text"
                          name="your_name"
                          id="your_name"
                          placeholder="Your Email"
                          onChange={(e) =>
                            setLoginCredentials({
                              email: e.target.value,
                              password: loginCredentials.password,
                            })
                          }
                        />
                      </div>
                      {loginErrors.email && (
                        <h6 className="error__message">{loginErrors.email}</h6>
                      )}

                      <div className="form-group">
                        <label htmlFor="your_pass">
                          {/* <i className="zmdi zmdi-lock"></i> */}
                          <LockIcon />
                        </label>
                        <input
                          defaultValue={loginCredentials.password}
                          type="password"
                          name="your_pass"
                          id="your_pass"
                          placeholder="Password"
                          onChange={(e) =>
                            setLoginCredentials({
                              email: loginCredentials.email,
                              password: e.target.value,
                            })
                          }
                        />
                      </div>

                      {loginErrors.password && (
                        <h6 className="error__message">
                          {loginErrors.password}
                        </h6>
                      )}

                      {/* <p
                        onClick={() => navigate("/forgot-password")}
                        className="forgot-pass-para"
                      >
                        forgot password?
                      </p> */}

                      {/* <div className="form-group">
                    <input
                      type="checkbox"
                      name="remember-me"
                      id="remember-me"
                      className="agree-term"
                    />
                    <label htmlFor="remember-me" className="label-agree-term">
                      <span>
                        <span></span>
                      </span>
                      Remember me
                    </label>
                  </div> */}
                      {/* <div className="form-group form-button"> */}
                      {/* <input
                          //type="submit"
                          name="signin"
                          id="signin"
                          className="form-submit login__form__submit"
                          value="Log in"
                          onClick={login}
                        /> */}
                      <span className="form__submit__btn__pro" onClick={login}>
                        Log In
                      </span>
                      {/* </div> */}
                    </form>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="signup">
              <div className="container">
                <div className="signup-content">
                  <div className="signup-form">
                    <h2 className="form-title">Sign up</h2>
                    <form
                      method="#"
                      className="register-form"
                      id="register-form"
                    >
                      <div className="form-group">
                        <label htmlFor="name">
                          {/* <i className="zmdi zmdi-account material-icons-name"></i> */}
                          <PersonIcon />
                        </label>
                        <input
                          defaultValue={signupCredentials.name}
                          type="text"
                          name="name"
                          id="name"
                          placeholder="Your Name"
                          onChange={(e) =>
                            setSignupCredentials({
                              name: e.target.value,
                              email: signupCredentials.email,
                              password: signupCredentials.password,
                              cpassword: signupCredentials.cpassword,
                            })
                          }
                        />
                      </div>
                      {signupErrors.name && (
                        <h6 className="error__message">{signupErrors.name}</h6>
                      )}

                      <div className="form-group">
                        <label htmlFor="email">
                          {/* <i className="zmdi zmdi-email"></i> */}
                          <EmailIcon />
                        </label>
                        <input
                          defaultValue={signupCredentials.email}
                          type="email"
                          name="email"
                          id="email"
                          placeholder="Your Email"
                          onChange={(e) =>
                            setSignupCredentials({
                              name: signupCredentials.name,
                              email: e.target.value,
                              password: signupCredentials.password,
                              cpassword: signupCredentials.cpassword,
                            })
                          }
                        />
                      </div>
                      {signupErrors.email && (
                        <h6 className="error__message">{signupErrors.email}</h6>
                      )}

                      <div className="form-group">
                        <label htmlFor="pass">
                          {/* <i className="zmdi zmdi-lock"></i> */}
                          <LockIcon />
                        </label>
                        <input
                          defaultValue={signupCredentials.password}
                          type="password"
                          name="pass"
                          id="pass"
                          placeholder="Password"
                          onChange={(e) =>
                            setSignupCredentials({
                              name: signupCredentials.name,
                              email: signupCredentials.email,
                              password: e.target.value,
                              cpassword: signupCredentials.cpassword,
                            })
                          }
                        />
                      </div>
                      {signupErrors.password && (
                        <h6 className="error__message">
                          {signupErrors.password}
                        </h6>
                      )}

                      <div className="form-group">
                        <label htmlFor="re-pass">
                          {/* <i className="zmdi zmdi-lock-outline"></i> */}
                          <LockIcon />
                        </label>
                        <input
                          defaultValue={signupCredentials.cpassword}
                          type="password"
                          name="re_pass"
                          id="re_pass"
                          placeholder="Repeat your password"
                          onChange={(e) =>
                            setSignupCredentials({
                              name: signupCredentials.name,
                              email: signupCredentials.email,
                              password: signupCredentials.password,
                              cpassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      {signupErrors.cpassword && (
                        <h6 className="error__message">
                          {signupErrors.cpassword}
                        </h6>
                      )}

                      <div className="form-group">
                        <div className="usertype__container">
                          <h6>Sign up as</h6>
                          <div>
                            <div>
                              <input
                                type="radio"
                                id="regularUser"
                                name="userType"
                                value="regularUser"
                                checked={
                                  userType == "regularUser" ? true : false
                                }
                                onClick={(e) => setUserType(e.target.value)}
                              />
                              <label for="html">Regular User</label>
                            </div>
                            <div>
                              <input
                                type="radio"
                                id="superUser"
                                name="userType"
                                value="superUser"
                                onClick={(e) => setUserType(e.target.value)}
                              />
                              <label for="css">Super User</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="form-group form-button"> */}
                      {/* <input
                          // type="submit"
                          name="signup"
                          id="signup"
                          className="form-submit login__form__submit"
                          value="Register"
                          onClick={signup}
                        /> */}
                      <span className="form__submit__btn__pro" onClick={signup}>
                        Sign Up
                      </span>
                      {/* </div> */}
                    </form>
                  </div>
                  <div className="signup-image">
                    <figure>
                      {/* <img src={signUpImage} alt="sing In image" /> */}
                      <img src={Logo} alt="sing In image" />
                    </figure>
                    <a
                      href="#"
                      className="signup-image-link"
                      onClick={() => setShowSignInForm(!showSignInForm)}
                    >
                      I am already member
                    </a>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormPage;
var validator = require("email-validator");
const validateEmail = (email) => {
  console.log("validating email>>>> ", email);
  let test;
  let length = email.length;
  let demail = email.slice(length - 4, length);
  console.log("demail>>>", demail);
  if (demail !== ".com") {
    return false;
  }
  let count = 0;
  let email2 = email.slice(0, length - 4);
  if (email2.includes(".com")) {
    return false;
  }
  if (
    !email.includes("@gmail.com") &&
    !email.includes("@yahoo.com") &&
    !email.includes("@hotmail.com") &&
    !email.includes("@outlook.com")
  ) {
    return false;
  }
  if (!validator.validate(email)) {
    return false;
  }
  return true;
};
