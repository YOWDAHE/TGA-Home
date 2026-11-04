"use client";

import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lock, MessageCircle, User, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";

interface AuthRequiredModalProps {
	isOpen: boolean;
	onClose: () => void;
	action?: string; // e.g., "comment", "like", "share"
}

export default function AuthRequiredModal({ 
	isOpen, 
	onClose, 
	action = "comment" 
}: AuthRequiredModalProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleLogin = () => {
		setIsLoading(true);
		window.location.href = "/login";
	};

	const handleSignup = () => {
		setIsLoading(true);
		window.location.href = "/signup";
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="rounded-sm border-0 shadow-none ring-1 ring-brand-navy/10 sm:max-w-md sm:rounded-sm">
				<DialogHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-sm bg-brand-tint">
						<Lock className="h-8 w-8 text-brand-green" />
					</div>
					<DialogTitle className="text-xl font-semibold tracking-tight text-brand-navy">
						Authentication Required
					</DialogTitle>
					<DialogDescription className="text-brand-navy/75">
						You need to be signed in to {action}. Join our community to engage with others!
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Card className="rounded-sm border-0 bg-brand-tint/50 shadow-none ring-1 ring-brand-navy/10">
						<CardContent className="p-4">
							<div className="flex items-start space-x-3">
								<MessageCircle className="mt-0.5 h-5 w-5 text-brand-green" />
								<div className="flex-1">
									<h4 className="mb-1 font-medium text-brand-navy">
										Why sign in?
									</h4>
									<p className="text-sm text-brand-navy/75">
										Connect with our community, share your thoughts, and stay updated with the latest discussions.
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					<div className="grid grid-cols-1 gap-3">
						<Button
							onClick={handleLogin}
							disabled={isLoading}
							className="h-auto w-full rounded-sm bg-brand-navy px-5 py-2.5 text-white hover:bg-brand-green"
						>
							<LogIn className="h-4 w-4 mr-2" />
							{isLoading ? "Redirecting..." : "Sign In"}
						</Button>
						
						<Button
							onClick={handleSignup}
							disabled={isLoading}
							variant="outline"
							className="h-auto w-full rounded-sm border-0 bg-white px-5 py-2.5 text-brand-navy ring-1 ring-brand-navy/15 hover:bg-brand-tint hover:text-brand-navy"
						>
							<UserPlus className="h-4 w-4 mr-2" />
							{isLoading ? "Redirecting..." : "Create Account"}
						</Button>
					</div>
				</div>

				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button
						variant="ghost"
						onClick={onClose}
						className="w-full rounded-sm text-brand-navy/60 hover:bg-brand-tint/50 hover:text-brand-navy sm:w-auto"
					>
						Maybe Later
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 