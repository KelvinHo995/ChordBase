// config/db.js - Database configuration
const { Sequelize } = require('sequelize');
const vars = require('./vars');

const sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
        host: vars.dbHost,
        port: vars.dbPort,
        dialect: 'postgres',
        logging: vars.env === 'development' ? console.log : false,
        
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        
        timezone: '+07:00',
        
        define: {
            timestamps: true,
            underscored: true,      
            freezeTableName: true,  
        },
        
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
        console.log('✅ Successfully connected to PostgreSQL.');
    } catch (error) {
        console.error('❌ DATABASE CONNECTION ERROR:', error.message);
        console.error('📋 Error details:', error);
        process.exit(1);
    }
};

exports.disconnect = async () => {
    try {
        await sequelize.close();
        console.log('🔌 Database connection closed');
    } catch (error) {
        console.error('❌ Error closing connection:', error.message);
    }
};

exports.testQuery = async () => {
    try {
        const result = await sequelize.query('SELECT NOW() as current_time');
        return true;
    } catch (error) {
        console.error('❌ Test query failed:', error.message);
        return false;
    }
};

exports.sequelize = sequelize;
exports.Sequelize = Sequelize; 