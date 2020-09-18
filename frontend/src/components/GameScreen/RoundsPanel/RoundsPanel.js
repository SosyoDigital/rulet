import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import socketIOClient from 'socket.io-client'
import axios from 'axios'
const ENDPOINT = 'http://35.240.197.189'
const socket = socketIOClient(ENDPOINT);

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const useStyles2 = makeStyles({
  table: {
    minWidth: 500
  },
});

const useStyles3 = makeStyles({
  blackbox: {
    height: 20,
    width: 20,
    border: '1px solid black',
    borderRadius: 7,
    backgroundColor: 'black',
    marginLeft: '50%'
  },
  redbox: {
    height: 20,
    width: 20,
    border: '1px solid red',
    borderRadius: 7,
    backgroundColor: 'red',
    marginLeft: '50%'
  },
  greenbox: {
    height: 20,
    width: 20,
    border: '1px solid green',
    backgroundColor: 'green',
    borderRadius: 7,
    alignSelf: 'right',
    marginLeft: '50%',
    marginTop: '5%'
  }
})

export default function RoundsPanel() {
  const classes = useStyles2();
  const boxes = useStyles3();
  const [rows, setRows] = useState(null)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  useEffect(() => {
    getRounds()
    async function getRounds(){
      const resp = await axios.get('http://35.240.197.189/allrounds')
      const sortedRounds = resp.data.allRounds.sort((a, b) => (a._roundId > b._roundId ? -1 : 1));
      setRows(sortedRounds)
    }
    socket.on('open-bets', data => {
      const sortedRounds = data.bets.sort((a, b) => (a._roundId > b._roundId ? -1 : 1));
      setRows(sortedRounds)
    })
  }, [])

  const emptyRows = rows ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) : null

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
    {rows ? 
      <Table className={classes.table} aria-label="custom pagination table">
      <TableHead>
          <TableRow  style={{background: '#A9A9A9'}}>
            <TableCell><span style={{fontWeight: 'bold'}}>Round Number</span></TableCell>
            <TableCell align="center"><span style={{fontWeight: 'bold'}}>Winning Number</span></TableCell>
            <TableCell align="right"><span style={{fontWeight: 'bold'}}>Winning Colour</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => (
            <TableRow key={row._roundId}>
              <TableCell component="th" scope="row">
                {row._roundId}
              </TableCell>
              <TableCell style={{ width: 160 }} align="center">
                {row._sysPick}
              </TableCell>
              <TableCell style={{ width: 160 }} align="right">
                {row._sysPick%2===0?<div className={boxes.blackbox}/>: <div className={boxes.redbox}/>} {row._isGreen?<div className={boxes.greenbox}/>:null}
              </TableCell>
            </TableRow>
          ))}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={rows.length}
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
      : <Table/>}
    </TableContainer>
  );
}