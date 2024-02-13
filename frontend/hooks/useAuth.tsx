import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface AuthContextType {
    user: Employee | null;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<Employee | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<Employee | null>(null);
    const router = useRouter();
    const pathName = usePathname();

    useEffect(() => {
        // Check session using cookies on initial load
        axios
            .get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`)
            .then((response) => {
                console.log("response", response.data);
                if (response.data) {
                    setUser(response.data);
                }
            })
            .catch((err: any) => {
                console.log(err);
                if (pathName !== "/auth") {
                    router.push("/auth");
                }
                setUser(null);
            }); // Get the user cookie
    }, [pathName, router]);

    useEffect(() => {
        console.log("user", user);
    }, [user]);

    const logout = async () => {
        // Implement logout
        try {
            setUser(null);
            await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`
            );
            router.push("/auth"); // Redirect to your login page
        } catch (err: any) {
            console.log(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
