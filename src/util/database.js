const Sequelize = require('sequelize');

//sqlite
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './database.sqlite'
// });

//mysql
 const sequelize = new Sequelize('mysql://root:@localhost:3306/9gagbr');

const User = sequelize.define('users', 
    {
        name: {
            type: Sequelize.STRING(30),
            allowNull: false
        },
        password: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        email: {
            type: Sequelize.STRING(100),
            allowNull: false
        }
    }, 
)

const Category = sequelize.define('categories', {
    name: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    path: {
        type: Sequelize.STRING(100),
        allowNull: false
    }

})

const Post = sequelize.define('posts', 
    {
        title: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        path: {
            type: Sequelize.STRING(100),
            allowNull: false
        },
        gif: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        category_id: {
            type: Sequelize.INTEGER,
            references: {
              model: Category,
              key: 'id'
            }
        },
    }, 
)

const Reaction = sequelize.define('reactions', 
    {
        positive: {
            type: Sequelize.BOOLEAN,
            allowNull: false
        },
        post_id: {
            type: Sequelize.INTEGER,
            references: {
              model: Post,
              key: 'id'
            }
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: User,
              key: 'id'
            }
        }
    }, 
)

const Comment = sequelize.define('comments', 
    {
        message: {
            type: Sequelize.STRING,
            allowNull: false
        },
        post_id: {
            type: Sequelize.INTEGER,
            references: {
              model: Post,
              key: 'id'
            }
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: User,
              key: 'id'
            }
        }
    }, 
)

//atualiza os models com o banco
//sequelize.sync()

exports.insertUser = (data, res) => {
    User.create(data).then(() => {
        res.json({
            message: 'Usuário cadastrado com sucesso'
        })
    }).error((e) => {
        res.json({
            message: 'Erro no servidor'
        })
    })
}

exports.updateUser = (data, res) =>  {
    User.findByPk(data).then(() => {
       User.update({ name: "novo nome", email: "novo email", password: "12345" },  { where: { id: data }})
    }).then(() => {
        res.json({ message: 'Usuário alterado com sucesso' })
    }).catch((e) => {
        res.json({
            message: 'Erro no servidor'
        })
    })
}

exports.deleteUser = (data, res) => {
    User.findByPk(data).then(() => {
        User.destroy({ where: {id: data} })
    })
}
