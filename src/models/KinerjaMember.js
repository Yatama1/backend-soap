const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Member = require("./Member");

const KinerjaMember = sequelize.define("KinerjaMember", {
    id_kinerja: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    jumlah_proyek: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    jumlah_followup: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
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

}, {
    tableName: "kinerja_member",
    timestamps: false, // sesuai diagram (nggak ada created_at / updated_at)
}
);

// Relasi: Admin memiliki banyak Member
Member.hasMany(KinerjaMember, { foreignKey: "id_member" });
KinerjaMember.belongsTo(Member, { foreignKey: "id_member" });

module.exports = KinerjaMember;