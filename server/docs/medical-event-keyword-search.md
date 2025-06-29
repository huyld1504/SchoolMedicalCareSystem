# Medical Event System - Keyword Search & Privacy Security

## 📋 Tổng quan
Hệ thống sự kiện y tế đã được tối ưu hóa để hỗ trợ keyword search nâng cao và đảm bảo bảo mật thông tin nhạy cảm.

## 🔍 Cách thức hoạt động

### 1. Keyword Search cho Medical Events
Khi search medical events với keyword, hệ thống sẽ tìm kiếm trong các fields:

- **studentInfo.name** - Tên học sinh
- **studentInfo.studentCode** - Mã số học sinh
- **description** - Mô tả sự kiện y tế
- **note** - Ghi chú
- **solution** - Giải pháp xử lý

### 2. Smart Query Strategy
```typescript
// Nếu có keyword -> sử dụng aggregation pipeline
if (queryBuilder.keyword && queryBuilder.keyword.trim().length > 0) {
  return this.getAllMedicalEventsWithAggregation(queryBuilder);
}

// Nếu không có keyword -> sử dụng simple filter (nhanh hơn)
return this.getAllMedicalEventsBasic(queryBuilder);
```

## 🔧 Aggregation Pipeline Implementation

### 1. Pipeline Structure
```typescript
const pipeline = [  // Step 1: Apply base filters FIRST (type, level, status, dateHappened)
  { $match: baseFilter },
  
  // Step 2: Unwind studentJoin array
  { $unwind: '$studentJoin' },
  
  // Step 3: Lookup student information
  {
    $lookup: {
      from: 'children',
      localField: 'studentJoin.studentId',
      foreignField: '_id',
      as: 'studentInfo'
    }
  },
    // Step 4: Unwind student info
  { $unwind: '$studentInfo' },
  
  // Step 5: Apply keyword search
  {
    $match: {
      $or: [
        { 'studentInfo.name': { $regex: keyword, $options: 'i' } },
        { 'studentInfo.studentCode': { $regex: keyword, $options: 'i' } },
        { 'description': { $regex: keyword, $options: 'i' } },
        { 'note': { $regex: keyword, $options: 'i' } },
        { 'solution': { $regex: keyword, $options: 'i' } }
      ]
    }
  },
  
  // Step 6: Group back to recreate original structure
  {
    $group: {
      _id: '$_id',
      // ... all fields
    }
  },
  
  // Step 7: Populate user & student with selected fields only
  // ... lookup operations
  
  // Step 8: Sort and paginate
  { $sort: query.getSort() }
];
```

## 🔐 Privacy & Security Features

### 1. Hidden Sensitive Fields
Các field nhạy cảm đã được ẩn trong tất cả API responses:

**User Information:**
- ✅ Trả về: `_id`, `name`, `email`, `isActive`
- ❌ Ẩn: `password`, `refreshToken`, `role` (nếu có)

**Student Information:**
- ✅ Trả về: `_id`, `name`, `studentCode`, `medicalConverageId`
- ❌ Ẩn: Các thông tin cá nhân khác

### 2. Secure Populate Implementation
```typescript
// Trong aggregation pipeline
{
  $lookup: {
    from: 'users',
    localField: 'userId',
    foreignField: '_id',
    as: 'userId',
    pipeline: [
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          isActive: 1
        }
      }
    ]
  }
}

// Trong basic queries
.populate({
  path: "userId",
  select: "name email _id isActive"
})
.populate({
  path: "studentJoin.studentId",
  select: "name studentCode medicalConverageId"
})
```

## 🌐 API Endpoints được cập nhật

### 1. GET /medical-events
**Parameters:**
- `keyword` - Tìm kiếm theo tên/mã học sinh, description, note, solution
- `type` - Loại sự kiện y tế
- `level` - Mức độ nghiêm trọng
- `status` - Trạng thái
- `startDate` - Từ ngày
- `endDate` - Đến ngày
- `page` - Trang hiện tại
- `limit` - Số records trên mỗi trang

**Example Requests:**
```bash
# Search theo tên học sinh
GET /medical-events?keyword=Nguyen Van A

# Search theo mã học sinh
GET /medical-events?keyword=HS001

# Search theo description
GET /medical-events?keyword=sốt cao

# Combined filters
GET /medical-events?keyword=ho&type=illness&level=medium&page=1&limit=10
```

