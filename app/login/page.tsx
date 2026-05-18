"use client";

import { login } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [emailId, setEmailId] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("gmail.com");
  const [customDomain, setCustomDomain] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const domain = isCustom ? customDomain : selectedDomain;
  const fullEmail = emailId && domain ? `${emailId}@${domain}` : "";

  const handleDomainChange = (value: string) => {
    if (value === "custom") {
      setIsCustom(true);
      setSelectedDomain("");
    } else {
      setIsCustom(false);
      setSelectedDomain(value);
    }
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // fullEmail is already in the hidden input named "email"
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Login to your account to share your worries.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-id">Email</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="email-id"
                  placeholder="ID"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                  required
                  className="flex-1"
                />
                <span className="text-gray-500"> @ </span>
                <Select
                  onValueChange={handleDomainChange}
                  defaultValue="gmail.com"
                >
                  <SelectTrigger className="w-[140px] px-4">
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gmail.com">gmail.com</SelectItem>
                    <SelectItem value="naver.com">naver.com</SelectItem>
                    <SelectItem value="kakao.com">kakao.com</SelectItem>
                    <SelectItem value="daum.net">daum.net</SelectItem>
                    <SelectItem value="nate.com">nate.com</SelectItem>
                    <SelectItem value="hanmail.net">hanmail.net</SelectItem>
                    <SelectItem value="outlook.com">outlook.com</SelectItem>
                    <SelectItem value="custom">직접 입력</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {isCustom && (
                <Input
                  placeholder="Enter custom domain"
                  value={customDomain}
                  onChange={(e) => setCustomDomain(e.target.value)}
                  required
                  className="mt-2"
                />
              )}
              {fullEmail && (
                <p className="text-xs text-gray-400 mt-1">
                  Preview: {fullEmail}
                </p>
              )}
              <input type="hidden" name="email" value={fullEmail} />
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>{" "}
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
