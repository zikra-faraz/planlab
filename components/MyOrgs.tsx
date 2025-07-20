"use client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { User2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { useOrgs } from "@/context/orgProvider";
import Link from "next/link";

const MyOrgs = () => {
  // const orgs = await getUserOrganizations();
  const orgs = useOrgs();
  return (
    <>
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">My Orgs</Button>
          </PopoverTrigger>
          <PopoverContent>
            <div className="space-y-2">
              {orgs.map((org) => (
                <div key={org.id}>
                  <Link href={`/organization/${org.slug}`}>
                    <p className="font-medium text-sm flex items-center gap-2 dark:text-gray-200 hover:underline ">
                      <span className="w-8 h-8 flex items-center justify-center rounded-full border-2 dark:text-white">
                        <User2 size={16} />
                      </span>
                      {org.name}
                    </p>
                  </Link>
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

export default MyOrgs;