### 2. Affected Methods
Các phương thức đã được cập nhật để ẩn thông tin nhạy cảm:

- `getAllMedicalEvents()` - Có keyword search & privacy
- `getAllMedicalEventsBasic()` - Chỉ có privacy
- `getMedicalEventById()` - Chỉ có privacy  
- `updateMedicalEvent()` - Chỉ có privacy
- `searchMedicalEvents()` - Chỉ có privacy
- `getMedicalEventsByStudentId()` - Cần cập nhật thêm privacy

## ⚡ Performance Considerations

### 1. Indexing Recommendations
```javascript
// Tạo indexes cho performance tốt hơn
db.medicalevents.createIndex({ "type": 1 });
db.medicalevents.createIndex({ "level": 1 });
db.medicalevents.createIndex({ "status": 1 });
db.medicalevents.createIndex({ "dateHappened": 1 });

// Text search indexes
db.medicalevents.createIndex({ 
  "description": "text", 
  "note": "text", 
  "solution": "text" 
});

// Student collection indexes
db.children.createIndex({ "name": "text", "studentCode": "text" });
```

### 2. Pagination với Aggregation
- Sử dụng `$skip` và `$limit` trong pipeline
- Count total records với pipeline riêng biệt
- Trả về đúng format pagination chuẩn

### 3. Memory Usage
- Aggregation pipeline có thể sử dụng nhiều memory hơn
- Cân nhắc sử dụng `allowDiskUse: true` cho datasets lớn
- Monitor performance với datasets thực tế

## 🧪 Testing

### 1. Test Cases cần kiểm tra
```bash
# 1. Keyword search functionality
curl "http://localhost:3000/medical-events?keyword=Nguyen"

# 2. Privacy - kiểm tra không có password trong response
curl "http://localhost:3000/medical-events" | grep -i password

# 3. Combined filters
curl "http://localhost:3000/medical-events?keyword=sốt&type=illness"

# 4. Pagination
curl "http://localhost:3000/medical-events?keyword=test&page=2&limit=5"

# 5. Empty keyword (should use basic query)
curl "http://localhost:3000/medical-events?keyword="
```

### 2. Performance Testing
```javascript
// Test với dataset lớn
const testCases = [
  { keyword: '', expectedMethod: 'basic' },
  { keyword: 'Nguyen', expectedMethod: 'aggregation' },
  { keyword: 'HS001', expectedMethod: 'aggregation' },
  { keyword: 'sốt cao', expectedMethod: 'aggregation' }
];

// Measure execution time
console.time('medical-event-search');
await medicalEventRepo.getAllMedicalEvents(query);
console.timeEnd('medical-event-search');
```

## 📦 Migration Notes

### 1. Backward Compatibility
- API structure giữ nguyên 100%
- Response format không thay đổi (chỉ bớt fields nhạy cảm)
- Query parameters tương thích với cũ

### 2. Deployment Checklist
- [ ] Backup database trước khi deploy
- [ ] Test aggregation pipeline trên staging
- [ ] Verify indexes đã được tạo
- [ ] Test privacy - đảm bảo không có password leak
- [ ] Monitor performance sau deploy

## 🚀 Future Enhancements

### 1. Full-text Search
- Implement MongoDB Atlas Search
- Support fuzzy search, synonyms
- Better ranking và relevance scoring

### 2. Advanced Filtering
- Date range với better UX
- Multiple status selection
- Complex boolean operations

### 3. Audit Trail
- Log tất cả search queries
- Track user access patterns
- Security monitoring

### 4. Caching
- Redis cache cho popular searches
- Cache aggregation results
- TTL-based invalidation

### **Endpoint:** 
```
GET /api/medical-events/all?keyword={search_term}
```

### **Ví Dụ Sử Dụng:**

#### 1. Tìm kiếm theo tên học sinh:
```bash
GET /api/medical-events/all?keyword=Nguyễn Văn An
```

#### 2. Tìm kiếm theo mã số học sinh:
```bash
GET /api/medical-events/all?keyword=SV001
```

