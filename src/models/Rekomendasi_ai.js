const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Properti = require("./Properti");
const Cabuy = require("./Cabuy");

//
// 🧩 Definisi Model Rekomendasi_ai
//
const Rekomendasi_ai = sequelize.define(
  "Rekomendasi_ai",
  {
    id_rekomendasi: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    skor: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    id_properti: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Properti,
        key: "id_properti",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
  },
  {
    tableName: "rekomendasi_ai",
    timestamps: false,
  }
);

//
// 🔗 Relasi antar model
//


Cabuy.hasMany(Rekomendasi_ai, { foreignKey: "id_cabuy" });
Rekomendasi_ai.belongsTo(Cabuy, { foreignKey: "id_cabuy" });


Properti.hasMany(Rekomendasi_ai, { foreignKey: "id_properti" });
Rekomendasi_ai.belongsTo(Properti, { foreignKey: "id_properti" });

//
// 🚀 Export model
//
module.exports = Rekomendasi_ai;