module.exports = (connection, DataTypes) => {
  const schema = {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'No title provided.',
        },
      },
    },
    ISBN: { type: DataTypes.STRING },
  };
  const BookModel = connection.define('Book', schema);
  return BookModel;
};
