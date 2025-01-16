"use client";

import { createContext, ReactNode, useContext, useState, Dispatch, SetStateAction } from "react";

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
    isFather: boolean;
    isMother: boolean;
    profileName: string;
    image: string;
    family: string | null;
}

interface UserContextProps {
    userData: UserResponse | null;
    setUserData: Dispatch<SetStateAction<UserResponse | null>>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userData, setUserData] = useState<UserResponse | null>(null);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
