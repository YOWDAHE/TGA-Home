import LoginForm from "@/components/auth/LoginForm";
import React from "react";
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Login',
  description: 'Sign in to your TGA Global Law Firm LL.P account to access legal resources and services.',
  path: '/login',
  card: { eyebrow: 'Account', title: 'Sign in to TGA Global' },
  noIndex: true,
})

export default function LoginPage() {
	return <LoginForm />;
} 