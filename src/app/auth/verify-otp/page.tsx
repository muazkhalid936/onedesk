"use client";

import { useState, useEffect } from "react";
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
import { verify_otp, request_otp_again } from "@/api/auth";

interface ApiError {
  success: false;
  errors: {
    detail?: string[];
    email?: string[];
    otp?: string[];
  };
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    general?: string;
  }>({});

  useEffect(() => {
    // Get email from session storage (set during signup)
    const storedEmail = sessionStorage.getItem("signup_email");
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email found, redirect to signup
      toast.error("Please complete signup first");
      router.push("/auth/signup");
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: { email?: string; otp?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!otp) {
      newErrors.otp = "OTP is required";
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "OTP must be 6 digits";
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
      await verify_otp({ email, otp });

      // Clear stored email
      sessionStorage.removeItem("signup_email");

      toast.success("Email verified successfully! You can now log in.");
      router.push("/auth/login");
    } catch (error: unknown) {
      console.error("OTP verification error:", error);

      // Handle API error response
      if (error && typeof error === "object" && "errors" in error) {
        const apiError = error as ApiError;
        const newErrors: { email?: string; otp?: string; general?: string } =
          {};

        if (apiError.errors) {
          // Handle email errors
          if (apiError.errors.email && apiError.errors.email.length > 0) {
            newErrors.email = apiError.errors.email[0];
          }

          // Handle OTP errors
          if (apiError.errors.otp && apiError.errors.otp.length > 0) {
            newErrors.otp = apiError.errors.otp[0];
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

  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsResending(true);

    try {
      await request_otp_again({ email });
      toast.success("New OTP sent to your email!");
    } catch (error: unknown) {
      console.error("Resend OTP error:", error);

      if (error && typeof error === "object" && "errors" in error) {
        const apiError = error as ApiError;
        if (apiError.errors?.detail && apiError.errors.detail.length > 0) {
          toast.error(apiError.errors.detail[0]);
        } else {
          toast.error("Failed to resend OTP. Please try again.");
        }
      } else {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to resend OTP";
        toast.error(errorMessage);
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Verify Email
          </CardTitle>
          <CardDescription className="text-center">
            Enter the 6-digit code sent to your email address
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
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className={`text-center text-lg tracking-widest ${
                  errors.otp ? "border-red-500" : ""
                }`}
                maxLength={6}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
            <div className="flex flex-col items-center space-y-2">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isResending || !email}
                onClick={handleResendOtp}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </Button>
              <div className="text-center text-sm">
                Remember your password?{" "}
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
