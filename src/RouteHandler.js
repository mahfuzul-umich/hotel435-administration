import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Reservations from './Reservations';

function RouteHandler() {
    return (
        <Switch>
            <Route path='/reservations' component={Reservations} />
        </Switch>
    )
}

export default RouteHandler;