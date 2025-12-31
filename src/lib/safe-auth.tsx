import {
  ClerkProvider as RealClerkProvider,
  SignedIn as RealSignedIn,
  SignedOut as RealSignedOut,
  SignInButton as RealSignInButton,
  UserButton as RealUserButton,
  useUser as useRealUser,
} from "@clerk/clerk-react";
import React from "react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const ClerkProvider = (props: any) => {
  if (PUBLISHABLE_KEY) {
    return <RealClerkProvider {...props} publishableKey={PUBLISHABLE_KEY} />;
  }
  return <>{props.children}</>;
};

export const SignedIn = (props: any) => {
  if (PUBLISHABLE_KEY) {
    return <RealSignedIn {...props} />;
  }
  return null;
};

export const SignedOut = (props: any) => {
  if (PUBLISHABLE_KEY) {
    return <RealSignedOut {...props} />;
  }
  return <>{props.children}</>;
};

export const SignInButton = (props: any) => {
  if (PUBLISHABLE_KEY) return <RealSignInButton {...props} />;
  return null;
};

export const UserButton = (props: any) => {
  if (PUBLISHABLE_KEY) return <RealUserButton {...props} />;
  return null;
};

export const useUser = () => {
  if (PUBLISHABLE_KEY) {
    return useRealUser();
  }
  return { isSignedIn: false, user: null, isLoaded: true };
};
