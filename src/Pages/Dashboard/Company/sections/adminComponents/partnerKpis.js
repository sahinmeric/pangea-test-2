import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import client from '../../../../../API';
import { Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, Button } from '@mui/material';

const PartnerKpis = () => {
    const [partnerData, setPartnerData] = useState({});

    const { mutate: fetchData } = useMutation(client.creators.listKPI, {
        onSuccess: (data) => {
            console.log("Fetched partners:", data);
            setPartnerData(data);
        },
        onError: (error) => {
            console.error('Failed to fetch data:', error);
        },
    });

    useEffect(() => {
        fetchData();
    }, []);

    const sortedData = Object.entries(partnerData || {}).sort((a, b) => new Date(b[0]) - new Date(a[0]));

    const handleExport = async (row) => {
        try {
            const response = await fetch('http://blitz-backend-nine.vercel.app/export-to-sheets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(row),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Data exported successfully');
            } else {
                alert(`Failed to export data: ${result.message}`);
            }
        } catch (error) {
            console.error('Failed to export data:', error);
            alert('Failed to export data');
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell style={{ color: "white" }}>Week Starting</TableCell>
                        <TableCell style={{ color: "white" }}>Creators</TableCell>
                        <TableCell style={{ color: "white" }}>Emails</TableCell>
                        <TableCell style={{ color: "white" }}>Total Partners Added</TableCell>
                        <TableCell style={{ color: "white" }}>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map(([date, details]) => (
                        <TableRow key={date}>
                            <TableCell>{date}</TableCell>
                            <TableCell>
                                {details.creators ? details.creators.map((creator, index) => (
                                    <React.Fragment key={index}>
                                        <a href={`https://blitzpay.pro/creators/${creator}`} target="_blank" rel="noopener noreferrer">{creator}</a>
                                        {index < details.creators.length - 1 && ', '}
                                    </React.Fragment>
                                )) : ''}
                            </TableCell>
                            <TableCell>{details.emails ? details.emails.join(', ') : ''}</TableCell>
                            <TableCell>{details.total_partner}</TableCell>
                            <TableCell>
                                <Button variant="contained" color="primary" onClick={() => handleExport({ date, ...details })}>
                                    Export to Sheets
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PartnerKpis;
