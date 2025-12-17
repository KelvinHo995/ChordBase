// config/db.js
const { Sequelize } = require('sequelize');
const vars = require('./vars');

// 1. Tạo instance Sequelize
const sequelize = new Sequelize(
    vars.dbName,  // Tên Database
    vars.dbUser,  // Username
    vars.dbPass,  // Password
    {
        host: vars.dbHost,
        port: vars.dbPort,
        dialect: 'postgres', // Chỉ định loại DB
        logging: vars.env === 'development' ? console.log : false, // Bật log SQL ở chế độ dev
        define: {
            timestamps: true // Tự động thêm createdAt và updatedAt
        }
    }
);

exports.connect = async () => {
    try {
        // 2. Kiểm tra kết nối
        await sequelize.authenticate();
        console.log('✅ Kết nối thành công tới PostgreSQL.');
        
        // 3. Đồng bộ hóa Models (Tạo bảng nếu chưa tồn tại)
        // Lưu ý: Chỉ nên dùng { force: true } (xóa và tạo lại) trong môi trường Dev/Test
        if (vars.env === 'development') {
             await sequelize.sync(); 
             // Hoặc dùng: await sequelize.sync({ force: true }); 
        }

    } catch (error) {
        console.error('❌ LỖI KẾT NỐI DB:', error.message);
        process.exit(1); 
    }
};

// Xuất đối tượng sequelize để Models có thể sử dụng
exports.sequelize = sequelize;