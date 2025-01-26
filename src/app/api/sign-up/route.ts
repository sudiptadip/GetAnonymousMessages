import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import ApiResponse from "@/types/ApiResponse";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { userName, email, password } = await request.json();
    const existingUserVerifiedByUserName = await UserModel.findOne({
      isVerified: true,
      userName,
    });

    if (existingUserVerifiedByUserName) {
      return Response.json(
        {
          success: true,
          message: "UserName is Already exists",
        },
        { status: 400 }
      );
    }

    const existingUserVerifiedByUserEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(100000 + Math.random() * 9000).toString();
    if (existingUserVerifiedByUserEmail) {
      if (existingUserVerifiedByUserEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "User exists with this email",
          },
          { status: 400 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserVerifiedByUserEmail.password = hashPassword;
        existingUserVerifiedByUserEmail.verifyCode = verifyCode;
        existingUserVerifiedByUserEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );
        await existingUserVerifiedByUserEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        userName,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await newUser.save();
    }

    const emailResponse = await sendVerificationEmail(
      email,
      userName,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: false,
        message: "User register successfully. and please verify your email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("error register user");

    return Response.json(
      {
        success: false,
        message: "error register user",
      },
      {
        status: 500,
      }
    );
  }
}
