"use client";

// import { Metadata } from "next";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

import logo from "@/public/logo.png";
import { FcGoogle } from "react-icons/fc";
import { ArrowLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

// export const metadata: Metadata = {
//   title: "Sign In",
// };

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push("/dashboard");
  }, [user, router]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-300 p-10 md:p-24 dark:bg-gray-800">
      <section className="flex flex-col gap-5">
        <div className="flex justify-center">
          <Link href={"/"}>
            <Image
              src={logo}
              width={300}
              height={300}
              alt="logo"
              className="dark:contrast-0"
            />
          </Link>
        </div>
        <div className="flex w-full flex-col gap-3 rounded-xl bg-white p-5 sm:min-w-[440px] md:p-10 dark:bg-gray-600">
          <h1 className="text-xl font-bold">Sign in with Email</h1>
          <form className="flex flex-col gap-3">
            <input
              type="email"
              name="user-email"
              id="user-email"
              placeholder="Enter Your Email"
              className="w-full rounded-lg border px-3 py-2 focus:border-transparent"
            />
            <input
              type="password"
              name="user-password"
              id="user-password"
              placeholder="Enter Your Password"
              className="w-full rounded-lg border px-3 py-2 focus:border-transparent"
            />
            <Button className="cursor-pointer font-bold duration-300 dark:bg-white dark:hover:bg-gray-300">
              Sign in
            </Button>
          </form>
          <div className="flex flex-col justify-between sm:flex-row">
            <Link href={"/sign-up"}>
              <button className="cursor-pointer text-sm font-semibold text-blue-500 dark:text-white">
                Create Account
              </button>
            </Link>
            <Link href={"/forgot-password"}>
              <button className="cursor-pointer text-sm font-semibold text-blue-500 dark:text-white">
                Forgot Password
              </button>
            </Link>
          </div>
          <hr />
          <SignInWithGoogleComponent />
        </div>
        <Link
          href="/"
          className="flex cursor-pointer items-center px-2 text-sm font-semibold text-gray-600 hover:text-blue-500 dark:text-white"
        >
          <ArrowLeft size={"1rem"} />
          Back To Home
        </Link>
      </section>
    </main>
  );
}

function SignInWithGoogleComponent() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSignIn = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const user: UserCredential = await signInWithPopup(
        auth,
        new GoogleAuthProvider(),
      );
      console.log(user);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unknown error occurred.");
      }
    }
    setIsLoading(false);
  };
  return (
    <Button
      variant="secondary"
      disabled={isLoading}
      className="flex cursor-pointer items-center justify-center duration-300 hover:bg-gray-300 dark:hover:text-black"
      onClick={handleSignIn}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      <FcGoogle />
      Sign in with Google
    </Button>
  );
}
