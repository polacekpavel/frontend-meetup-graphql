import Sequelize from "sequelize";

const db = new Sequelize('postgres://qfyjotanmhztvj:0c3d255d3fca1020f03724c06638b201f5920b492f1e37a75fc0095bedc37bc8@ec2-79-125-118-221.eu-west-1.compute.amazonaws.com:5432/da5fpluegah5e7', {
  dialectOptions: {
    ssl: true
  },
  dialect: 'postgres'
});

db.define('User', {
  githubUsername: { type: Sequelize.STRING },
  firstName: { type: Sequelize.STRING },
  lastName: { type: Sequelize.STRING }
}, {
  timestamps: true
});

const Message = db.models.Message;
const User = db.models.User;
// db.sync({ force: true });

export { User, Message };