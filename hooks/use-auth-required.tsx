"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AuthRequiredModal from "@/components/auth/AuthRequiredModal";

export const useAuthRequired = () => {
	const [showModal, setShowModal] = useState(false);
	const [pendingAction, setPendingAction] = useState<string>("comment");
	const { user } = useAuth();

	const requireAuth = (action: string = "comment", callback?: () => void) => {
		if (!user) {
			setPendingAction(action);
			setShowModal(true);
			return false;
		}
		
		// If user is authenticated, execute the callback
		if (callback) {
			callback();
		}
		return true;
	};

	const closeModal = () => {
		setShowModal(false);
	};

	const AuthModal = () => (
		<AuthRequiredModal
			isOpen={showModal}
			onClose={closeModal}
			action={pendingAction}
		/>
	);

	return {
		requireAuth,
		closeModal,
		AuthModal,
		isAuthenticated: !!user,
	};
}; 