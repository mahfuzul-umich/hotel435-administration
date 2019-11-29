import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Reservations from './Reservations';

function RouteHandler() {
    return (
        <Switch>
            <Route exact path='/' render={() => <Redirect to='/reservations' />} />
            <Route path='/reservations' component={Reservations} />
        </Switch>
    )
}

export default RouteHandler;