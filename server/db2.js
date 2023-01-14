const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize(
 'sdc',
 'root',
 'California',
  {
    host: '127.0.0.1',
    dialect: 'mariadb'
  }
);

sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

const Product = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  campus: DataTypes.STRING,
  name: DataTypes.STRING,
  slogan: DataTypes.STRING,
  description: DataTypes.STRING,
  category: DataTypes.STRING,
  default_price: DataTypes.STRING,
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
});

const Feature = sequelize.define('features', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  feature: DataTypes.STRING,
  value: DataTypes.STRING
})

Product.belongsToMany(Feature, { through: 'product_features' });
Feature.belongsToMany(Product, { through: 'product_features' });

const Style = sequelize.define('styles', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  name: DataTypes.STRING,
  original_price: DataTypes.STRING,
  sale_price: DataTypes.STRING,
  default: DataTypes.BOOLEAN,
  product_id: DataTypes.INTEGER
})

Product.hasMany(Style, {
  foreignKey: 'product_id'
});
Style.belongsTo(Product);

const Photo = sequelize.define('photos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  style_id: DataTypes.INTEGER,
  thumbnail_url: DataTypes.STRING,
  url: DataTypes.STRING
})

Style.hasMany(Photo, {
  foreignKey: 'style_id'
});
Photo.belongsTo(Style);

Product.belongsToMany(Product, {
  as: 'product1',
  foreignKey: 'product1_id',
  through: 'related_products'
});

Product.belongsToMany(Product, {
  as: 'product2',
  foreignKey: 'product2_id',
  through: 'related_products'
});

sequelize.sync({ force: true }).then(() => {
  console.log('Product table created successfully!');
}).catch((error) => {
  console.error('Unable to create table : ', error);
});

module.exports = Product;

