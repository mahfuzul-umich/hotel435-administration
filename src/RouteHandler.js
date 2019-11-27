import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Reservations from './Reservations';
import Rooms from './Rooms';

function RouteHandler() {
    return (
        <Switch>
            <Route exact path='/' render={() => <Redirect to='/reservations' />} />
            <Route path='/reservations' component={Reservations} />
            <Route path='/rooms' component={Rooms} />
        </Switch>
    )
}

export default RouteHandler;