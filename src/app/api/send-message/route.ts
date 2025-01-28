import dbConnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/model/User";
import { messageSchema } from "@/schemas/messageSchama";

export async function POST(request: Request) {
  await dbConnect();
  const { userName, content } = await request.json();
  try {
    const user = await UserModel.findOne({ userName });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting message",
        },
        { status: 403 }
      );
    }

    const newMessage = { content, createdAt: new Date() };
    user.messages.push(newMessage as Message);
    await user.save();

    return Response.json(
      {
        success: false,
        message: "Message send successfully",
      },
      { status: 403 }
    );
  } catch (error) {
    console.log("Error adding messages: ", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
