import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold mb-4">Please check your Email</h1>
        <p className="text-gray-600 mb-6"> We've sent you a confirmed link. Please check your email to activate your account.</p>
        <Link href="/">
          <Button>Back to home </Button>
        </Link>
      </div>
    </div>
  )
}
