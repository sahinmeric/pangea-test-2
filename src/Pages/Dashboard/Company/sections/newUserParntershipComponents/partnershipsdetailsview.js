import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, TableContainer } from '@mui/material';
import client from '../../../../../API';

const PartnershipsDetailsView = ({ onSelectionChange }) => {
    const [partnershipData, setPartnershipData] = useState([]);
    const [selectedPartnerships, setSelectedPartnerships] = useState({});

    // Fetch partnership details
    const fetchPartnershipDetails = useMutation(client.partnerships.getAdminDetails, {
        onSuccess: (response) => {
            const data = response; // Adjust if necessary based on actual response structure
            console.log('Fetched partnership details:', data); // Debugging log
            setPartnershipData(data);
            const selection = data.reduce((acc, partnership) => {
                acc[partnership.id] = false;
                return acc;
            }, {});
            setSelectedPartnerships(selection);
            onSelectionChange(selection);
        },
        onError: (error) => {
            console.error('Failed to fetch partnership details:', error);
        },
    });

    useEffect(() => {
        fetchPartnershipDetails.mutate();
    }, []);

    const handleSelect = (id) => {
        const newSelectedPartnerships = {
            ...selectedPartnerships,
            [id]: !selectedPartnerships[id]
        };
        setSelectedPartnerships(newSelectedPartnerships);
        onSelectionChange(newSelectedPartnerships);
        console.log('Selected partnerships:', newSelectedPartnerships); // Debugging log
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        const newSelectedPartnerships = Object.keys(selectedPartnerships).reduce((acc, key) => {
            acc[key] = isChecked;
            return acc;
        }, {});
        setSelectedPartnerships(newSelectedPartnerships);
        onSelectionChange(newSelectedPartnerships);
        console.log('Select all partnerships:', newSelectedPartnerships); // Debugging log
    };

    const allSelected = partnershipData.length > 0 && Object.values(selectedPartnerships).every(Boolean);
    const indeterminate = Object.values(selectedPartnerships).some(Boolean) && !allSelected;

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell padding="checkbox">
                            <Checkbox
                                onChange={handleSelectAll}
                                checked={allSelected}
                                indeterminate={indeterminate}
                            />
                        </TableCell>
                        {partnershipData.length > 0 && Object.keys(partnershipData[0] || {}).map((key) => (
                            <TableCell key={key} style={{ color: "white" }}>{key.replace('_', ' ').toUpperCase()}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {partnershipData.map((partnership) => (
                        <TableRow key={partnership.id} selected={selectedPartnerships[partnership.id]}>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={selectedPartnerships[partnership.id]}
                                    onChange={() => handleSelect(partnership.id)}
                                />
                            </TableCell>
                            {Object.values(partnership).map((value, index) => (
                                <TableCell key={index}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : JSON.stringify(value)}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default PartnershipsDetailsView;
