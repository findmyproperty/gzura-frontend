"use client";
import { PropsWithChildren } from "react";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useCallback } from "react";
import { resolvePostLoginRedirect } from "@/lib/auth-utils";
import { useAuth } from "../providers/AuthProvider";
import { api } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";
import { isOnboardingComplete } from "@/lib/member-onboarding";
import { toast } from "@/hooks/use-toast";

const OneTapLogin = ({ children }: PropsWithChildren) => {
  const { login, user, loading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  const completeLogin = useCallback(
    async (res: Awaited<ReturnType<typeof api.login>>) => {
      login(res.accessToken, res.user);

      let destination = resolvePostLoginRedirect(
        res.user.role,
        searchParams.get("redirect"),
      );

      if (res.user.role === "MEMBER" && !isOnboardingComplete(res.user)) {
        destination = "/onboarding";
      }

      toast({
        title: `Welcome back! ${res.user.firstName}`,
        description: `Signed in as ${res.user.firstName}`,
      });

      router.push(destination);
    },
    [login, router, searchParams],
  );

  const handleGoogleSuccess = useCallback(
    async (credential: string) => {
      try {
        const res = await api.loginWithGoogle(credential);
        await completeLogin(res);
      } catch (err) {
        toast({
          title: "Google sign-in failed",
          description: err instanceof Error ? err.message : "Please try again",
          variant: "destructive",
        });
      }
    },
    [completeLogin],
  );

  useGoogleOneTapLogin({
    onSuccess: (credentialResponse) => {
      if (credentialResponse.credential) {
        handleGoogleSuccess(credentialResponse.credential);
      }
    },
    disabled: !!user || loading, // Disable One Tap if user is already logged in

    onError: () => {
      toast({
        title: "Google One Tap sign-in failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
    cancel_on_tap_outside: false,
  });

  return children;
};

export default OneTapLogin;
