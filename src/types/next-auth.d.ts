import { Message } from "@/model/User";
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    userName?: string;
    email?: string;
    password?: string;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
  }
  interface Session {
    user: {
      _id?: string;
      userName?: string;
      email?: string;
      password?: string;
      verifyCode?: string;
      verifyCodeExpiry?: Date;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
    } & DefaultSession["user"];
  }
}
