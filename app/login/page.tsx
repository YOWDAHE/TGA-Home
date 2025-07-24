import LoginForm from "@/components/auth/LoginForm";
import React from "react";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your TGA Law Group account to access exclusive legal resources and services.',
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Login | TGA Law Group',
    description: 'Login to your TGA Law Group account to access exclusive legal resources and services.',
    url: '/login',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Login | TGA Law Group',
    description: 'Login to your TGA Law Group account.',
  },
}

export default function LoginPage() {
	return <LoginForm />;
} 