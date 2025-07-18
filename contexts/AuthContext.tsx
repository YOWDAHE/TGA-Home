"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@/app/types/auth";
import { getCurrentUser, signOut } from "@/app/actions/auth.actions";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (user: User) => void;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const { toast } = useToast();

	const login = (userData: User) => {
		setUser(userData);
	};

	const logout = async () => {
		try {
			await signOut();
		} catch (error) {
			console.error("Error during sign out:", error);
		} finally {
			setUser(null);
		}
	};

	const refreshUser = async () => {
		try {
			const userData = await getCurrentUser();
			setUser(userData);
		} catch (error) {
			console.error("Error refreshing user:", error);
			setUser(null);
		}
	};

	useEffect(() => {
		const initializeAuth = async () => {
			try {
				const userData = await getCurrentUser();
				setUser(userData);
			} catch (error) {
				console.error("Error initializing auth:", error);
				setUser(null);
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();
	}, []);

	const value: AuthContextType = {
		user,
		loading,
		login,
		logout,
		refreshUser,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 