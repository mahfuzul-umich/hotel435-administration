import Axios from 'axios';

async function AxiosCall(options, getTokenSilently) {
    try {
        const token = await getTokenSilently();
        if (options.headers) 
            options.headers["Authorization"] = `Bearer ${token}`;
        else
            options.headers = { Authorization: `Bearer ${token}` };
        return Axios(options);
    } catch (error) {
        return error;
    }
}

export { AxiosCall };