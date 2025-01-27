import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { userNameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
  userName: userNameValidation,
});

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const queryParams = {
      userName: searchParams.get("userName"),
    };
    const result = UsernameQuerySchema.safeParse(queryParams);
    console.log("result", result);
    if (!result.success) {
      const userNameError = result.error.format().userName?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            userNameError.length > 0
              ? userNameError.join(", ")
              : "Invalid query parameters",
        },
        { status: 400 }
      );
    }

    const { userName } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      userName,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "Username already taken",
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "Username is unique",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
