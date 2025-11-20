const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Member = sequelize.define(
    "Member",
    {
        id_member: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        jabatan: {
            type: DataTypes.ENUM("senior_leader", "leader", "member"),
            allowNull: false,
        },

        // RELASI OTOMATIS
        id_admin: { type: DataTypes.INTEGER, allowNull: true },
        id_senior: { type: DataTypes.INTEGER, allowNull: true },
        id_leader: { type: DataTypes.INTEGER, allowNull: true },
    },
    { timestamps: true }
);

module.exports = Member;
