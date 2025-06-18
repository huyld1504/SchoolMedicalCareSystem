# Vaccination System - Keyword Search Optimization

## Tổng quan
Hệ thống tiêm chủng đã được tối ưu hóa để sử dụng field `keyword` cho việc search đồng thời nhiều fields, giúp tăng hiệu suất và trải nghiệm người dùng.

## Cách thức hoạt động

### 1. VaccinationCampaign Search
Khi search campaigns với keyword, hệ thống sẽ tìm kiếm trong các fields:

- **vaccineName** (weight: 10) - Tên vaccine
- **vaccineType** (weight: 5) - Loại vaccine  
- **targetAudience** (weight: 3) - Đối tượng tiêm
- **createdBy.name** (weight: 5) - Tên người tạo
- **createdBy.email** (weight: 5) - Email người tạo

### 2. VaccinationParticipation Search
Khi search participations với keyword, hệ thống sẽ tìm kiếm trong các fields:

- **campaignInfo.vaccineName** - Tên vaccine của campaign
- **campaignInfo.vaccineType** - Loại vaccine của campaign
- **campaignInfo.targetAudience** - Đối tượng tiêm của campaign
- **studentInfo.name** - Tên học sinh
- **studentInfo.studentCode** - Mã học sinh
- **parentNote** (weight: 5) - Ghi chú của phụ huynh
- **nurseNote** (weight: 8) - Ghi chú của y tá
- **nurseInfo.name** - Tên y tá
- **nurseInfo.email** - Email y tá
- **createdByInfo.name** - Tên người tạo
- **createdByInfo.email** - Email người tạo

## Tối ưu hóa Performance

### 1. Smart Query Strategy
```typescript
// Nếu có keyword -> sử dụng aggregation pipeline
if (queryBuilder.getKeyword()) {
  return this.searchWithKeyword(queryBuilder);
}

// Nếu không có keyword -> sử dụng simple filter (nhanh hơn)
return this.searchWithSimpleFilter(queryBuilder);
```

### 2. Database Indexes
```typescript
// Text search indexes với weights
schema.index({
  vaccineName: 'text',
  vaccineType: 'text', 
  targetAudience: 'text'
}, {
  weights: {
    vaccineName: 10,
    vaccineType: 5,
    targetAudience: 3
  }
});

// Compound indexes cho filtering
schema.index({ status: 1, startDate: -1 });
schema.index({ createdBy: 1, status: 1 });
```

### 3. Aggregation Pipeline Optimization
```typescript
const pipeline = [
  // Lookup related data first
  { $lookup: { /* user info */ } },
  
  // Apply filters early to reduce data size
  { $match: filter },
  
  // Add scoring for keyword relevance
  { $addFields: { totalScore: { /* scoring logic */ } } },
  
  // Filter by score > 0
  { $match: { $expr: { $gt: ['$totalScore', 0] } } },
  
  // Sort by relevance + user criteria
  { $sort: { totalScore: -1, ...userSort } }
];
```

## API Endpoints cho Keyword Search

### 1. 🔍 Campaign Search API

#### **GET** `/api/vaccination-campaigns/search`
**Mô tả**: Tìm kiếm các chiến dịch tiêm chủng với keyword và filters

**Authentication**: Required (Bearer Token)  
**Authorization**: Admin, Nurse

**Query Parameters**:
```typescript
{
  keyword?: string;           // 1-100 ký tự - Search trong vaccineName, vaccineType, targetAudience, creator info
  status?: string;            // 'planned' | 'ongoing' | 'completed' | 'cancelled'
  startDateFrom?: string;     // ISO date string - Từ ngày
  startDateTo?: string;       // ISO date string - Đến ngày
  page?: number;              // Default: 1
  paging?: number;            // Default: 10, Max: 100
  sort?: string;              // Format: "field:direction" (e.g., "startDate:desc")
  
  // Legacy support
  sortBy?: string;            // 'startDate' | 'createdAt' | 'status'
  sortOrder?: string;         // 'asc' | 'desc'
}
```

