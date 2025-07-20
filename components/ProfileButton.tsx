"use client";
import { useCurrentUser } from "@/context/UserProvider";
import { LogOut, User2, UserCircle2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { logoutCustom } from "@/actions/auth";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
const ProfileButton = () => {
  const { user } = useCurrentUser();
  // console.log("profile user ", user);
  // console.log(user);

  const handleLogout = async () => {
    const provider = user?.accounts?.[0]?.provider;

    if (provider === "google") {
      // Sign out using NextAuth
      signOut();
      await logoutCustom();
      toast("logout");
    } else {
      // Use your custom logout
      await logoutCustom();
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <button className="w-9 h-9 rounded-full border flex items-center justify-center bg-gray-900 hover:bg-purple-500 text-white">
            {user?.image ? (
              <>
                {" "}
                <Image
                  src={user?.image}
                  alt="Profile"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              </>
            ) : (
              <>
                {user?.name ? (
                  <span className="w-9 h-9 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <UserCircle2 size={20} className="text-white" />
                )}{" "}
              </>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
        //   className="w-64 p-4 absolute right-0
        //      !left-auto !top-12 !translate-y-0 !translate-x-0
        //      border shadow-xl bg-white dark:bg-black"
        >
          <div className="space-y-2">
            <p className="font-medium text-sm flex items-center gap-2 dark:text-gray-200  ">
              <span className="w-8 h-8 flex items-center justify-center rounded-full border-2  dark:text-white">
                <User2 size={16} />
              </span>
              {user?.name ?? "Unknown User"}
            </p>
            <Separator />

            <div
              onClick={handleLogout}
              className="cursor-pointer flex justify-start items-center gap-2 font-medium text-sm dark:text-gray-200"
            >
              {" "}
              <LogOut size={16} className="ml-2" /> Log out
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ProfileButton;
