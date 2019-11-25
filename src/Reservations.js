import React, { useEffect } from 'react';
import { useAuth0 } from './Auth0Wrapper';
import useApiCall from './useApiCall';

function Reservations() {
    const { user } = useAuth0();
    const { response, error } = useApiCall({ url: '/reservations', method: 'GET' });

    return (
        <div>
            
        </div>
    )
}

export default Reservations;