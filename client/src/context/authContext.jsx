import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { userVerification } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {

        try {
            setLoading(true);
            const response = await userVerification();

            if (response?.user) {
                setUser(response.user);
                return response.user;
            }

            setUser(null);
            return null;
        }
        catch (error) {
            console.log("[*] Error in Auth Provider Context ", error);
            setUser(null);
            return null;
        }
        finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        refreshUser();
    }, []);

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                refreshUser,
                loading,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