#### 3. Tìm kiếm theo mô tả sự kiện:
```bash
GET /api/medical-events/all?keyword=ngất xỉu
```

#### 4. Kết hợp với các filter khác:
```bash
GET /api/medical-events/all?keyword=Nguyễn&type=cấp cứu&status=Chờ xử lí&level=3
```

#### 5. Kết hợp với pagination:
```bash
GET /api/medical-events/all?keyword=An&page=1&limit=10&sort=dateHappened:desc
```

## ⚙️ Implementation Details

### **Aggregation Pipeline Flow:**

1. **$unwind**: Tách array `studentJoin` thành các documents riêng biệt
2. **$lookup**: Join với collection `children` để lấy thông tin học sinh
3. **$match**: Apply base filters (type, level, status, dateHappened)  
4. **$match**: Apply keyword search với $regex
5. **$group**: Gom nhóm lại theo medical event ID gốc
6. **$lookup**: Join với collection `users` để lấy thông tin y tá
7. **$lookup**: Join lại với `children` để populate student data
8. **$sort**: Sắp xếp kết quả
9. **$skip + $limit**: Pagination

### **Performance Optimization:**

#### **Automatic Query Strategy:**
- **Có keyword**: Sử dụng Aggregation Pipeline
- **Không có keyword**: Sử dụng find() query thông thường (nhanh hơn)

#### **Index Recommendations:**
```javascript
// Recommended indexes for better performance
db.children.createIndex({ "name": "text", "studentCode": "text" })
db.medicalevents.createIndex({ "type": 1, "status": 1, "dateHappened": -1 })
db.medicalevents.createIndex({ "studentJoin.studentId": 1 })
```

## 📊 Sample Response

```json
{
  "statusCode": 200,
  "message": "Medical events retrieved successfully",
  "data": {
    "records": [
      {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "type": "cấp cứu",
        "status": "Đã xử lí", 
        "level": 3,
        "description": "Học sinh ngất xỉu trong giờ thể dục",
        "dateHappened": "2025-06-28T10:30:00.000Z",
        "note": "Đã sơ cứu và liên hệ phụ huynh",
        "solution": "Cho nghỉ ngơi và uống nước",
        "userId": [
          {
            "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
            "name": "Y tá Phạm Thị Lan",
            "email": "nurse.lan@school.edu.vn"
          }
        ],
        "studentJoin": [
          {
            "studentId": {
              "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
              "name": "Nguyễn Văn An",
              "studentCode": "SV001",
              "gender": "Nam",
              "birthdate": "2010-05-15T00:00:00.000Z"
            }
          }
        ],
        "createdAt": "2025-06-28T10:35:00.000Z",
        "updatedAt": "2025-06-28T11:00:00.000Z"
      }
    ],
    "totalPages": 1,
    "page": 1,
    "total": 1,
    "limit": 10
  }
}
```

## 🔧 Supported Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `keyword` | string | Tìm kiếm trong tên HS, mã HS, mô tả, ghi chú | `keyword=Nguyễn` |
| `type` | string | Loại sự kiện | `type=cấp cứu` |
| `level` | number | Mức độ nghiêm trọng (1-5) | `level=3` |
| `status` | string | Trạng thái xử lý | `status=Chờ xử lí` |
| `startDate` | date | Từ ngày | `startDate=2025-06-01` |
| `endDate` | date | Đến ngày | `endDate=2025-06-30` |
| `page` | number | Trang hiện tại | `page=1` |
| `limit` | number | Số lượng mỗi trang | `limit=10` |
| `sort` | string | Sắp xếp | `sort=dateHappened:desc` |

## 🎯 Use Cases

### **1. Tìm Kiếm Học Sinh Cụ Thể**
Y tá muốn xem lịch sử y tế của học sinh "Nguyễn Văn An":
```
GET /api/medical-events/all?keyword=Nguyễn Văn An
```

### **2. Tìm Theo Mã Số Học Sinh**
Tìm tất cả sự kiện của học sinh có mã "SV001":
```
GET /api/medical-events/all?keyword=SV001
```

### **3. Tìm Theo Loại Sự Kiện**
Tìm tất cả trường hợp "ngất xỉu":
```
GET /api/medical-events/all?keyword=ngất xỉu
```

