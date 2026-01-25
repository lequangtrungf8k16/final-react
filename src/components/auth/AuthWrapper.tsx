import React from "react";
import { Link, useLocation } from "react-router-dom";

interface AuthWrapperProps {
  children: React.ReactNode;
  title: string;
  subTitle?: string;
}

export default function AuthWrapper({
  children,
  title,
  subTitle,
}: AuthWrapperProps) {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const isRegister = location.pathname === "/register";

  return (
    <div className="flex flex-col gap-4 justify-center items-center min-h-screen px4 bg-gray-50 dark:bg-black">
      <h1 className="text-4xl font-bold">Instagram Fake</h1>
      <div className="bg-white border dark:bg-black dark:border-gray-800 rounded-2xl shadow-xl w-100 overflow-hidden">
        <div className="pt-8 px-8 pb-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {title}
          </h2>
          {subTitle && (
            <p className="text-gray-500 dark:text-white text-sm">{subTitle}</p>
          )}
        </div>

        {/* TABS SWITCHER */}
        <div className="flex border-b border-gray-100 mt-4">
          <Link
            to="/login"
            className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
              isLogin
                ? "text-blue-600 dark:text-white bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Login
            {isLogin && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </Link>

          <Link
            to="/register"
            className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
              isRegister
                ? "text-blue-600 dark:text-white bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Register
            {isRegister && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full" />
            )}
          </Link>
        </div>

        <div className="p-8">{children}</div>
      </div>
    </div>
  );
}
