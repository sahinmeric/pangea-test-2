import { Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material'
import React, { memo } from 'react'
import profilePhoto from "../../../Components/globalAssets/ppfLogo.png"; // Placeholder for the profile photo
import { formatCampaignSum, formatProposalDate } from '../../../Utils/constants';

const CampaignCardList = memo(function CampaignCardList({ campaigns, handleOpenDialog, handleShareCampaign, handleCopyCampaign }) {
    return (
        <Grid container spacing={2}>
            {campaigns.map((campaign) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={campaign.id}>
                    <Card
                        onClick={() => handleOpenDialog(campaign)}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image={
                                campaign.creators.length > 0
                                    ? campaign.creators[0].pfphref
                                    : profilePhoto
                            }
                            alt={campaign.name}
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {campaign.name}
                            </Typography>
                            <Typography variant="body2">
                                Brief: {campaign.brief}
                            </Typography>
                            <Typography variant="body2">
                                Campaign Sum: {formatCampaignSum(campaign.campaign_sum)}
                            </Typography>
                            <Typography variant="body2">
                                Proposal Date: {formatProposalDate(campaign.proposal_date)}
                            </Typography>
                            <Typography variant="body2">
                                Product Type: {campaign.campaign_type}
                            </Typography>
                            <Typography variant="body2">
                                Status: {campaign.campaign_status}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleShareCampaign(campaign.id);
                                }}
                            >
                                Share
                            </Button>
                            <Button
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCopyCampaign(campaign.id);
                                }}
                            >
                                Copy
                            </Button>
                        </CardActions>
                    </Card>
                </Grid>
            ))}
        </Grid>
    )
});

export default CampaignCardList