### **4. Báo Cáo Thống Kê**
Lọc theo nhiều tiêu chí để tạo báo cáo:
```
GET /api/medical-events/all?type=cấp cứu&level=4&status=Đã xử lí&startDate=2025-06-01&endDate=2025-06-30
```

## ⚠️ Lưu Ý Quan Trọng

1. **Performance**: Aggregation pipeline có thể chậm hơn với dataset lớn
2. **Memory**: Pipeline sử dụng nhiều memory hơn với complex lookups
3. **Indexing**: Cần tạo index phù hợp để tối ưu performance
4. **Regex**: Tìm kiếm regex có thể chậm với text dài

## 🔄 Upgrade Path

Nếu cần optimize thêm, có thể:
1. Implement full-text search với MongoDB Atlas Search
2. Sử dụng Elasticsearch cho advanced search
3. Caching kết quả tìm kiếm phổ biến
4. Implement search suggestions/autocomplete

---

**Kết quả**: Medical Event search giờ đây hỗ trợ tìm kiếm thông minh theo tên và mã học sinh, giúp y tá dễ dàng tra cứu thông tin y tế học sinh.

## 🐛 Troubleshooting & Common Issues

### 1. **Filter không hoạt động với keyword search**

**Vấn đề:** Khi sử dụng keyword kết hợp với filters khác (type, level, status, dateHappened), kết quả không đúng.

**Nguyên nhân:** 
- Base filters được áp dụng sau khi unwind studentJoin, gây ra duplicate records
- Date filter logic bị ghi đè khi có cả startDate và endDate
- Level filter có thể là string nhưng database lưu là number

**Giải pháp đã áp dụng:**

#### Fix 1: Thứ tự Pipeline đúng
```typescript
const pipeline = [
  // ✅ ĐÚNG: Apply base filters TRƯỚC khi unwind
  { $match: baseFilter },
  { $unwind: '$studentJoin' },
  // ... rest of pipeline
};

// ❌ SAI: Apply base filters SAU khi unwind
const wrongPipeline = [
  { $unwind: '$studentJoin' },
  { $match: baseFilter }, // ← Sai thứ tự!
];
```

#### Fix 2: Date Filter Logic
```typescript
// ✅ ĐÚNG: Build date filter properly
const dateFilter: any = {};
if (this.startDate) {
  dateFilter.$gte = this.startDate;
}
if (this.endDate) {
  dateFilter.$lte = this.endDate;
}
if (Object.keys(dateFilter).length > 0) {
  filter.dateHappened = dateFilter;
}

// ❌ SAI: Date filter bị ghi đè
if (this.startDate) {
  filter.dateHappened = { $gte: this.startDate };
}
if (this.endDate) {
  filter.dateHappened = { ...filter.dateHappened, $lte: this.endDate }; // Có thể undefined
}
```

#### Fix 3: Level Type Conversion
```typescript
// ✅ ĐÚNG: Convert string to number
if (this.rawQuery?.level) {
  filter.level = typeof this.rawQuery.level === 'string' 
    ? parseInt(this.rawQuery.level, 10) 
    : this.rawQuery.level;
}

// ❌ SAI: Không convert type
filter.level = this.rawQuery.level; // Có thể là string
```

### 2. **Performance Issues với Aggregation**

**Vấn đề:** Query chậm với dataset lớn.

**Giải pháp:**
- Tạo indexes phù hợp
- Sử dụng `allowDiskUse: true` nếu cần
- Monitor memory usage

```javascript
// Recommended indexes
db.medicalevents.createIndex({ "type": 1, "level": 1, "status": 1 });
db.medicalevents.createIndex({ "dateHappened": -1 });
db.children.createIndex({ "name": "text", "studentCode": "text" });
```

### 3. **Debug Aggregation Pipeline**

Để debug pipeline, thêm logging:

```typescript
console.log('Base Filter:', JSON.stringify(baseFilter, null, 2));
console.log('Pipeline:', JSON.stringify(pipeline, null, 2));

// Test từng stage riêng biệt
const stage1Result = await this.model.aggregate([
  { $match: baseFilter }
]).exec();
console.log('After base filter:', stage1Result.length);
```
