import React from "react";

const Footer = () => {
  return (
    <>
      <div className="w-full border-t mt-auto bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-sm">
          &copy; {new Date().getFullYear()} Plan Lab. All rights reserved.
        </div>
      </div>
    </>
  );
};

export default Footer;
