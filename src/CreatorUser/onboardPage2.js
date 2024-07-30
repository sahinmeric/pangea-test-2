import React, { useState } from 'react';
import {
    Box,

    TextField,
    Checkbox,
    FormControlLabel,
    FormGroup,
    InputAdornment,
    Divider,
} from '@mui/material';

const OnboardPage2 = ({ minWidth, onFormSubmit }) => {

    const [platforms, setPlatforms] = useState({
        TikTok: false,
        Instagram: false,
        YouTube: false,
    });

    // Instagram
    const [instagramLink, setInstagramLink] = useState("");
    const [instagramBrandRate, setInstagramBrandRate] = useState("");
    const [instagramFollowerCount, setInstagramFollowerCount] = useState("");
    const [instagramSongRate, setInstagramSongRate] = useState("");

    // TikTok
    const [tikTokLink, setTikTokLink] = useState("");
    const [tikTokFollowerCount, setTikTokFollowerCount] = useState("");
    const [tikTokBrandRate, setTikTokBrandRate] = useState("");
    const [tikTokSongRate, setTikTokSongRate] = useState("");

    // YouTube
    const [youtubeLink, setYoutubeLink] = useState("");
    const [youtube30sBrandRate, setYoutube30sBrandRate] = useState("");
    const [youtubeFollowerCount, setYoutubeFollowerCount] = useState("");
    const [youtube60sBrandRate, setYoutube60sBrandRate] = useState("");
    const [youtubeShortsBrandRate, setYoutubeShortsBrandRate] = useState("");


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


    const SubmitForm = (event) => {
        event.preventDefault();

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
            tiktok_sound: formatRate(tikTokSongRate),
            tiktok_brand: formatRate(tikTokBrandRate),
            ig_feed_post: formatRate(instagramBrandRate),
            ig_reels_sound: formatRate(instagramSongRate),
            ig_reels_brand: formatRate(instagramBrandRate),
            "60s Integration": formatRate(youtube60sBrandRate),
            "3045s Integration": formatRate(youtube30sBrandRate),
            shorts: formatRate(youtubeShortsBrandRate),
        };

        onFormSubmit(payload);
    }

    return (
        <>
            <form id="page-1" onSubmit={SubmitForm}>
                <Box sx={{ flexDirection: 'column', display: 'flex', minWidth }}>
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
                    {(platforms.Instagram || platforms.TikTok || platforms.YouTube )&&<Divider sx={{marginBlockEnd:'1em'}}></Divider>}
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
                </Box>
            </form>
        </>)
}

export default OnboardPage2;