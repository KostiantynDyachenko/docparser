import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles(theme => ({
    selectedButton: {
        backgroundColor: 'blue',
    },
    container: {
        width: props => props.width,
        height: props => props.height
    },
    table: {
        minWidth: 650,
        width: "100%",
        height: "100%"
    },
    header: {
        "& .MuiTableCell-head": {
            backgroundColor: theme.palette.background.header,
            color: theme.palette.text.header
        }
    },
    body: {
        overflow: "scroll",
        "& .MuiTableCell-body": {
            backgroundColor: theme.palette.background.paper
        }
    },
    nCell: {
        width: "25%"
    },
    deCell: {
        width: "35%"
    },
    doCell: {
        width: "10%"
    }
}));

function PortfolioTable(props) {
    const { data } = props;
    const classes = useStyles(props);

    return (
        <>
            <TableContainer className={classes.container}>
                <Table className={classes.table}
                       aria-label="cases table"
                       stickyHeader
                >
                    <TableHead className={classes.header}>
                        <TableRow>
                            <TableCell className={classes.nCell}>
                                Name
                            </TableCell>
                            <TableCell className={classes.deCell}>
                                Description
                            </TableCell>
                            <TableCell>
                                Created By
                            </TableCell>
                            <TableCell>
                                Company
                            </TableCell>
                            <TableCell className={classes.doCell}>
                                Documents
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.body}>
                        {data.map((row, i) => (
                            <TableRow key={i} className={classes.selectedButton}>
                                <TableCell className={classes.nCell}>
                                    <Skeleton/>
                                </TableCell>
                                <TableCell className={classes.deCell}>
                                    <Skeleton/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton/>
                                </TableCell>
                                <TableCell>
                                    <Skeleton/>
                                </TableCell>
                                <TableCell className={classes.doCell}>
                                    <Skeleton/>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </>
    );
}

export default PortfolioTable;
