import { useState, useEffect } from 'react';
import Axios from 'axios';
import { useAuth0 } from './Auth0Wrapper';

const useApiCall = (options) => {
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);
    const { getTokenSilently } = useAuth0();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await getTokenSilently();
                if (options.headers) 
                    options.headers["Authorization"] = `Bearer ${token}`;
                else
                    options.headers = { Authorization: `Bearer ${token}` };
                const res = await Axios(options);
                setResponse(res.data);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
        // eslint-disable-next-line
    }, []);

    return { response, error };
};

export default useApiCall;