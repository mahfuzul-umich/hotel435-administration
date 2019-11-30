import React, { useState, useEffect } from 'react';
import { AxiosCall } from './AxiosCall';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { DateTime } from 'luxon';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAuth0 } from './Auth0Wrapper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeft from 'mdi-material-ui/ChevronLeft';
import ChevronRight from 'mdi-material-ui/ChevronRight';
import PageFirst from 'mdi-material-ui/PageFirst';
import PageLast from 'mdi-material-ui/PageLast';
import ButtonGroup from '@material-ui/core/ButtonGroup';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <PageLast /> : <PageFirst />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <ChevronRight /> : <ChevronLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <ChevronLeft /> : <ChevronRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <PageFirst /> : <PageLast />}
      </IconButton>
    </div>
  );
}


function Reservations() {
  const [reservations, setReservations] = useState(null);
  const { getTokenSilently } = useAuth0();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const setActualCheckIn = model => async e => {
    try {
      setLoading(true);
      let checkInApiCall = await AxiosCall({ url: `${process.env.REACT_APP_AUDIENCE}/management/checkin/${model.reservation.id}`, method: 'POST' }, getTokenSilently);
      let modelIndex = reservations.indexOf(model);
      let arr = [...reservations];
      let obj = { ...reservations[modelIndex] };
      obj.reservation = checkInApiCall.data;
      arr[modelIndex] = obj;
      setReservations(arr);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert('An error has occurred.')
    }
  }

  const setActualCheckOut = model => async e => {
    try {
      setLoading(true);
      let checkOutApiCall = await AxiosCall({ url: `${process.env.REACT_APP_AUDIENCE}/management/checkout/${model.reservation.id}`, method: 'POST' }, getTokenSilently);
      let modelIndex = reservations.indexOf(model);
      let arr = [...reservations];
      let obj = { ...reservations[modelIndex] };
      obj.reservation = checkOutApiCall.data;
      arr[modelIndex] = obj;
      setReservations(arr);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert('An error has occurred.')
    }
  }

  const mapReservations = model => {
    let { reservation, room } = model;
    return (
      <TableRow key={reservation.id}>
        <TableCell>{reservation.firstName}</TableCell>
        <TableCell>{reservation.lastName}</TableCell>
        <TableCell className='nowrap'>
          Check In Date: {DateTime.fromISO(reservation.checkIn, { zone: 'utc' }).toLocal().toLocaleString(DateTime.DATETIME_SHORT)}
          <br />
          Check Out Date: {DateTime.fromISO(reservation.checkOut, { zone: 'utc' }).toLocal().toLocaleString(DateTime.DATETIME_SHORT)}
          {(reservation.actualCheckIn || reservation.actualCheckOut) && <Divider style={{ margin: 10 }} />}
          {reservation.actualCheckIn && (
            <React.Fragment>
              Actual Check In Date: {DateTime.fromISO(reservation.actualCheckIn, { zone: 'utc' }).toLocal().toLocaleString(DateTime.DATETIME_SHORT)}
              <br />
            </React.Fragment>
          )}
          {reservation.actualCheckOut && (
            <React.Fragment>
              Actual Check Out Date: {DateTime.fromISO(reservation.actualCheckOut, { zone: 'utc' }).toLocal().toLocaleString(DateTime.DATETIME_SHORT)}
            </React.Fragment>
          )}
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
          <ButtonGroup>
            <Button
              disabled={reservation.actualCheckIn != null}
              onClick={setActualCheckIn(model)}
            >
              Check In
            </Button>
            <Button
              disabled={reservation.actualCheckOut != null}
              onClick={setActualCheckOut(model)}
            >
              Check Out
            </Button>
          </ButtonGroup>
        </TableCell>
      </TableRow>
    )
  }

  useEffect(() => {
    async function getReservations() {
      try {
        let reservations = await AxiosCall({ url: `https://hotel435.azurewebsites.net/management/reservations`, method: 'GET' }, getTokenSilently);
        setReservations(reservations.data);
      } catch (error) {
        setReservations({ error });
      }
    }
    getReservations();
    // eslint-disable-next-line
  }, [])

  return (
    <div style={{ padding: 20 }}>
      {(!reservations || loading) && <LinearProgress />}
      <Typography align='center' variant='h3'>Reservations</Typography>
      <Divider style={{ margin: 10 }} />
      {reservations && !reservations.error && (
        <div style={{ overflow: 'auto' }}>
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
              {(rowsPerPage > 0
                ? reservations.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : reservations).map(mapReservations)}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                  colSpan={5}
                  count={reservations.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { 'aria-label': 'rows per page' },
                    native: true,
                  }}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      )}
    </div>
  )
}

export default Reservations;