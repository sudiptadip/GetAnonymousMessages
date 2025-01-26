import React from "react";
import { Html, Head, Preview, Body, Container, Text } from "@react-email/components";

interface VerificationEmailProps {
  userName: string;
  otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ userName, otp }) => {
  return (
    <Html>
      <Head />
      <Preview>Your Verification Code</Preview>
      <Body className="bg-gray-100 p-5">
        <Container className="bg-white p-6 rounded-lg shadow-md max-w-xl mx-auto">
          <Text className="text-xl font-bold mb-4">Hi {userName},</Text>
          <Text className="text-base mb-4">
            Use the following OTP to verify your email address:
          </Text>
          <Text className="text-2xl font-bold text-blue-600 text-center my-6">{otp}</Text>
          <Text className="text-base mb-4">
            If you did not request this, please ignore this email.
          </Text>
          <Text className="text-sm text-gray-500 mt-6 text-center">
            Thanks, <br /> The Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;