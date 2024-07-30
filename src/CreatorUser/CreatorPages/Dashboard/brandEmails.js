import React, { useState, useEffect, useRef } from "react";
import {
    Paper,
    Backdrop,
    CircularProgress,
    TableContainer,
    TableHead,
    TableCell,
    Table,
    Box,
    Typography,
    IconButton,
    TableBody,
    TableRow,
    Chip,
    Snackbar,
    Alert,
    Link,
    TableFooter,
    TablePagination
} from "@mui/material";
import { StyledTableRow } from "../../../Utils/styledcell";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { styled } from "@mui/material/styles";
import { useQuery } from "react-query";
import API from "../../../API";
import useIsDesktop from "../../../Hooks/useIsDesktop";

const styles = {
    singleLine: { wordBreak: 'keep-all', whiteSpace: 'nowrap'},
}

const HideMobileCell = styled(TableCell)(({ theme }) => ({
    display: 'none',
    [theme.breakpoints.up('md')]: {
        display: 'table-cell',
    },
}));

const rowsPerPage = 5;

const BrandEmails = () => {
    const [toastOpen, setToastOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowCount, setRowCount] = useState(0)
    const isDesktop = useIsDesktop();
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setToastOpen(false);
    };
    const { isError, data, error, isFetching, } = useQuery({ queryKey: ['creatorEmails', page], queryFn: () => API.creatorConnect.getEmails({page,rows:rowsPerPage}), refetchInterval: false, refetchOnMount: 'always', refetchOnWindowFocus: false })

    useEffect(() => {
        if (isError) {
            console.error('An error occurred:', error.message);
            setToastOpen(true);
        }
    }, [isError]);

    useEffect(() => {
        if (data) {
            setRowCount(data.total);
        }
    }, [data]);

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isFetching && !isError}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar
                open={toastOpen}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert severity='error' variant='filled' sx={{ width: '100%' }}><>{error ? ((error.response && error.response.data.error) ? error.response.data.error : error.message): ''}</></Alert>
            </Snackbar>
            <Box sx={{ marginBlockStart: "1.5rem", maxWidth: '80em', marginInline: "auto" }}>
                <TableContainer component={Paper} elevation={1}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ width: '15rem' }}>
                                    Sender
                                </TableCell>
                                <TableCell sx={{ width: '30rem' }}>
                                    Content
                                </TableCell>
                                <HideMobileCell align='right'>
                                    Date
                                </HideMobileCell>
                                <HideMobileCell align='right'>
                                    Category
                                </HideMobileCell>
                                <TableCell align='center'>
                                    Read
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data && data.emails.map((row, index) => (
                                <StyledTableRow key={index}>
                                    <TableCell sx={{ overflowX: 'hidden', width: '15rem', maxWidth: 0 }} align='left'>
                                        <span style={styles.singleLine}>{row.sender}</span>
                                    </TableCell>
                                    <TableCell sx={{ overflowX: 'hidden', width: '30rem', maxWidth: 0 }} align='left'>
                                        <span style={styles.singleLine}>{row.subject} - <Typography variant='caption' color='text.secondary'>{row.snippet}</Typography></span>
                                    </TableCell>
                                    <HideMobileCell align='right'>
                                        <span style={styles.singleLine}>{new Date(row.date_received).toLocaleString()}</span>
                                    </HideMobileCell>
                                    <HideMobileCell align='right'>
                                        <Chip label={row.category} color='primary'></Chip>
                                    </HideMobileCell>
                                    <TableCell align='center'>
                                        <Link href={`https://mail.google.com/mail/u/${row.receiver}/#all/${row.thread_id}`} target="_blank" underline="none">
                                            <IconButton>
                                                <OpenInNewIcon></OpenInNewIcon>
                                            </IconButton>
                                        </Link>
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination 
                                    colSpan={isDesktop ? 5 : 3}
                                    page={page}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[rowsPerPage]}
                                    count={rowCount}
                                    onPageChange={(event, newPage)=>setPage(newPage)}
                                >
                                </TablePagination>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default BrandEmails;
