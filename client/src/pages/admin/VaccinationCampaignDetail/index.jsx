import React, { useState, useEffect } from 'react';
import { Container } from '@mui/material';
import { useParams, useNavigate, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import vaccinationCampaignApi from '../../../api/vaccinationCampaignApi';

// Components
import DetailHeader from './components/DetailHeader';
import DetailView from './components/DetailView';
import { LoadingState, ErrorState, NotFoundState } from './components/StateComponents';

const VaccinationCampaignDetail = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kiểm tra xem có dữ liệu được truyền qua state không
    const campaignDataFromState = location.state?.campaignData;
    const isUpdated = location.state?.updated;

    if (campaignDataFromState) {
      console.log('Using campaign data from navigation state:', campaignDataFromState);
      setCampaign(campaignDataFromState);
      setLoading(false);

      // Hiển thị thông báo nếu dữ liệu vừa được cập nhật
      if (isUpdated) {
        toast.success('Dữ liệu chiến dịch tiêm chủng đã được cập nhật');
      }
    } else {
      console.log('No campaign data in state, loading from API');
      loadCampaignDetail();
    }
  }, [campaignId, location.state]);

  const loadCampaignDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading campaign detail for campaignId:', campaignId);

      const response = await vaccinationCampaignApi.getCampaignById(campaignId);
      console.log('Campaign detail response:', response);

      if (response.isSuccess && response.data) {
        setCampaign(response.data);
      } else {
        setError('Không tìm thấy chiến dịch tiêm chủng');
      }
    } catch (error) {
      console.error('Error loading campaign detail:', error);
      setError('Lỗi khi tải thông tin chiến dịch tiêm chủng');
    } finally {
      setLoading(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate('/admin/vaccination-campaigns');
  };

  // Handle edit
  const handleEdit = () => {
    navigate(`/admin/vaccination-campaigns/edit/${campaignId}`, {
      state: { campaignData: campaign }
    });
  };

  // Handle delete
  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chiến dịch này?')) {
      try {
        // Since we don't have delete API yet, simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Xóa chiến dịch thành công');
        navigate('/admin/vaccination-campaigns');
      } catch (error) {
        toast.error('Có lỗi xảy ra khi xóa chiến dịch');
      }
    }
  };

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (error) {
    return <ErrorState error={error} onBack={handleBack} />;
  }

  // Render not found state
  if (!campaign) {
    return <NotFoundState onBack={handleBack} />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <DetailHeader
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        campaignId={campaignId}
        campaign={campaign}
      />
      <DetailView campaign={campaign} />
    </Container>
  );
};

export default VaccinationCampaignDetail;
