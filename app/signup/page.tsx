"use client";

import { signup } from "@/app/auth/actions";
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

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const passwordRequirements = [
    { label: "최소 8자 이상", met: password.length >= 8 },
    { label: "대문자 포함", met: /[A-Z]/.test(password) },
    { label: "소문자 포함", met: /[a-z]/.test(password) },
    { label: "숫자 포함", met: /[0-9]/.test(password) },
    { label: "특수문자 포함", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
  ];

  const metCount = passwordRequirements.filter((req) => req.met).length;
  const isPasswordValid = metCount === passwordRequirements.length;

  const strengthLabels = ["매우 약함", "약함", "보통", "강함", "매우 강함"];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];

  const isConfirmEmpty = confirmPassword === "";
  const isMatched = password === confirmPassword && !isConfirmEmpty;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isMatched || !isPasswordValid) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await signup(formData);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Welcome to the Don&apos;t Worry Board. Join us to share your
            thoughts.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname</Label>
              <Input
                id="nickname"
                name="nickname"
                placeholder="2-10 characters"
                required
                minLength={2}
                maxLength={10}
              />
            </div>
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
                <span className="text-gray-500">@</span>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="space-y-2 mt-2">
                <div className="flex gap-1 h-1.5 w-full">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={`h-full flex-1 rounded-full transition-colors ${
                        i < metCount
                          ? strengthColors[metCount - 1]
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {password && (
                  <p className="text-[10px] text-gray-500 text-right font-medium">
                    강도: {strengthLabels[metCount - 1] || "매우 약함"}
                  </p>
                )}
                <ul className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {passwordRequirements.map((req, i) => (
                    <li
                      key={i}
                      className={`text-[11px] flex items-center gap-1.5 transition-colors ${
                        req.met ? "text-green-600" : "text-gray-400"
                      }`}
                    >
                      <span className="font-bold">{req.met ? "✓" : "✗"}</span>
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!isConfirmEmpty && (
                <p
                  className={`text-xs font-medium ${
                    isMatched ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isMatched ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>
            {error && (
              <p className="text-sm font-medium text-destructive">{error}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isMatched || !isPasswordValid}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </Button>
            <div className="text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
