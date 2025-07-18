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
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							href="/login"
							className="font-medium text-teal-600 hover:text-teal-500"
						>
							sign in to your existing account
						</Link>
					</p>
				</div>
				<Card>
					<CardHeader>
						<CardTitle className="text-center">Sign Up</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									type="text"
									value={username}
									onChange={(e) => setUsername(e.target.value)}
									required
									placeholder="Enter your username"
								/>
							</div>
							<div>
								<Label htmlFor="phone_number">Phone Number</Label>
								<Input
									id="phone_number"
									type="tel"
									value={phone_number}
									onChange={(e) => setPhoneNumber(e.target.value)}
									required
									placeholder="Enter your phone number"
								/>
							</div>
							<div>
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									placeholder="Enter your email"
								/>
							</div>
							<div>
								<Label htmlFor="password">Password</Label>
								<Input
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
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<Input
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
								className="w-full bg-teal-600 hover:bg-teal-700"
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