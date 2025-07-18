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
			<DialogContent className="sm:max-w-md">
				<DialogHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
						<Lock className="h-8 w-8 text-teal-600" />
					</div>
					<DialogTitle className="text-xl font-semibold text-gray-900">
						Authentication Required
					</DialogTitle>
					<DialogDescription className="text-gray-600">
						You need to be signed in to {action}. Join our community to engage with others!
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<Card className="border-teal-100 bg-teal-50/50">
						<CardContent className="p-4">
							<div className="flex items-start space-x-3">
								<MessageCircle className="h-5 w-5 text-teal-600 mt-0.5" />
								<div className="flex-1">
									<h4 className="font-medium text-gray-900 mb-1">
										Why sign in?
									</h4>
									<p className="text-sm text-gray-600">
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
							className="w-full bg-teal-600 hover:bg-teal-700 text-white"
						>
							<LogIn className="h-4 w-4 mr-2" />
							{isLoading ? "Redirecting..." : "Sign In"}
						</Button>
						
						<Button
							onClick={handleSignup}
							disabled={isLoading}
							variant="outline"
							className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
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
						className="w-full sm:w-auto text-gray-500 hover:text-gray-700"
					>
						Maybe Later
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
} 