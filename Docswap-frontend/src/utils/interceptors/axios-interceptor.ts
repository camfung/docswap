import axios from 'axios';
import { getSession } from 'next-auth/react';


const setupInterceptors = async () => {
    axios.interceptors.request.use(
        async (config) => {
            const session = await getSession();
            if (session?.account.account.id_token) {
                config.headers['Authorization'] = `Bearer ${session?.account.account.id_token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

export { setupInterceptors };
