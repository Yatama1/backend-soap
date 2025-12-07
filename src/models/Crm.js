// file: models/Crm.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Member = require("./Member");
const Cabuy = require("./Cabuy");

const Crm = sequelize.define(
    "Crm",
    {
        id_crm: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_cabuy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Cabuy,
                key: "id_cabuy",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        id_member: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Member,
                key: "id_member",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
        },
        catatan: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        interaksi_terakhir: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        strategi_followup: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        tableName: "crm",
        timestamps: false,
    }
);

//relasi antar model

//relasi member ke crm
Member.hasMany(Crm, { foreignKey: "id_member" });
Crm.belongsTo(Member, { foreignKey: "id_member" });

//relasii cabuy ke crm
Cabuy.hasMany(Crm, { foreignKey: "id_cabuy" });
Crm.belongsTo(Cabuy, { foreignKey: "id_cabuy" });

module.exports = Crm;