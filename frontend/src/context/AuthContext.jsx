import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {axiosInstance} from "../utils/axiosInstance.js"; 
import toast from "react-hot-toast";


export const AuthContext = createContext();
 
// export const useAuthContext = () => {
    //     const context = useContext(AuthContext);
    //     if (!context) {
        //         throw new Error('useAuthContext must be used within a AuthContextProvider');
        //     }
        //     return context;
        // };
        
export const AuthContextProvider = (props) => {
     
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();


    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Fetch user profile when token is available
    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false); 
        }
    }, [token]);

    const fetchUserProfile = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axiosInstance.get("/user/current-user");
            if (response.status < 401 && response.data.data) {
                setUser(response.data.data);
            } else {
                console.error("Unexpected response format:", response.data);
                setToken("");
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            if (error.response && error.response.status === 401) {
                setToken("");
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/user/login", credentials);
            const { user, accessToken } = response.data.data;
            setToken(accessToken);
            localStorage.setItem("token", accessToken);
            setUser(user);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return { error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axiosInstance.post("/user/logout");
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setToken("");
            localStorage.removeItem("token");
            setUser(null);
            setLoading(false);
            navigate("/");
        }
    };

    const register = async (userData) => {
        setLoading(true);
    try {
        const response = await axiosInstance.post("/user/register", userData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        const { user , accessToken } = response.data.data;
        setUser(user);
        setToken(accessToken);
        localStorage.setItem("token", accessToken);
        toast.success("Account created successfully");
        navigate("/");
        return { success: true };
    } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
        return { error: error.response?.data?.message };
    } finally {
        setLoading(false);
    }
};

    const value = {
        navigate,
        backendUrl,
        token,
        setToken,
        user,
        setUser,
        loading,
        login,
        logout,
        register,
        fetchUserProfile,
    };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthContextProvider;
