// config/db.js - PHIÊN BẢN MỚI (AN TOÀN)
const { Sequelize } = require('sequelize');
const vars = require('./vars');

const sequelize = new Sequelize(
    vars.dbName,
    vars.dbUser,
    vars.dbPass,
    {
        host: vars.dbHost,
        port: vars.dbPort,
        dialect: 'postgres',
        logging: vars.env === 'development' ? console.log : false,
        
        // ✅ THÊM: Connection pool
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        
        // ✅ THÊM: Timezone
        timezone: '+07:00',
        
        define: {
            timestamps: true,
            underscored: true,      // ✅ snake_case
            freezeTableName: true,  // ✅ Không pluralize
        },
        
        // ✅ THÊM: SSL cho production
        dialectOptions: {
            ssl: vars.env === 'production' ? {
                require: true,
                rejectUnauthorized: false
            } : false
        },

        ssl: false
    }
);

exports.connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Kết nối thành công tới PostgreSQL.');
        
        // ✅ BỎ sequelize.sync() - Dùng SQL files thay vì
        // Schema được quản lý bởi schema.sql và ready.sql
        
    } catch (error) {
        console.error('❌ LỖI KẾT NỐI DB:', error.message);
        console.error('📋 Chi tiết lỗi:', error);
        process.exit(1);
    }
};

// ✅ THÊM: Function đóng kết nối
exports.disconnect = async () => {
    try {
        await sequelize.close();
        console.log('🔌 Đã đóng kết nối database');
    } catch (error) {
        console.error('❌ Lỗi khi đóng kết nối:', error.message);
    }
};

// ✅ THÊM: Test query function
exports.testQuery = async () => {
    try {
        const result = await sequelize.query('SELECT NOW() as current_time');
        console.log('⏰ Database time:', result[0][0].current_time);
        return true;
    } catch (error) {
        console.error('❌ Test query failed:', error.message);
        return false;
    }
};

exports.sequelize = sequelize;
exports.Sequelize = Sequelize; // ✅ Export thêm class