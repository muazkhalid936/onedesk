"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { request_otp_again } from "@/api/auth";

interface ApiError {
  success: false;
  errors: {
    detail?: string[];
    email?: string[];
  };
}

export default function RequestOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    general?: string;
  }>({});

  const validateForm = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await request_otp_again({ email });

      // Store email for OTP verification
      sessionStorage.setItem("signup_email", email);

      toast.success("Verification code sent! Check your email.");
      router.push("/auth/verify-otp");
    } catch (error: unknown) {
      console.error("Request OTP error:", error);

      // Handle API error response
      if (error && typeof error === "object" && "errors" in error) {
        const apiError = error as ApiError;
        const newErrors: { email?: string; general?: string } = {};

        if (apiError.errors) {
          // Handle email errors
          if (apiError.errors.email && apiError.errors.email.length > 0) {
            newErrors.email = apiError.errors.email[0];
          }

          // Handle general/detail errors
          if (apiError.errors.detail && apiError.errors.detail.length > 0) {
            newErrors.general = apiError.errors.detail[0];
          }
        }

        setErrors(newErrors);

        // Show toast for general errors
        if (newErrors.general) {
          toast.error(newErrors.general);
        }
      } else {
        // Handle network or other errors
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        setErrors({ general: errorMessage });
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Request Verification Code
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address to receive a new verification code
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errors.general && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errors.general}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Verification Code"}
            </Button>
            <div className="text-center text-sm space-y-2">
              <div>
                Already have a code?{" "}
                <Link
                  href="/auth/verify-otp"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Verify now
                </Link>
              </div>
              <div>
                Back to{" "}
                <Link
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
