"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/app/actions/auth.actions";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const cardClass = "rounded-sm border-0 bg-white shadow-none ring-1 ring-brand-navy/10";
const labelClass = "text-sm font-medium text-brand-navy";
const inputClass =
	"mt-1.5 rounded-sm border-0 bg-white text-brand-navy ring-1 ring-brand-navy/15 ring-offset-0 placeholder:text-brand-navy/40 focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-0";
const submitClass =
	"h-auto w-full rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-green";

export default function SignupForm() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone_number, setPhoneNumber] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// Validate passwords match
		if (password !== confirmPassword) {
			toast({
				title: "Error",
				description: "Passwords do not match",
				variant: "destructive",
			});
			setIsLoading(false);
			return;
		}

		try {
			const response = await signUp({ username, email, phone_number, password });
			login(response.user);
			
			toast({
				title: "Success!",
				description: "Account created successfully.",
			});

			// Redirect to home page
			window.location.href = "/";
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Failed to create account",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-[#f4f5f7] px-4 py-12 text-brand-navy antialiased sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-brand-navy">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-brand-navy/60">
						Or{" "}
						<Link
							href="/login"
							className="font-medium text-brand-green hover:text-brand-navy"
						>
							sign in to your existing account
						</Link>
					</p>
				</div>
				<Card className={cardClass}>
					<CardHeader>
						<CardTitle className="text-center text-xl font-semibold tracking-tight text-brand-navy">Sign Up</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="username" className={labelClass}>Username</Label>
								<Input
									className={inputClass}
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									placeholder="Enter your username"
								/>
							</div>
							<div>
								<Label htmlFor="phone_number" className={labelClass}>Phone Number</Label>
								<Input
									className={inputClass}
									id="phone_number"
									type="tel"
									value={phone_number}
									onChange={(e) => setPhoneNumber(e.target.value)}
									required
									placeholder="Enter your phone number"
								/>
							</div>
							<div>
								<Label htmlFor="email" className={labelClass}>Email</Label>
								<Input
									className={inputClass}
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									placeholder="Enter your email"
								/>
							</div>
							<div>
								<Label htmlFor="password" className={labelClass}>Password</Label>
								<Input
									className={inputClass}
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									placeholder="Enter your password"
									minLength={6}
								/>
							</div>
							<div>
								<Label htmlFor="confirmPassword" className={labelClass}>Confirm Password</Label>
								<Input
									className={inputClass}
									id="confirmPassword"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
									placeholder="Confirm your password"
									minLength={6}
								/>
							</div>
							<Button
								type="submit"
								className={submitClass}
								disabled={isLoading}
							>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 