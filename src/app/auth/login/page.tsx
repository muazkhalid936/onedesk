"use client"

import { useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { login } from "@/api/auth"
import { useAuthStore } from "@/store/useAuthStore"
import { useRouter } from "next/navigation"

interface ApiError {
  success: false
  errors: {
    detail?: string[]
    email?: string[]
    password?: string[]
  }
}

export default function LoginPage() {
  const router = useRouter()
  const { saveUser } = useAuthStore()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ 
    email?: string
    password?: string
    general?: string 
  }>({})

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const data = await login({ email, password })
      
      if (data) {
        const user = {
          user_id: data.user_id,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
        }
        saveUser(user, data.access, data.refresh)
        toast.success("Logged in successfully!")
        router.push("/") // Redirect to home page
      }
    } catch (error: unknown) {
      console.error("Login error:", error)
      
      // Handle API error response
      if (error && typeof error === 'object' && 'errors' in error) {
        const apiError = error as ApiError
        const newErrors: { email?: string; password?: string; general?: string } = {}

        if (apiError.errors) {
          // Handle email errors
          if (apiError.errors.email && apiError.errors.email.length > 0) {
            newErrors.email = apiError.errors.email[0]
          }
          
          // Handle password errors
          if (apiError.errors.password && apiError.errors.password.length > 0) {
            newErrors.password = apiError.errors.password[0]
          }
          
          // Handle general/detail errors
          if (apiError.errors.detail && apiError.errors.detail.length > 0) {
            newErrors.general = apiError.errors.detail[0]
          }
        }

        setErrors(newErrors)
        
        // Show toast for general errors
        if (newErrors.general) {
          toast.error(newErrors.general)
        }
      } else {
        // Handle network or other errors
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
        setErrors({ general: errorMessage })
        toast.error(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
            <div className="text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/signup"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}