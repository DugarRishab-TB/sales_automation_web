import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
	login as apiLogin,
	register as apiRegister,
	logout as apiLogout,
} from "../services/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		try {
			const raw = localStorage.getItem("auth:user");
			if (raw) setUser(JSON.parse(raw));
		} catch (e) {
			console.error(e);
		}
		setLoading(false);
	}, []);

	const login = async (values) => {
		const res = await apiLogin(values);
		const u = res?.data?.user || null;
		setUser(u);
		localStorage.setItem("auth:user", JSON.stringify(u));
		return u;
	};

	const register = async (values) => {
		const res = await apiRegister(values);
		const u = res?.data?.user || null;
		setUser(u);
		localStorage.setItem("auth:user", JSON.stringify(u));
		return u;
	};

	const logout = async () => {
		try {
			await apiLogout();
		} catch (e) {
      if (e) {
        console.error(e);
			}
		}
		setUser(null);
		localStorage.removeItem("auth:user");
	};

	const value = useMemo(
		() => ({
			user,
			isAuthenticated: !!user,
			loading,
			login,
			register,
			logout,
		}),
		[user, loading]
	);
	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
