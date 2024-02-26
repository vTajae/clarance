import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* <span>&copy; {new Date().getFullYear()} International Communications Management, Inc.</span> */}
        <div className="flex">
          <a href="/info/terms" className="text-white hover:text-gray-300 mr-4">
            Terms of Service
          </a>
          <a href="/info/privacy" className="text-white hover:text-gray-300">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
