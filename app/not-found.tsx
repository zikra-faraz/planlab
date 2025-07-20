// app/not-found.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div>
        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
        <p className="mt-4 text-gray-500">
          The page you're looking for doesn't exist.
        </p>
        <Link href="/" className="text-purple-400">
          <div className="flex gap-3 justify-center items-center mt-4">
            <ArrowLeft size={20} /> Back Home{" "}
          </div>
        </Link>
      </div>
    </div>
  );
}
