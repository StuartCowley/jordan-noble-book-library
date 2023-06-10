module.exports = (connection, DataTypes) => {
  const schema = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'No username provided.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Invalid email provided.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password should be between 8 and 99 characters',
        },
      },
    },
  };
  const options = {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
  };
  const ReaderModel = connection.define('Reader', schema, options);
  return ReaderModel;
};
