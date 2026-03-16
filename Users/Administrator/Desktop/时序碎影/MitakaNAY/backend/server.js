// 静态文件服务，用于提供上传的图片
app.use('/uploads', express.static(UPLOAD_DIR))
