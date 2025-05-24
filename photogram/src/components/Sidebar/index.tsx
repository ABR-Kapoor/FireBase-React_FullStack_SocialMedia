import { cn } from "@/lib/utils";
import React from "react";
import { buttonVariants } from "../ui/button";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "@/assets/icon/home.svg";
import PhotoIcon from "@/assets/icon/photos.svg";
import AddPhotoIcon from "@/assets/icon/add.svg";
import ProfileIcon from "@/assets/icon/profile.svg";
import NotificationIcon from "@/assets/icon/notification.svg";
import SettingIcon from "@/assets/icon/setting.svg";
import DirectIcon from "@/assets/icon/direct.svg";
import LogoutIcon from "@/assets/icon/logout.svg";
import { useUserAuth } from "@/context/useAuthContext";

interface ISidebarprops {}

const navItem = [
  {
    name: "Home",
    link: "/",
    icon: HomeIcon,
  },
  {
    name: "Add photos",
    link: "/post",
    icon: AddPhotoIcon,
  },
  {
    name: "My Photos",
    link: "/myphotos",
    icon: PhotoIcon,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: ProfileIcon,
  },
  {
    name: "Notification",
    link: "#",
    icon: NotificationIcon,
  },
  {
    name: "Direct",
    link: "#",
    icon: DirectIcon,
  },
  {
    name: "Settings",
    link: "#",
    icon: SettingIcon,
  },
];

const Sidebar: React.FC<ISidebarprops> = () => {
  const { pathname } = useLocation();
  const { logOut } = useUserAuth();

  return (
    <nav className="flex flex-col space-y-2 relative h-screen max-w-sm w-full">
      <div className="flex justify-center m-5">
        <div className="text-white text-lg">PhotoGram</div>
      </div>

      {navItem.map((item) => (
        <div
          key={item.name}
          className={cn(
            buttonVariants({ variant: "default" }),
            pathname === item.link
              ? "bg-white text-white-800 hover:bg-white rounded-none"
              : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
            "justify-start"
          )}
        >
          <Link to={item.link} className="flex items-center gap-2">
            <span>
              <img
                src={item.icon}
                alt="img"
                className="w-5 h-5 mr-2"
                style={{
                  filter: `${
                    pathname === item.link ? "invert(0)" : "invert(1)"
                  } `,
                }}
              />
            </span>
            <span>{item.name}</span>
          </Link>
        </div>
      ))}

      <div 
        className={cn(
          buttonVariants({ variant: "default" }),
          pathname === "/login"
            ? "bg-white text-white-800 hover:bg-white rounded-none"
            : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
          "justify-start"
        )}
      >
        <Link to="/login" className="flex items-center gap-2" onClick={logOut}>
          <span>
            <img
              src={LogoutIcon}
              alt="logout"
              className="w-5 h-5 mr-2"
              style={{
                filter: `${
                  pathname === "/login" ? "invert(0)" : "invert(1)"
                } `,
              }}
            />
          </span>
          <span>Log Out</span>
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
