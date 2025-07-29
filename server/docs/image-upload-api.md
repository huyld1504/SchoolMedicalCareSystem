# Image Upload API Documentation

## Mô tả
API này được thiết kế theo ý tưởng: **Upload hình ảnh lên Cloudinary → Trả về public URL → Lưu URL vào database**

## Workflow
```
Client uploads image → Cloudinary Storage → Public URL → Save URL to DB
```

## Endpoints

### 1. Upload Single Image
**POST** `/api/images/upload`

**Authentication**: Required (Bearer token)

**Request**:
- Method: POST
- Content-Type: multipart/form-data
- Body: FormData với field `image`

```javascript
// Frontend example
const formData = new FormData();
formData.append('image', fileInput.files[0]);

const response = await fetch('/api/images/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Upload hình ảnh thành công",
  "data": {
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/school-medical-care/uploads/1234567890-filename.jpg",
    "publicId": "school-medical-care/uploads/1234567890-filename",
    "originalName": "test.jpg",
    "size": 245760,
    "mimetype": "image/jpeg",
    "uploadedAt": "2025-06-30T10:30:00.000Z"
  }
}
```

### 2. Upload Multiple Images
**POST** `/api/images/upload-multiple`

**Authentication**: Required

**Request**:
- Content-Type: multipart/form-data
- Body: FormData với field `images` (array, max 10 files)

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Upload thành công 3/3 ảnh",
  "data": {
    "images": [
      {
        "imageUrl": "https://res.cloudinary.com/...",
        "publicId": "school-medical-care/uploads/...",
        "originalName": "image1.jpg",
        "size": 245760,
        "mimetype": "image/jpeg",
        "uploadedAt": "2025-06-30T10:30:00.000Z"
      }
    ],
    "summary": {
      "total": 3,
      "success": 3,
      "failed": 0
    }
  }
}
```

### 3. Upload from Base64
**POST** `/api/images/upload-base64`

**Authentication**: Required

**Request Body**:
```json
{
  "base64Data": "iVBORw0KGgoAAAANSUhEUgAA...",
  "fileName": "screenshot",
  "folder": "medical-images"
}
```

**Response**: Tương tự upload single image

### 4. Delete Image
**DELETE** `/api/images/:publicId`

**Authentication**: Required

**URL Params**: 
- `publicId`: Public ID của hình ảnh (URL encoded)

**Example**:
```
DELETE /api/images/school-medical-care%2Fuploads%2F1234567890-filename
```

**Response**:
```json
{
  "success": true,
  "message": "Xóa hình ảnh thành công"
}
```

### 5. Generate Thumbnail
**GET** `/api/images/thumbnail/:publicId?width=150&height=150`

**Authentication**: Not required

**Response**:
```json
{
  "success": true,
  "data": {
    "thumbnailUrl": "https://res.cloudinary.com/.../w_150,h_150,c_fill,q_auto:good,f_webp/...",
    "originalPublicId": "school-medical-care/uploads/1234567890-filename",
    "width": 150,
    "height": 150
  }
}
```

## Usage Examples

### Frontend Integration

#### React Example
```javascript
const ImageUpload = () => {
  const [imageUrl, setImageUrl] = useState('');
  
  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (result.success) {
        setImageUrl(result.data.imageUrl);
        // Lưu imageUrl vào database của bạn
        await saveToDatabase({
          imageUrl: result.data.imageUrl,
          publicId: result.data.publicId
        });
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div>
      <input 
        type="file" 
        accept="image/*"
        onChange={(e) => handleUpload(e.target.files[0])}
      />
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};
```

#### Vanilla JavaScript
```javascript
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const formData = new FormData();
  formData.append('image', file);
  
  try {
    const response = await fetch('/api/images/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    
    const result = await response.json();
    console.log('Image URL:', result.data.imageUrl);
    
    // Save to your database
    // saveImageUrlToDatabase(result.data.imageUrl);
    
  } catch (error) {
    console.error('Error:', error);
  }
});
```

### Backend Integration

#### Lưu URL vào Database
```javascript
// Example: Thêm avatar cho user
app.post('/api/users/:id/avatar', auth(), async (req, res) => {
  try {
    // 1. Upload image (đã xử lý ở ImageRoutes)
    // 2. Lấy imageUrl từ response
    // 3. Lưu vào database
    
    const { imageUrl, publicId } = req.uploadResult; // Từ middleware
    
    await User.findByIdAndUpdate(req.params.id, {
      avatar: imageUrl,
      avatarPublicId: publicId // Để xóa sau này
    });
    
    res.json({ success: true, avatarUrl: imageUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

#### Xóa hình cũ khi cập nhật
```javascript
app.put('/api/users/:id/avatar', auth(), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    // Xóa hình cũ từ Cloudinary
    if (user.avatarPublicId) {
      await fetch(`/api/images/${encodeURIComponent(user.avatarPublicId)}`, {
        method: 'DELETE',
        headers: { 'Authorization': req.headers.authorization }
      });
    }
    
    // Upload hình mới và cập nhật database
    // ...
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Database Schema Examples

### User Model (với avatar)
```javascript
const userSchema = {
  name: String,
  email: String,
  avatar: String,        // URL từ Cloudinary
  avatarPublicId: String // Để xóa khi cần
};
```

### Medical Record (với nhiều hình)
```javascript
const medicalRecordSchema = {
  patientId: ObjectId,
  diagnosis: String,
  images: [{
    url: String,         // URL từ Cloudinary
    publicId: String,    // Để xóa khi cần
    description: String,
    uploadedAt: Date
  }]
};
```

## Error Handling

### Common Errors
```json
// File quá lớn
{
  "success": false,
  "message": "File size exceeds 5MB limit"
}

// Không phải file hình ảnh
{
  "success": false,
  "message": "Chỉ chấp nhận file hình ảnh!"
}

// Không có quyền truy cập
{
  "success": false,
  "message": "Access denied"
}

// Cloudinary error
{
  "success": false,
  "message": "Upload thất bại",
  "error": "Invalid image format"
}
```

## Security Notes

1. **Authentication**: Tất cả upload endpoints đều yêu cầu authentication
2. **File Validation**: Chỉ chấp nhận file hình ảnh
3. **Size Limit**: Max 5MB per file
4. **Rate Limiting**: Nên thêm rate limiting cho upload endpoints
5. **File Naming**: Tự động tạo unique filename để tránh conflict

## Environment Setup

Đảm bảo có các biến environment trong `.env`:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Monitoring & Maintenance

1. **Log uploads**: Theo dõi số lượng và kích thước files upload
2. **Cleanup**: Định kỳ xóa các hình không được sử dụng
3. **Backup**: Cloudinary tự động backup, nhưng nên có backup metadata trong DB
4. **Cost monitoring**: Theo dõi chi phí Cloudinary storage và bandwidth
