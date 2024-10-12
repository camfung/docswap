'use client';

import React, { createContext, useContext, useCallback, useState, useEffect, ReactNode, FC } from 'react';
import axios from 'axios';

// Define user interfaces
export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    biography: string;
}

export interface UserData {
    FirstName: string;
    LastName: string;
    Biography: string;
}

interface UserContextType {
    user: User | null;
    fetchUser: () => Promise<void>;
    updateUserData: (userData: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/user/current`;
            const response = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const { FirstName, LastName, Email, Biography, ID } = response.data;
            setUser({ firstName: FirstName, lastName: LastName, email: Email, biography: Biography, id: ID });
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    const updateUserData = useCallback(async (userData: any) => {
        try {
            const userDataToSend: UserData = {
                FirstName: userData.firstName,
                LastName: userData.lastName,
                Biography: userData.biography
            };
            const url = `${process.env.NEXT_PUBLIC_DOCSWAP_API_BASE_URL}/user/current`;
            const response = await axios.put(url, userDataToSend, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                }
            });
            const updatedData = response.data;
            setUser((prevUser) => ({
                firstName: updatedData.FirstName,
                lastName: updatedData.LastName,
                email: prevUser?.email || '',
                biography: updatedData.Biography,
                id: prevUser?.id || 0
            }));
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    }, []);

    // Fetch user data initially
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, fetchUser, updateUserData }}>
            {children}
        </UserContext.Provider>
    );
};
