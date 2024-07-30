import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { Table, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, TableContainer } from '@mui/material';
import client from '../../../../../API';

const ReferralDetailsView = () => {
    const [referralData, setReferralData] = useState([]);
    const [commissionData, setCommissionData] = useState([]);
    const [selectedReferrals, setSelectedReferrals] = useState({});
    const [selectedCommissions, setSelectedCommissions] = useState({});

    // Fetch referral and commission details
    const fetchDetails = useMutation(client.commissions.getAll, {
        onSuccess: (response) => {
            const { referrals, commissions } = response;
            console.log('Fetched details:', response);

            // Set referral data
            setReferralData(referrals);
            const referralSelection = referrals.reduce((acc, referral) => {
                acc[referral.id] = false;
                return acc;
            }, {});
            setSelectedReferrals(referralSelection);

            // Set commission data
            setCommissionData(commissions);
            const commissionSelection = commissions.reduce((acc, commission) => {
                acc[commission.id] = false;
                return acc;
            }, {});
            setSelectedCommissions(commissionSelection);
        },
        onError: (error) => {
            console.error('Failed to fetch details:', error);
        },
    });

    useEffect(() => {
        fetchDetails.mutate();
    }, []);

    const handleSelect = (id, type) => {
        if (type === 'referral') {
            const newSelectedReferrals = {
                ...selectedReferrals,
                [id]: !selectedReferrals[id]
            };
            setSelectedReferrals(newSelectedReferrals);
        } else {
            const newSelectedCommissions = {
                ...selectedCommissions,
                [id]: !selectedCommissions[id]
            };
            setSelectedCommissions(newSelectedCommissions);
        }
    };

    const handleSelectAll = (event, type) => {
        const isChecked = event.target.checked;
        if (type === 'referral') {
            const newSelectedReferrals = Object.keys(selectedReferrals).reduce((acc, key) => {
                acc[key] = isChecked;
                return acc;
            }, {});
            setSelectedReferrals(newSelectedReferrals);
        } else {
            const newSelectedCommissions = Object.keys(selectedCommissions).reduce((acc, key) => {
                acc[key] = isChecked;
                return acc;
            }, {});
            setSelectedCommissions(newSelectedCommissions);
        }
    };

    const renderTable = (data, selectedData, type) => {
        const allSelected = data.length > 0 && Object.values(selectedData).every(Boolean);
        const indeterminate = Object.values(selectedData).some(Boolean) && !allSelected;

        return (
            <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    onChange={(event) => handleSelectAll(event, type)}
                                    checked={allSelected}
                                    indeterminate={indeterminate}
                                />
                            </TableCell>
                            {data.length > 0 && Object.keys(data[0] || {}).map((key) => (
                                <TableCell key={key} style={{ color: "white" }}>{key.replace('_', ' ').toUpperCase()}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((item) => (
                            <TableRow key={item.id} selected={selectedData[item.id]}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedData[item.id]}
                                        onChange={() => handleSelect(item.id, type)}
                                    />
                                </TableCell>
                                {Object.values(item).map((value, index) => (
                                    <TableCell key={index}>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : JSON.stringify(value)}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <div>
            <h2>Referrals</h2>
            {renderTable(referralData, selectedReferrals, 'referral')}
            <h2>Commissions</h2>
            {renderTable(commissionData, selectedCommissions, 'commission')}
        </div>
    );
};

export default ReferralDetailsView;
