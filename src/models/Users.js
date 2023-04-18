module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING
        },
        username: {
            type: DataTypes.STRING
        },
        district_number: {
            type: DataTypes.INTEGER
        },
        language_code: {
            type: DataTypes.STRING,
            defaultValue: 'uz'
        }
    },{
        tableName: 'users',
        freezeTableName: true
    });

    return User;
}