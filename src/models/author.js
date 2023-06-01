module.exports = (connection, DataTypes) => {
  const schema = {
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'No author provided.',
        },
      },
    },
  };
  const AuthorModel = connection.define('Author', schema);
  return AuthorModel;
};
