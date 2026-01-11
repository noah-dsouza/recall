import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LogoLockup } from "./LogoLockup";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <LogoLockup size="lg" />
            </div>
            <p className="text-sm text-[#6B7280] text-center">
              Institutional Memory for Decisions
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#F8F9FA] border-[rgba(0,0,0,0.08)] focus:ring-[#2D4B9E] focus:border-[#2D4B9E]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#F8F9FA] border-[rgba(0,0,0,0.08)] focus:ring-[#2D4B9E] focus:border-[#2D4B9E]"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2D4B9E] hover:bg-[#253D82] text-white"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[rgba(0,0,0,0.08)]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-[#6B7280]">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-6 border-[rgba(0,0,0,0.08)] hover:bg-[#F8F9FA]"
              onClick={onLogin}
            >
              Continue in Demo Mode
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-[#6B7280] mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}
