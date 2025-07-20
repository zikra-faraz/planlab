"use client";
import React from "react";
import ThemeToggle from "@/components/ThemeToggle";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PenBox, UserCircle2 } from "lucide-react";

import Image from "next/image";
import { useCurrentUser } from "@/context/UserProvider";
import ProfileButton from "@/components/ProfileButton";
import MyOrgs from "@/components/MyOrgs";
import { useOrgs } from "@/context/orgProvider";

const Header = () => {
  const { user } = useCurrentUser();
  // console.log("contextt usr ", user);

  const orgs = useOrgs();
  // console.log(user);

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
              <div className="">
                {user ? (
                  <>
                    <div className="flex gap-4 ">
                      {/* <Link href="/project/create">
                        <Button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 cursor-pointer">
                          <PenBox size={18} className="text-white" />
                          <span className="hidden md:inline text-white">
                            Create Project
                          </span>
                        </Button>
                      </Link> */}
                      {orgs && <MyOrgs />}

                      <ProfileButton />
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button
                        variant="outline"
                        className="bg-purple-600 text-white"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <ThemeToggle />
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
