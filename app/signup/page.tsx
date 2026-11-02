import SignupForm from "@/components/auth/SignupForm";
import React from "react";
import type { Metadata } from 'next'
import { pageMetadata } from '@/lib/seo'

export const metadata: Metadata = pageMetadata({
  title: 'Sign Up',
  description: 'Create your TGA Global Law Firm LL.P account to access legal resources, documents and services.',
  path: '/signup',
  card: { eyebrow: 'Account', title: 'Create your TGA Global account' },
  noIndex: true,
})

export default function SignupPage() {
	return <SignupForm />;
} 