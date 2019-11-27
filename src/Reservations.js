import React, { useEffect } from 'react';
import useApiCall from './useApiCall';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { DateTime } from 'luxon';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

function Reservations() {
    const { response, error } = useApiCall({ url: '/management/reservations', method: 'GET' });

    const mapReservations = model => {
        let { reservation, room } = model;
        return (
            <TableRow key={reservation.id}>
                <TableCell>{reservation.firstName}</TableCell>
                <TableCell>{reservation.lastName}</TableCell>
                <TableCell className='nowrap'>
                    Check In Date: {DateTime.fromISO(reservation.checkIn).toLocaleString(DateTime.DATETIME_SHORT)}
                    <br />
                    Check Out Date: {DateTime.fromISO(reservation.checkOut).toLocaleString(DateTime.DATETIME_SHORT)}
                </TableCell>
                <TableCell className='nowrap'>
                    Type: {room.type}
                    <br />
                    Beds: {room.beds}
                    <br />
                    Guests Allowed: {room.guestsAllowed}
                    <br />
                    Price: ${room.price}
                </TableCell>
                <TableCell className='nowrap'>
                    <div style={{ display: 'flex' }}>
                        <Button 
                            variant='contained' 
                            disabled={reservation.actualCheckIn} 
                            style={{ margin: 5 }} 
                            color='primary'
                        >
                            Check In
                        </Button>
                        <Button 
                            variant='contained' 
                            disabled={reservation.actualCheckOut} 
                            style={{ margin: 5 }} 
                            color='primary'
                        >
                            Check Out
                        </Button>
                    </div>
                </TableCell>
            </TableRow>
        )
    }

    useEffect(() => {
        console.log(response)
    }, [response])

    return (
        <div style={{ padding: 20 }}>
            {(!response || error) && <LinearProgress />}
            <Typography align='center' variant='h3'>Reservations</Typography>
            <Divider style={{ margin: 10 }} />
            {response && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Reservation Dates</TableCell>
                            <TableCell>Room Details</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {response.map(mapReservations)}
                    </TableBody>
                </Table>
            )}
        </div>
    )
}

export default Reservations;