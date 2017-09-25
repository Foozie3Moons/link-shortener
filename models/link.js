'use strict';
module.exports = (sequelize, DataTypes) => {
  var link = sequelize.define('link', {
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return link;
};