**Example Request**:
```http
GET /api/vaccination-campaigns/search?keyword=covid&status=planned&page=1&paging=10&sort=startDate:desc
Authorization: Bearer <token>
```

**Response**:
```json
{
  "httpStatusCode": 200,
  "message": "Vaccination campaigns searched successfully",
  "data": {
    "records": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "vaccineName": "COVID-19 Vaccine",
        "vaccineType": "mRNA Vaccine",
        "targetAudience": "Học sinh lớp 6-12",
        "startDate": "2025-07-01T00:00:00.000Z",        "status": "planned",
        "createdBy": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
          "name": "Admin User",
          "email": "admin@school.edu.vn"
          // password field đã được ẩn để bảo mật
        },
        "createdAt": "2025-06-18T10:00:00.000Z",
        "updatedAt": "2025-06-18T10:00:00.000Z"
      }
    ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

### 2. 🔍 Participation Search API (Admin/Nurse)

#### **GET** `/api/vaccination-participations/search`
**Mô tả**: Tìm kiếm danh sách tham gia tiêm chủng (toàn hệ thống)

**Authentication**: Required (Bearer Token)  
**Authorization**: Admin, Nurse

**Query Parameters**:
```typescript
{
  keyword?: string;              // Search trong campaign info, student info, notes, nurse info
  campaignId?: string;           // Filter theo campaign cụ thể
  studentId?: string;            // Filter theo học sinh cụ thể
  parentConsent?: string;        // 'pending' | 'approved' | 'denied'
  vaccinationStatus?: string;    // 'scheduled' | 'completed' | 'missed' | 'cancelled'
  consentDateFrom?: string;      // ISO date - Từ ngày đồng ý
  consentDateTo?: string;        // ISO date - Đến ngày đồng ý
  vaccinationDateFrom?: string;  // ISO date - Từ ngày tiêm
  vaccinationDateTo?: string;    // ISO date - Đến ngày tiêm
  page?: number;                 // Default: 1
  paging?: number;               // Default: 10, Max: 100
  sort?: string;                 // Format: "field:direction"
}
```

**Example Request**:
```http
GET /api/vaccination-participations/search?keyword=nguyenvana&parentConsent=pending&page=1&paging=10
Authorization: Bearer <token>
```

**Response**:
```json
{
  "httpStatusCode": 200,
  "message": "Vaccination participations searched successfully", 
  "data": {
    "records": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
        "campaign": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "vaccineName": "COVID-19 Vaccine",
          "vaccineType": "mRNA Vaccine",
          "startDate": "2025-07-01T00:00:00.000Z",
          "status": "planned"
        },
        "student": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b6",
          "name": "Nguyễn Văn A",
          "studentCode": "HS001"
        },
        "parentConsent": "pending",
        "parentConsentDate": null,
        "parentNote": "",
        "vaccinationStatus": "scheduled",
        "vaccinationDate": null,
        "vaccinatedNurse": null,
        "nurseNote": "",
        "createdBy": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
          "name": "Admin User",
          "email": "admin@school.edu.vn"
        },
        "createdAt": "2025-06-18T10:00:00.000Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 10,
    "totalPages": 2
  }
}
```

---

### 3. 🔍 Parent Participation Search API

#### **GET** `/api/vaccination-participations/search-parent`
**Mô tả**: Phụ huynh tìm kiếm danh sách tiêm chủng của con em mình

**Authentication**: Required (Bearer Token)  
**Authorization**: Parent

**Query Parameters**:
```typescript
{
  keyword?: string;              // Search trong campaign info, student info, notes
  parentConsent?: string;        // 'pending' | 'approved' | 'denied'
  vaccinationStatus?: string;    // 'scheduled' | 'completed' | 'missed' | 'cancelled'
  consentDateFrom?: string;      // ISO date
  consentDateTo?: string;        // ISO date
  vaccinationDateFrom?: string;  // ISO date
  vaccinationDateTo?: string;    // ISO date
  page?: number;                 // Default: 1
  paging?: number;               // Default: 10, Max: 100
  sort?: string;                 // Format: "field:direction"
}
```

**Example Request**:
```http
GET /api/vaccination-participations/search-parent?keyword=sốt&vaccinationStatus=completed&page=1&paging=5
Authorization: Bearer <parent_token>
```

**Response**:
```json
{
  "httpStatusCode": 200,
  "message": "Parent participations searched successfully",
  "data": {
    "records": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b7",
        "campaign": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
          "vaccineName": "Flu Vaccine 2025",
          "vaccineType": "Seasonal Influenza",
          "startDate": "2025-06-01T00:00:00.000Z",
          "status": "ongoing"
        },
        "student": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b8",
          "name": "Nguyễn Thị B",
          "studentCode": "HS002"
        },
        "parentConsent": "approved",
        "parentConsentDate": "2025-06-15T08:00:00.000Z",
        "parentNote": "Con có tiền sử sốt nhẹ sau tiêm",
        "vaccinationStatus": "completed",
        "vaccinationDate": "2025-06-16T09:30:00.000Z",
        "vaccinatedNurse": {
          "_id": "60f7b3b3b3b3b3b3b3b3b3b9",
          "name": "Y tá Mai",
          "email": "mai.nurse@school.edu.vn"
        },
        "nurseNote": "Tiêm thành công, không có phản ứng phụ",
        "createdAt": "2025-06-10T14:00:00.000Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 5,
    "totalPages": 1
  }
}
```

---

## API Usage Examples

### 1. **Tìm kiếm campaign theo tên vaccine**
```bash
curl -X GET "http://localhost:3000/api/vaccination-campaigns/search?keyword=covid" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 2. **Tìm kiếm participation theo tên học sinh**
```bash
curl -X GET "http://localhost:3000/api/vaccination-participations/search?keyword=nguyenvana&parentConsent=pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. **Phụ huynh tìm kiếm theo ghi chú**
```bash
curl -X GET "http://localhost:3000/api/vaccination-participations/search-parent?keyword=sốt&vaccinationStatus=completed" \
  -H "Authorization: Bearer YOUR_PARENT_TOKEN"
