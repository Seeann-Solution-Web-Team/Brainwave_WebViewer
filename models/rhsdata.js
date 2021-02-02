'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RhsData extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  RhsData.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true },
      name: DataTypes.STRING,
      userTitle: DataTypes.STRING,
      name: DataTypes.STRING,
      address: DataTypes.STRING,
      ownerId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: 'RhsData',
    }
  );
  return RhsData;
};
