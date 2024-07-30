import React, { useState } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';

const OnboardPage1 = ({ minWidth, onFormSubmit }) => {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [creatorName, setCreatorName] = useState("");
    const [creatorRegion, setCreatorRegion] = useState("");
    const [primaryMarket, setPrimaryMarket] = useState("");
    const [notesContentStyle, setNotesContentStyle] = useState("Tell us about yourself");
    const [race, setRace] = useState("");
    const [gender, setGender] = useState("");
    const [location, setLocation] = useState("");
    const [pfphref, setPfphref] = useState("");

    const [validationError, setValidationError] = useState("");


    const SubmitForm = (event) => {
        console.log(event);
        event.preventDefault();

        if (creatorName.includes(" ")) {
            setValidationError("Creator name cannot contain spaces.");
            return;
        }

        const payload = {
            creator: creatorName || null,
            geolocationgenderethnicity: `${location} / ${gender} / ${race}`,
            primary_market: primaryMarket,
            region: creatorRegion,
            notescontent_style: notesContentStyle || null,
            phone_number: phoneNumber,
            pfphref: pfphref || null,
        };

        onFormSubmit(payload);
    }

    return (
        <>
            <form id="page-1" onSubmit={SubmitForm}>
                <Box sx={{ flexDirection: 'column', display: 'flex', minWidth }}>
                    <TextField
                        margin="dense"
                        label="Creator Name"
                        type="text"
                        fullWidth
                        value={creatorName}
                        onChange={(e) => setCreatorName(e.target.value)}
                        variant="outlined"
                        required
                        error={!!validationError}
                        helperText={validationError}
                    />
                    <FormControl variant="outlined" fullWidth margin="dense" required>
                        <InputLabel>Creator Region</InputLabel>
                        <Select
                            label="Creator Region"
                            value={creatorRegion}
                            onChange={(e) => setCreatorRegion(e.target.value)}
                        >
                            <MenuItem value="NACAUKAUS">USA, Canada, UK, Australia</MenuItem>
                            <MenuItem value="Europe">Europe</MenuItem>
                            <MenuItem value="Asia">Asia</MenuItem>
                            <MenuItem value="LATAM">LATAM</MenuItem>
                            <MenuItem value="Africa">Africa</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" fullWidth margin="dense">
                        <InputLabel id="race-select-label">Race (optional)</InputLabel>
                        <Select
                            labelId="race-select-label"
                            value={race}
                            onChange={(e) => setRace(e.target.value)}
                            label="Race (optional)"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Asian">Asian</MenuItem>
                            <MenuItem value="Black">Black</MenuItem>
                            <MenuItem value="Hispanic">Hispanic</MenuItem>
                            <MenuItem value="White">White</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl variant="outlined" fullWidth margin="dense" required>
                        <InputLabel id="gender-select-label">Gender</InputLabel>
                        <Select
                            labelId="gender-select-label"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            label="Gender"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="Male">Male</MenuItem>
                            <MenuItem value="Female">Female</MenuItem>
                            <MenuItem value="Non-binary">Non-binary</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Location"
                        type="text"
                        fullWidth
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        variant="outlined"
                        required
                    />
                    <FormControl variant="outlined" fullWidth margin="dense" required>
                        <InputLabel id="primary-market-label">Primary Market</InputLabel>
                        <Select
                            labelId="primary-market-label"
                            value={primaryMarket}
                            onChange={(e) => setPrimaryMarket(e.target.value)}
                            label="Primary Market"
                        >
                            {[
                                "Activist",
                                "Artist",
                                "Beauty",
                                "Cars",
                                "Cosplay",
                                "Comedy",
                                "Country",
                                "Dance",
                                "Educational",
                                "Fashion",
                                "Fitness",
                                "Food",
                                "Gaming",
                                "Lifestyle",
                                "Music",
                                "Pets",
                                "Reviews",
                                "Sports",
                                "Tech",
                                "Thirst Trap",
                                "Travel",
                            ].map((market) => (
                                <MenuItem key={market} value={market}>
                                    {market}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        label="Bio"
                        type="text"
                        fullWidth
                        multiline
                        minRows={4}
                        placeholder="tell us about yourself"
                        variant="outlined"
                        value={notesContentStyle}
                        onChange={(e) => setNotesContentStyle(e.target.value)}
                    />
                    {/*<TextField
                        margin="dense"
                        label="Contact Email"
                        type="email"
                        fullWidth
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        variant="outlined"
                        required
                    />*/}
                    <TextField
                        margin="dense"
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        variant="outlined"
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Profile Photo URL"
                        type="text"
                        fullWidth
                        value={pfphref}
                        onChange={(e) => setPfphref(e.target.value)}
                        variant="outlined"
                        placeholder="Enter URL for profile photo"
                    />
                </Box>
            </form>
        </>)
}

export default OnboardPage1;