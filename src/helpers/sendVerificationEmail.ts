import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import ApiResponse from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  userName: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Verification Code",
      react: await Promise.resolve(
        VerificationEmail({ userName, otp: verifyCode })
      ),
    });
    return {
      success: true,
      message: "verification email send successfully",
    };
  } catch (error) {
    console.error("Error sending verification email", error);
    return {
      message: "Error sending verification email",
      success: false,
    };
  }
}
