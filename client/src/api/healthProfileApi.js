import callAPI from './axiosClient';

const healthProfileAPI = {
    // Tạo hồ sơ sức khỏe mới
    create: (profileData) => callAPI('POST', '/health-profiles/create', profileData),
    
    // Lấy hồ sơ sức khỏe của con em
    getByChildId: (childId) => {
        if (!childId) throw new Error('Child ID is required');
       return callAPI('GET', `/health-profiles/child/${childId}`)
     } ,

    // Lấy tất cả hồ sơ sức khỏe của parent
    getMyChildrenProfiles: (profileId) => callAPI('GET', `/health-profiles/get/${profileId}`),

    // Cập nhật hồ sơ sức khỏe
    update: (profileId, profileData) => callAPI('PUT', `/health-profiles/update/${profileId}`, profileData),
    
};

export default healthProfileAPI;