const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      provider: {
        type: Sequelize.ENUM('local', 'kakao'),
        allowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) { // User 모델과 다른 모델 간의 연관 관계를 설정하는 associate 메서드입니다.
    db.User.hasMany(db.Post); // User 모델은 여러 개의 Post 모델과 1:N 관계를 가집니다. 즉, 한 사용자가 여러 게시글을 가질 수 있습니다.

    db.User.belongsToMany(db.User, { // User 모델은 User 모델과 N:M 관계를 가집니다. 이 경우 '팔로워-팔로잉' 관계를 나타냅니다.
      foreignKey: 'followingId', // 중간 테이블(Follow)에서 'followingId'를 외래키로 사용하여 팔로잉 하는 사람의 ID를 저장합니다.
      as: 'Followers', // 이 관계는 'Followers'라는 이름으로 접근할 수 있습니다. 즉, '팔로워들'을 참조합니다.
      through: 'Follow', // 중간 테이블로 'Follow' 테이블을 사용하여 두 User 모델 간의 관계를 연결합니다.
    });

    db.User.belongsToMany(db.User, { // User 모델은 다시 User 모델과 N:M 관계를 가지며, 이번에는 '팔로잉' 관계를 나타냅니다.
      foreignKey: 'followerId', // 중간 테이블(Follow)에서 'followerId'를 외래키로 사용하여 팔로워의 ID를 저장합니다.
      as: 'Followings', // 이 관계는 'Followings'라는 이름으로 접근할 수 있습니다. 즉, '팔로잉 하는 사람들'을 참조합니다.
      through: 'Follow', // 중간 테이블로 'Follow' 테이블을 사용하여 두 User 모델 간의 관계를 연결합니다.
    });
}
};

module.exports = User;
