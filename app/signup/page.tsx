import SignupForm from "@/components/auth/SignupForm";
import React from "react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Create your TGA Law Group account to access exclusive legal resources, documents, and professional legal services.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Sign Up | TGA Law Group',
    description: 'Create your TGA Law Group account to access exclusive legal resources, documents, and professional legal services.',
    url: '/signup',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Sign Up | TGA Law Group',
    description: 'Create your TGA Law Group account.',
  },
}

export default function SignupPage() {
	return <SignupForm />;
} 