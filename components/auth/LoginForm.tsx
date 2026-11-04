"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/app/actions/auth.actions";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

const cardClass = "rounded-sm border-0 bg-white shadow-none ring-1 ring-brand-navy/10";
const labelClass = "text-sm font-medium text-brand-navy";
const inputClass =
	"mt-1.5 rounded-sm border-0 bg-white text-brand-navy ring-1 ring-brand-navy/15 ring-offset-0 placeholder:text-brand-navy/40 focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-0";
const submitClass =
	"h-auto w-full rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-green";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await signIn({ username, password });
			login(response.user);
			
			toast({
				title: "Success!",
				description: "You have been logged in successfully.",
			});

			// Redirect to home page
			window.location.href = "/";
		} catch (error: any) {
			toast({
				title: "Error",
				description: error.message || "Failed to sign in",
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
						Sign in to your account
					</h2>
					<p className="mt-2 text-center text-sm text-brand-navy/60">
						Or{" "}
						<Link
							href="/signup"
							className="font-medium text-brand-green hover:text-brand-navy"
						>
							create a new account
						</Link>
					</p>
				</div>
				<Card className={cardClass}>
					<CardHeader>
						<CardTitle className="text-center text-xl font-semibold tracking-tight text-brand-navy">Login</CardTitle>
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
								<Label htmlFor="password" className={labelClass}>Password</Label>
								<Input
									className={inputClass}
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									placeholder="Enter your password"
								/>
							</div>
							<Button
								type="submit"
								className={submitClass}
								disabled={isLoading}
							>
								{isLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 