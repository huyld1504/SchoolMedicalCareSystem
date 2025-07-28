# Campaign Scheduler Service Documentation

## Tổng quan

Campaign Scheduler Service tự động cập nhật trạng thái của các chiến dịch tiêm chủng dựa trên ngày bắt đầu và ngày kết thúc.

## Chức năng chính

### 1. Tự động cập nhật trạng thái
- **Planned → Ongoing**: Khi `startDate` <= ngày hôm nay
- **Ongoing → Completed**: Khi `endDate` < ngày hôm nay

### 2. Cập nhật participations tự động
- Khi campaign chuyển sang `completed`:
  - Participations với `parentConsent: 'approved'` và `vaccinationStatus: 'scheduled'` → `vaccinationStatus: 'missed'`
  - Participations với `parentConsent: 'pending'` → `parentConsent: 'canceled'` và `vaccinationStatus: 'canceled'`

## Lịch trình chạy

- **Tự động**: Mỗi ngày lúc 00:01 (Asia/Ho_Chi_Minh timezone)
- **Thủ công**: Có thể trigger qua API

## API Endpoints

### 1. Manual Update Campaign Status
```
POST /api/vaccination-campaigns/scheduler/manual-update
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Cập nhật trạng thái campaign thành công",
  "data": {
    "campaignsStarted": 2,
    "campaignsCompleted": 1,
    "timestamp": "2025-07-28T17:30:00.000Z"
  }
}
```

### 2. Get Scheduler Status
```
GET /api/vaccination-campaigns/scheduler/status
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Lấy thông tin scheduler thành công",
  "data": {
    "isRunning": true,
    "nextRunTime": "2025-07-29T00:01:00.000Z",
    "timezone": "Asia/Ho_Chi_Minh",
    "schedule": "Daily at 00:01"
  }
}
```

### 3. Restart Scheduler
```
POST /api/vaccination-campaigns/scheduler/restart
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Khởi động lại scheduler thành công",
  "data": {
    "status": "restarted",
    "timestamp": "2025-07-28T17:30:00.000Z"
  }
}
```

## Logging

Scheduler sẽ ghi log các hoạt động:
- Khởi động/dừng scheduler
- Kết quả cập nhật campaigns
- Lỗi xảy ra trong quá trình xử lý

## Environment Variables

```env
# Bật/tắt scheduler (mặc định: true)
SCHEDULER_ENABLED=true

# Cron pattern (mặc định: '1 0 * * *' - 00:01 hàng ngày)
SCHEDULER_CRON_PATTERN="1 0 * * *"

# Timezone (mặc định: 'Asia/Ho_Chi_Minh')
SCHEDULER_TIMEZONE="Asia/Ho_Chi_Minh"
```

## Testing

Chạy test cho scheduler:
```bash
npm run test -- campaign-scheduler.test.ts
```

## Troubleshooting

### 1. Scheduler không chạy tự động
- Kiểm tra biến môi trường `SCHEDULER_ENABLED`
- Xem logs để đảm bảo scheduler được khởi động
- Gọi API `/scheduler/status` để kiểm tra trạng thái

### 2. Campaigns không được cập nhật
- Kiểm tra ngày `startDate` và `endDate` trong database
- Gọi API manual update để test
- Xem logs để tìm lỗi

### 3. Performance issues
- Monitor số lượng campaigns trong system
- Có thể cần optimize query với indexing
- Xem xét batch processing cho datasets lớn

## Code Examples

### Sử dụng service trong code:
```typescript
import campaignSchedulerService from '@src/services/CampaignSchedulerService';

// Manual update
const result = await campaignSchedulerService.manualUpdate();
console.log(`Started: ${result.started}, Completed: ${result.completed}`);

// Check status
console.log('Scheduler running:', campaignSchedulerService.isRunning());
console.log('Next run:', campaignSchedulerService.getNextRunTime());

// Control scheduler
campaignSchedulerService.startScheduler();
campaignSchedulerService.stopScheduler();
```

### Testing trong môi trường development:
```bash
# Test manual update
curl -X POST http://localhost:3000/api/vaccination-campaigns/scheduler/manual-update \
  -H "Authorization: Bearer <your_admin_token>"

# Check scheduler status  
curl -X GET http://localhost:3000/api/vaccination-campaigns/scheduler/status \
  -H "Authorization: Bearer <your_admin_token>"
```

## Production Deployment

1. **Environment Setup**: Đảm bảo có set đúng timezone và cron pattern
2. **Monitoring**: Set up monitoring cho scheduler logs
3. **Backup**: Backup database trước khi deploy scheduler
4. **Testing**: Test thoroughly trong staging environment
5. **Rollback Plan**: Có plan để disable scheduler nếu cần

## Security Considerations

- Chỉ admin mới có quyền control scheduler
- Log tất cả scheduler activities
- Validate input dates trong campaign creation
- Rate limiting cho manual update endpoints
