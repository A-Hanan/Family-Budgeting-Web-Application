import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../../Actions/userActions";
import { Avatar } from "@mui/material";
// import Notifications from "../../Components/Notifications/Notifications";
// import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
// import api from "../../utils/api";

const Navbar = () => {
//   const dispatch = useDispatch();
  const [showNotifications, setShowNotifications] = useState(false);
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  //   const userstate = useSelector((state) => state.loginUserReducer);
  //   const { currentUser } = userstate;
  const currentUser = {};
  const [showCategories, setShowCategories] = useState(false);
  let categories = [
    "General Practice",
    "Criminal",
    "Civil",
    "Taxation",
    "Banking and finance",
    "Family Law",
    "Cyber Crime",
  ];
  const navigate = useNavigate();

  //   useEffect(() => {
  //     let count = 0;
  //     api
  //       .get(`/notifications/${currentUser?.id}`)
  //       .then((res) => {
  //         //console.log(res.data);
  //         setAllNotifications(res.data);
  //         const notifications = res.data;

  //         /********************* */
  //         notifications.forEach((notification) => {
  //           if (notification?.read == false) {
  //             count++;
  //           }
  //         });
  //       })
  //       .catch((err) => console.log);

  //     setTimeout(() => {
  //       setUnreadNotificationCount(count);
  //     }, 500);
  //   }, []);
  const showNotificationsContainer = (e) => {
    e.preventDefault();
    showNotifications
      ? setShowNotifications(false)
      : setShowNotifications(true);
  };
  const hideNotifications = () => {
    setShowNotifications(false);
  };
  return (
    <div className="n__navbar">
      <h1 className="n__logo" onClick={() => navigate("/")}>
        Connect&nbsp; <span>Legal</span>
      </h1>
      <div className="n__menus">
        <h3 onClick={() => navigate("/")}>Home</h3>
        <h3 onClick={() => navigate("/lawyers")}>Explore All Lawyers</h3>
        <h3 onClick={() => setShowCategories(!showCategories)}>
          Explore All Categories
        </h3>

        {currentUser?.name && (
          <h3 onClick={() => navigate("/dashboard")}>Dashboard</h3>
        )}
        {currentUser?.name && (
          <h3
            className=" notif-menu"
            onClick={(e) => showNotificationsContainer(e)}
          >
            {/* <div className="bell">
              <NotificationsNoneIcon />
            </div> */}
            {unreadNotificationCount > 0 ? (
              <span>{unreadNotificationCount}</span>
            ) : (
              <></>
            )}
          </h3>
        )}
      </div>
      <div className="n__login__options">
        {currentUser?.name ? (
          <>
            <Avatar src={currentUser?.profile}>
              {!currentUser?.profile && currentUser?.name[0]}
            </Avatar>
            <button
              className="n__login__btn"
              // onClick={dispatch(logoutUser)}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              className="n__login__btn"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="n__signup__btn"
              onClick={() => navigate("/signup")}
            >
              Signup
            </button>
          </>
        )}
      </div>
      {showCategories && (
        <div className="category__dropdown">
          <h1>Categories</h1>
          <div className="categories">
            {categories?.map((c) => (
              <h3
                onClick={() => {
                  setShowCategories(false);
                  navigate(`/lawyers/${c}`);
                }}
              >
                {c}
              </h3>
            ))}
          </div>
        </div>
      )}
      {/* {showNotifications ? (
        <Notifications
          hideNotifications={hideNotifications}
          setUnreadNotificationCount={setUnreadNotificationCount}
          notifications={allNotifications}
        />
      ) : (
        <></>
      )} */}
    </div>
  );
};

export default Navbar;
