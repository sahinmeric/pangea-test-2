import React, { useState, useEffect, useRef } from "react";
import {
    Button,
    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    InputAdornment,
    Paper,
    Typography,
    Box,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import client from "../../../API";
import AlertDialog from "../../../Components/AlertDialog";
import useAlertDialog from "../../../Components/useAlertDialog";

const EditCreator = () => {
    //const { creatorToken } = useCreatorAuth();
    const { dialogState, openDialog, closeDialog } = useAlertDialog();

    const [contactEmail, setContactEmail] = useState('');
    const [paymentEmail, setPaymentEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [creatorName, setCreatorName] = useState('');
    const [creatorRegion, setCreatorRegion] = useState('');
    const [platforms, setPlatforms] = useState({
        TikTok: false,
        Instagram: false,
        YouTube: false,
    });
    const [primaryMarket, setPrimaryMarket] = useState('');
    const [notesContentStyle, setNotesContentStyle] = useState('');

    const [race, setRace] = useState('');
    const [gender, setGender] = useState('');
    const [location, setLocation] = useState('');

    // Instagram
    const [instagramLink, setInstagramLink] = useState("");
    const [instagramBrandRate, setInstagramBrandRate] = useState('');
    const [instagramFollowerCount, setInstagramFollowerCount] = useState('');
    const [instagramSongRate, setInstagramSongRate] = useState('');
    const [instagramStoryRate, setInstagramStoryRate] = useState('');

    // TikTok
    const [tikTokLink, setTikTokLink] = useState("");
    const [tikTokFollowerCount, setTikTokFollowerCount] = useState('');
    const [tikTokBrandRate, setTikTokBrandRate] = useState('');
    const [tikTokSongRate, setTikTokSongRate] = useState('');

    // YouTube
    const [youtubeLink, setYoutubeLink] = useState("");
    const [youtube30sBrandRate, setYoutube30sBrandRate] = useState('');
    const [youtubeFollowerCount, setYoutubeFollowerCount] = useState('');
    const [youtube60sBrandRate, setYoutube60sBrandRate] = useState('');
    const [youtubeShortsBrandRate, setYoutubeShortsBrandRate] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Payment state
    const [validationError, setValidationError] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("PayPal");

    const [isStripeNew, setIsStripeNew] = useState(true)

    const [stripeUserId, setStripeUserId] = useState("");


    const userData = useRef(null);

    async function GetUserData() {
        try {
            setIsLoading(true);
            console.log("Getting user data");
            const response = await client.creatorConnect.getCreator();
            const user = response.user;
            userData.current = response.user;

            const creator = response.user.creator;
            console.log("Data", user);
            const creatorSplit = creator.geolocation_gender_ethnicity.split('/');
            //console.log("Data split: ", creatorSplit);
            const oldGeo = creatorSplit[0].trim();
            const oldGender = creatorSplit.length > 0 ? creatorSplit[1].trim() : "";
            const oldEthnic = creatorSplit.length > 1 ? creatorSplit[2].trim() : "";
            //console.log("Location ", oldGeo, "Gender ", oldGender, "Ethnicity ", oldEthnic);

            setContactEmail(creator.email);
            setPaymentEmail(user.email);
            setPhoneNumber(creator.phone_number);
            setCreatorName(creator.creator);
            setCreatorRegion(creator.region);
            setPlatforms({
                TikTok: creator.tiktok_link !== null,
                Instagram: creator.instagram_link !== null,
                YouTube: creator.youtube_link !== null,
            });
            setPrimaryMarket(creator.primary_market);
            setNotesContentStyle(
                creator.notes_content_style
            );

            setRace(oldEthnic);
            setGender(oldGender);
            setLocation(oldGeo);

            // Instagram
            setInstagramLink(creator.instagram_link ? creator.instagram_link.replace("https://www.instagram.com/", "") : "");
            setInstagramBrandRate(creator.ig_reels_brand ? creator.ig_reels_brand.replace("$", "") : "");
            setInstagramFollowerCount(creator.instagram);
            setInstagramSongRate(creator.ig_reels_sound ? creator.ig_reels_sound.replace("$", ""):"");
            setInstagramStoryRate(creator.ig_story ? creator.ig_story.replace("$", ""):"");

            // TikTok
            setTikTokLink(creator.tiktok_link ? creator.tiktok_link.replace("https://www.tiktok.com/@", "") : "");
            setTikTokFollowerCount(creator.tiktok);
            setTikTokBrandRate(creator.tiktok_brand ? creator.tiktok_brand.replace("$", ""):"");
            setTikTokSongRate(creator.tiktok_sound ? creator.tiktok_sound.replace("$", ""):"");

            // YouTube
            setYoutubeLink(creator.youtube_link ? creator.youtube_link.replace("https://www.youtube.com/", "") : "");
            setYoutube30sBrandRate(creator.rate_2530s ? creator.rate_2530s.replace("$", ""):"");
            setYoutubeFollowerCount(creator.youtube);
            setYoutube60sBrandRate(creator.integration_60s ? creator.integration_60s.replace("$", ""):"");
            setYoutubeShortsBrandRate(creator.shorts ? creator.shorts.replace("$", ""):"");

            setPaymentMethod(user.payout_preferred);
            //console.log(`Stripe: ${user.stripe_id}, is null? ${user.stripe_id === null}, count? ${user.stripe_id.length == 0}, is zero? ${user.stripe_id.length === 0}`)
            setIsStripeNew(user.stripe_id === null || user.stripe_id.length === 0);

            setIsLoading(false);

        } catch (error) {
            openDialog("Error", `Network error: ${(error.response && error.response.data.error) ? error.response.data.error : error.message}\n Try refreshing the page.`, closeDialog, closeDialog, "Ok", null);
            console.error('Network error:', error);
        }
    }

    useEffect(() => {
        GetUserData();
    }, []);
    

    const handlePaymentMethodChange = (event) => {
        const method = event.target.value;
        setPaymentMethod(method);
        sessionStorage.setItem("paymentMethod", method);
        sessionStorage.setItem("creatorName", creatorName);
        /*if (method === "Stripe") {
          
        }*/
    };

    const goToStripeId = () =>{
        const redirectUri = `https://blitzpay.pro/creatorconnect/start/stripe`;
        window.location.href = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_STRIPE_CLIENT_ID}&scope=read_write&redirect_uri=${encodeURIComponent(redirectUri)}`;
    }

    const handlePlatformChange = (event) => {
        setPlatforms({ ...platforms, [event.target.name]: event.target.checked });
    };

    const handleFollowerCountChange = (setter) => (e) => {
        const rawValue = e.target.value.replace(/[^0-9]/g, "");
        const formattedValue = formatNumber(rawValue);
        setter(formattedValue);
    };

    const formatNumber = (value) => {
        const number = parseInt(value, 10);
        return isNaN(number) ? "" : number.toLocaleString();
    };

    const formatRate = (value) => {
        const number = parseInt(value, 10);
        return isNaN(number) ? "" : `${number.toLocaleString()}`;
    };

    const handleSaveCreator = async () => {
        if (creatorName.includes(" ")) {
            setValidationError("Creator name cannot contain spaces.");
            return;
        }

        const formattedTikTokLink = tikTokLink ? `https://www.tiktok.com/@${tikTokLink}` : null;
        const formattedInstagramLink = instagramLink ? `https://www.instagram.com/${instagramLink}` : null;
        const formattedYouTubeLink = youtubeLink ? `https://www.youtube.com/${youtubeLink}` : null;

        const payload = {
            tiktok: tikTokFollowerCount || null,
            tiktok_link: formattedTikTokLink || null,
            instagram: instagramFollowerCount || null,
            instagram_link: formattedInstagramLink || null,
            youtube: youtubeFollowerCount || null,
            youtube_link: formattedYouTubeLink || null,
            geolocationgenderethnicity: `${location} / ${gender} / ${race}`,
            primary_market: primaryMarket,
            region: creatorRegion,
            notescontent_style: notesContentStyle || null,
            tiktok_sound: formatRate(tikTokSongRate),
            tiktok_brand: formatRate(tikTokBrandRate),
            ig_feed_post: formatRate(instagramBrandRate),
            ig_reels_sound: formatRate(instagramSongRate),
            ig_reels_brand: formatRate(instagramBrandRate),
            "60s Integration": formatRate(youtube60sBrandRate),
            "3045s Integration": formatRate(youtube30sBrandRate),
            shorts: formatRate(youtubeShortsBrandRate),
            contactEmail: contactEmail,
            paymentEmail: paymentEmail,
            phone_number: phoneNumber,
            payment_method: paymentMethod,
            stripe_id: stripeUserId,
        };

        try {
            await client.creatorConnect.editCreator(payload);
            if(paymentMethod === 'PayPal' || !isStripeNew)
                openDialog("Success", "Creator data edited succesfully", closeDialog, closeDialog, "Ok", null);
            else 
                openDialog("Success", "Creator data edited succesfully. You will now be redirected to Stripe to set up BlitzPay", goToStripeId, goToStripeId, "Ok", null);
            //alert('Creator data edited succesfully!');
        } catch (error) {
            openDialog("Error", `Network error: ${error.response.data && error.response.data.error ? error.response.data.error : error}`, closeDialog, closeDialog, "Ok", null);
            console.error('Network error:', error);
        }
    };

    const OnClickUpdateStripe = () => {
        openDialog("Change Payment Data", "This will redirect you without saving any changes. Click Update to be redirected to update your payment info, or Cancel to continue editing and save.", goToStripeId, closeDialog, "Update", "Cancel");
    }

    return (
        <>
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <AlertDialog alertState={dialogState}></AlertDialog>
            <Paper elevation={1} sx={{ paddingInline: "3rem", paddingBlockStart: "1rem", paddingBlockEnd: "3rem", marginBlockStart: "1.5rem", maxWidth:'50em', marginInline:"auto"  }}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSaveCreator();
                    }}
                >
                    <Typography variant="h5">Creator information</Typography>
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
                        disabled
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
                    <FormGroup row>
                        {Object.keys(platforms).map((platform) => (
                            <FormControlLabel
                                key={platform}
                                control={
                                    <Checkbox
                                        checked={platforms[platform]}
                                        onChange={handlePlatformChange}
                                        name={platform}
                                    />
                                }
                                label={platform}
                            />
                        ))}
                    </FormGroup>
                    {platforms.Instagram && (
                        <>
                            <TextField
                                margin="dense"
                                label="Instagram Username"
                                type="text"
                                fullWidth
                                value={instagramLink}
                                onChange={(e) => setInstagramLink(e.target.value)}
                                variant="outlined"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            instagram.com/
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="dense"
                                label="Instagram Follower Count"
                                type="text"
                                fullWidth
                                value={instagramFollowerCount}
                                onChange={handleFollowerCountChange(setInstagramFollowerCount)}
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="dense"
                                label="Instagram Brand Rate"
                                type="text"
                                fullWidth
                                value={instagramBrandRate}
                                onChange={(e) => setInstagramBrandRate(e.target.value)}
                                variant="outlined"
                            />
                            <TextField
                                margin="dense"
                                label="Instagram Song Rate"
                                type="text"
                                fullWidth
                                value={instagramSongRate}
                                onChange={(e) => setInstagramSongRate(e.target.value)}
                                variant="outlined"
                            />
                            <TextField
                                margin="dense"
                                label="Instagram Story Rate"
                                type="text"
                                fullWidth
                                value={instagramStoryRate}
                                onChange={(e) => setInstagramStoryRate(e.target.value)}
                                variant="outlined"
                            />
                        </>
                    )}
                    {platforms.TikTok && (
                        <>
                            <TextField
                                margin="dense"
                                label="TikTok Username"
                                type="text"
                                fullWidth
                                value={tikTokLink}
                                onChange={(e) => setTikTokLink(e.target.value)}
                                variant="outlined"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            tiktok.com/@
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="dense"
                                label="TikTok Follower Count"
                                type="text"
                                fullWidth
                                value={tikTokFollowerCount}
                                onChange={handleFollowerCountChange(setTikTokFollowerCount)}
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="dense"
                                label="TikTok Brand Rate"
                                type="text"
                                fullWidth
                                value={tikTokBrandRate}
                                onChange={(e) => setTikTokBrandRate(e.target.value)}
                                variant="outlined"
                            />
                            <TextField
                                margin="dense"
                                label="TikTok Song Rate"
                                type="text"
                                fullWidth
                                value={tikTokSongRate}
                                onChange={(e) => setTikTokSongRate(e.target.value)}
                                variant="outlined"
                            />
                        </>
                    )}
                    {platforms.YouTube && (
                        <>
                            <TextField
                                margin="dense"
                                label="Youtube Username"
                                type="text"
                                fullWidth
                                value={youtubeLink}
                                onChange={(e) => setYoutubeLink(e.target.value)}
                                variant="outlined"
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            youtube.com/
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                margin="dense"
                                label="YouTube Follower Count"
                                type="text"
                                fullWidth
                                value={youtubeFollowerCount}
                                onChange={handleFollowerCountChange(setYoutubeFollowerCount)}
                                variant="outlined"
                                required
                            />
                            <TextField
                                margin="dense"
                                label="YouTube Brand Rate - 30s"
                                type="text"
                                fullWidth
                                value={youtube30sBrandRate}
                                onChange={(e) => setYoutube30sBrandRate(e.target.value)}
                                variant="outlined"
                            />
                            <TextField
                                margin="dense"
                                label="YouTube Brand Rate - 60s"
                                type="text"
                                fullWidth
                                value={youtube60sBrandRate}
                                onChange={(e) => setYoutube60sBrandRate(e.target.value)}
                                variant="outlined"
                            />
                            <TextField
                                margin="dense"
                                label="YouTube Shorts Rate"
                                type="text"
                                fullWidth
                                value={youtubeShortsBrandRate}
                                onChange={(e) => setYoutubeShortsBrandRate(e.target.value)}
                                variant="outlined"
                            />
                        </>
                    )}

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
                        rows={4}
                        placeholder="tell us about yourself"
                        variant="outlined"
                        value={notesContentStyle}
                        onChange={(e) => setNotesContentStyle(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Contact Email"
                        type="email"
                        fullWidth
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        variant="outlined"
                        required
                    />
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
                    <Typography variant="h5">Creator connect data</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '1rem', alignItems:"end"}}>
                        <FormControl fullWidth sx={{flex:1}}>
                            <InputLabel>Payment Method</InputLabel>
                            <Select value={paymentMethod} onChange={handlePaymentMethodChange}>
                                <MenuItem value="PayPal">PayPal, Standard, Fees Apply</MenuItem>
                                <MenuItem value="Stripe">BlitzPay, Faster, Less Fees</MenuItem>
                            </Select>
                        </FormControl>
                        {paymentMethod === "PayPal" && <TextField
                            margin="dense"
                            label="Paypal Payment Email"
                            type="email"
                            fullWidth
                            sx={{flex:1}}
                            value={paymentEmail}
                            onChange={(e) => setPaymentEmail(e.target.value)}
                            variant="outlined"
                            required
                        />}
                        {paymentMethod === "Stripe" && <Button
                            variant="contained"
                            color="secondary"
                            sx={{flex:1}}
                            onClick={OnClickUpdateStripe}
                        >
                            {isStripeNew ? "Add Payment Information" : "Update Payment Information"}
                        </Button>}
                    </Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: "5px", marginBottom: "10px" }}
                    >
                        Save Changes
                    </Button>
                </form>
            </Paper>
        </>
    );
};

export default EditCreator;
