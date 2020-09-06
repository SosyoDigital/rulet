import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default function RoundsPanel() {
    let allRounds = [{roundId:1, number: 6, color: 'Red'},{roundId:1, number: 6, color: 'Red'},{roundId:1, number: 6, color: 'Red'},{roundId:1, number: 6, color: 'Red'}]
    return (
        <TableContainer component={Paper} style={{marginBottom: '5%'}}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Round ID</TableCell>
                <TableCell align="right">Number</TableCell>
                <TableCell align="right">Color</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {allRounds.map((round) => (
                <TableRow key={round.roundId}>
                <TableCell component="th" scope="row">{round.roundId}</TableCell>
                <TableCell align="right">{round.number}</TableCell>
                <TableCell align="right">{round.color}</TableCell>
              </TableRow>
            ))}
            </TableBody>
          </Table>
        </TableContainer>
      );
}