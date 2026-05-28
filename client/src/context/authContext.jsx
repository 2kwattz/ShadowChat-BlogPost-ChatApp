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

    useEffect(() => {

        const verifyUser = async () => {

            try {

                const response = await userVerification();

                setUser(response);

            } catch(error) {

                setUser(null);
            }

            setLoading(false);
        };

        verifyUser();

    }, []);

    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                isAuthenticated: !!user
            }}
        >

            {children}

        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);