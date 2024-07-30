import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Box, Toolbar, Typography, CircularProgress } from '@mui/material';
import API from '../../../API';
import BlitzHeader from '../../../Components/BlitzHeader';
import CreatorHeader from './components/CreatorHeader';
import AudienceDemographics from './components/AudienceDemographics';
import RatesAndCampaigns from './components/RatesAndCampaigns';
import Reviews from './components/Reviews';
import CRMDialog from '../../Misc/crmComponents/crmPopup';
import BookingDialog from '../../Misc/bookingdialog';
import LeaveReview from './leaveReview';
import { findMaxValue, getInfoFromCreator } from '../../../Utils';
import useAuth from '../../../Hooks/use-auth';
import styles from "./styles.module.css";

const CreatorDetailsPage = () => {
  const { creatorId, discount } = useParams();
  const { currentUser } = useAuth();
  const [showCRMDialog, setShowCRMDialog] = useState(true);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  const { data: response_data, error, isFetching, isError } = useQuery({
    queryKey: ['creatorDetails', creatorId],
    queryFn: () => API.creators.fetchDetails(creatorId),
    onError: (error) => console.error('Failed to fetch creator details:', error),
    refetchInterval: false,
    refetchOnWindowFocus: false
  });

  const creatorDetails = response_data?.creator || {};
  const campaigns = response_data?.campaigns || [];
  const reviews = response_data?.reviews || [];

  const { creatorInfo, followersData, promotionData } = useMemo(() => creatorDetails ? getInfoFromCreator(creatorDetails) : {}, [creatorDetails]);
  const maxValue = useMemo(() => promotionData ? findMaxValue(promotionData) : 0, [promotionData]);

  const discountPercentage = discount ? parseFloat(discount) : 0;
  const discountedPromotionData = promotionData ? promotionData.map(data => {
    data.highest.value -= (data.highest.value * discountPercentage / 100);
    data.lowest.value -= (data.lowest.value * discountPercentage / 100);
    return { ...data };
  }) : [];

  if (isFetching) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={80} />
      </Box>
    );
  }
  
  if (isError || !response_data) return 'No creator details found';

  const handleBookingSubmission = async (bookingDetails) => {
    try {
      const response = await fetch('https://blitz-backend-nine.vercel.app/api/projects/public/partnerships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${bookingDetails.partnershipName} - ${bookingDetails.selectedPromotion}`,
          creator: creatorDetails.creator,
          description: bookingDetails.details,
          email: bookingDetails.email,
          proposal_date: bookingDetails.selectedDate,
          total_sum: bookingDetails.rate,
          unique_code: `promo_${creatorDetails.creator}_${new Date().getTime()}`
        }),
      });
      const result = await response.json();
      console.log('Booking successful:', result);
      return true;
    } catch (error) {
      console.error('Error submitting booking:', error);
      return false;
    }
  };

  const handleCloseCRMDialog = () => setShowCRMDialog(false);

  return (
    <>
      <BlitzHeader />
      <Toolbar />
      {discount && (
        <Box className={styles.promotionalHeader} sx={{ textAlign: 'center' }}>
          <Typography variant='h4'>BOOK TODAY FOR {discount}% OFF!</Typography>
        </Box>
      )}
      <Box 
        className={styles.main} 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: { xs: '100%', sm: '80%', md: '60%' } 
        }}
      >
        <CreatorHeader creatorDetails={creatorDetails} setBookingDialogOpen={setBookingDialogOpen} creatorInfo={creatorInfo} />
        <AudienceDemographics creatorDetails={creatorDetails} followersData={followersData} />
        <RatesAndCampaigns promotionData={discountedPromotionData} maxValue={maxValue} campaigns={campaigns} />
        <Reviews reviews={reviews} setReviewDialogOpen={setReviewDialogOpen} />
        {showCRMDialog && (
          <CRMDialog
            isOpen={showCRMDialog}
            handleClose={handleCloseCRMDialog}
            origin={`${creatorDetails?.creator} - mediakit`}
          />
        )}
        <BookingDialog
          open={bookingDialogOpen}
          onClose={() => setBookingDialogOpen(false)}
          submitBooking={handleBookingSubmission}
          promotionData={discountedPromotionData}
        />
        <LeaveReview
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          creatorId={creatorId}
        />
      </Box>
    </>
  );
};

export default CreatorDetailsPage;
