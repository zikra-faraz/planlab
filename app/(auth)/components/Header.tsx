import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";

import Image from "next/image";

const Header = async () => {
  return (
    <>
      <header className="fixed top-0 z-50 w-full bg-white/30 dark:bg-black/20 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-sm">
        <div className="container mx-auto">
          <nav className="h-20 py-6 px-4 flex justify-between items-center  ">
            <Link href="/">
              <div className="flex items-center gap-1 ">
                {" "}
                <Image
                  src={"/plan.png"}
                  alt="Plan lab Logo"
                  width={50}
                  height={50}
                  className="object-fit"
                />
                <p className="text-3xl font-bold tracking-tight text-purple-500">
                  Pl<span className="dark:text-white text-black ">a</span>n{" "}
                  <span className="dark:text-white text-black">Lab</span>
                </p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
