import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import client from '../../../../../API';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer } from '@mui/material';

const FinancialsKPI = () => {
    const [invoiceData, setInvoiceData] = useState({});
    const { mutate: fetchInvoices } = useMutation(client.invoices.listKPI, {
        onSuccess: (data) => {
            setInvoiceData(data);
        },
        onError: (error) => {
            console.error("Error fetching invoices:", error);
        },
    });

    useEffect(() => {
        fetchInvoices();
    }, []);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ color: "white" }}>Week Starting</TableCell>
                        <TableCell style={{ color: "white" }}>Paid</TableCell>
                        <TableCell style={{ color: "white" }}>Sent</TableCell>
                        <TableCell style={{ color: "white" }}>Pending</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.entries(invoiceData).map(([weekRange, details]) => (
                        <TableRow key={weekRange}>
                            <TableCell>{weekRange}</TableCell>
                            <TableCell>{details.Paid}</TableCell>
                            <TableCell>{details.Sent}</TableCell>
                            <TableCell>{details.Pending}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default FinancialsKPI;
