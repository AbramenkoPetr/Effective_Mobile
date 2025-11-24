module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    name: {
      type: Sequelize.STRING
    },
    date_of_birth: {
      type: Sequelize.DATE
    },
    email: {
      type: Sequelize.STRING, allowNull: false, unique: true
    },
    password: {
     type: Sequelize.STRING
    },
    role: {
      type: Sequelize.STRING
    },
    status: {
      type: Sequelize.BOOLEAN, defaultValue: true
    }

  },

  {
    timestamps: false,
    
  }
);

  return User;
};