```

### 4. **Search với multiple filters và sorting**
```bash
curl -X GET "http://localhost:3000/api/vaccination-campaigns/search?keyword=vaccine&status=ongoing&startDateFrom=2025-06-01&sort=startDate:asc&page=2&paging=5" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. **Advanced participation search**
```bash
curl -X GET "http://localhost:3000/api/vaccination-participations/search?keyword=mai&vaccinationStatus=completed&vaccinationDateFrom=2025-06-01&vaccinationDateTo=2025-06-30&sort=vaccinationDate:desc" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Error Responses

### 400 Bad Request
```json
{
  "httpStatusCode": 400,
  "message": "Keyword must be 1-100 characters"
}
```

### 401 Unauthorized
```json
{
  "httpStatusCode": 401,
  "message": "User authentication required"
}
```

### 403 Forbidden
```json
{
  "httpStatusCode": 403,
  "message": "Insufficient permissions"
}
```

---

## Ưu điểm

### 1. User Experience
- **Đơn giản**: Chỉ cần 1 field `keyword` thay vì nhiều search fields riêng lẻ
- **Linh hoạt**: Có thể tìm theo bất kỳ thông tin nào liên quan
- **Thông minh**: Tự động tìm trong các related collections

### 2. Performance
- **Smart routing**: Chỉ dùng aggregation khi cần thiết
- **Database indexes**: Tối ưu cho text search và filtering
- **Score-based ranking**: Kết quả relevance cao hơn ở đầu

### 3. Maintenance
- **Consistent**: Cùng pattern cho tất cả search endpoints
- **Extensible**: Dễ thêm fields mới vào keyword search
- **Scalable**: Aggregation pipeline có thể scale tốt

## Best Practices

### 1. Frontend Implementation
```javascript
// Debounce keyword input để tránh too many requests
const [keyword, setKeyword] = useState('');
const debouncedKeyword = useDebounce(keyword, 300);

// Combine keyword với other filters
const searchParams = {
  keyword: debouncedKeyword,
  status: selectedStatus,
  page: currentPage,
  paging: pageSize
};
```

### 2. Error Handling
```typescript
// Validate keyword length
if (keyword && (keyword.length < 1 || keyword.length > 100)) {
  throw new ValidationError('Keyword must be 1-100 characters');
}

// Handle special characters
const sanitizedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
```

### 3. Monitoring
- Monitor slow queries với aggregation pipeline
- Track keyword search patterns
- Optimize indexes based on usage

## Migration Notes

### Existing Code Compatibility
- Existing APIs vẫn hoạt động bình thường
- Keyword search là enhancement, không breaking change
- Legacy sort parameters (sortBy, sortOrder) vẫn được support

### Database Migration
```javascript
// Tạo text indexes (chạy 1 lần)
db.vaccinationcampaigns.createIndex({
  "vaccineName": "text",
  "vaccineType": "text", 
  "targetAudience": "text"
}, {
  "name": "vaccination_campaign_text_search",
  "weights": {
    "vaccineName": 10,
    "vaccineType": 5,
    "targetAudience": 3
  }
});
```

---

## Các API khác của Hệ thống Vaccination

### 📋 Campaign Management APIs

#### **POST** `/api/vaccination-campaigns/create`
**Mô tả**: Tạo chiến dịch tiêm chủng mới (Admin only)
**Authorization**: Admin

#### **PUT** `/api/vaccination-campaigns/update/:campaignId`
**Mô tả**: Cập nhật thông tin chiến dịch (Admin only)
**Authorization**: Admin

#### **GET** `/api/vaccination-campaigns/all`
**Mô tả**: Lấy danh sách tất cả campaigns với phân trang
**Authorization**: Admin, Nurse

#### **GET** `/api/vaccination-campaigns/get/:campaignId`
**Mô tả**: Lấy thông tin chi tiết campaign
**Authorization**: Admin, Nurse

#### **POST** `/api/vaccination-campaigns/add-students/:campaignId`
**Mô tả**: Thêm học sinh vào campaign (Admin only)
**Authorization**: Admin

#### **GET** `/api/vaccination-campaigns/participations/:campaignId`
**Mô tả**: Lấy danh sách tham gia của một campaign cụ thể
**Authorization**: Admin, Nurse

---

### 💉 Participation Management APIs

#### **PUT** `/api/vaccination-participations/parent-consent/:participationId`
**Mô tả**: Phụ huynh đồng ý/từ chối tiêm chủng cho con
**Authorization**: Parent

#### **PUT** `/api/vaccination-participations/record/:participationId`
**Mô tả**: Y tá ghi nhận kết quả tiêm chủng
**Authorization**: Nurse

#### **GET** `/api/vaccination-participations/parent`
**Mô tả**: Phụ huynh xem danh sách tiêm chủng của con (với phân trang)
**Authorization**: Parent

---

## API Base URLs

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

Tất cả APIs đều yêu cầu Authentication qua Bearer Token trong header:
```http
Authorization: Bearer <your_jwt_token>
```

---

## 🔒 Security Enhancements

### Password Field Protection
Tất cả các API responses đã được tối ưu để **ẩn password field** khỏi user information:

- ✅ **Campaign APIs**: `createdBy` chỉ trả về `{_id, name, email}`
- ✅ **Participation APIs**: `createdBy`, `vaccinatedNurse` chỉ trả về `{_id, name, email}`
- ✅ **Aggregation Pipelines**: Sử dụng projection để loại bỏ sensitive fields
- ✅ **Populate Queries**: Chỉ populate các fields cần thiết

### Implementation Details:
```typescript
// Simple query với populate
.populate('createdBy', 'name email') // Chỉ lấy name và email

// Aggregation với projection
{
  $project: {
    createdBy: {
      _id: { $arrayElemAt: ['$createdByInfo._id', 0] },
      name: { $arrayElemAt: ['$createdByInfo.name', 0] },
      email: { $arrayElemAt: ['$createdByInfo.email', 0] }
      // password và các sensitive fields khác bị loại bỏ
    }
  }
}
```
