const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
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
        },
    },{
        hooks: {
          beforeCreate: hashPassword
        }
    } 
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

async function hashPassword(user, options) {
    user.password = await bcrypt.hash(user.password, 12);
}

//atualiza os models com o banco
//sequelize.sync()

// USER
exports.insertUser = (data, res) => {
    User.create(data).then(() => {
        res.json({
            message: 'Usuário cadastrado com sucesso'
        })
    }).catch((e) => {
        res.json({
            message: 'Erro no servidor'
        })
    })
}

exports.updateUser = (id, data, res) =>  {
    User.findByPk(id).then(() => {
       User.update(data,  { where: { id: id }})
    }).then(() => {
        res.json({ message: 'Usuário alterado com sucesso' })
    }).catch((e) => {
        res.json({
            message: 'Erro no servidor'
        })
    })
}

exports.deleteUser = (id, res) => {
    User.findByPk(id).then(() => {
        User.destroy({ where: {id: id} })
    })
}

//Category
exports.insertCategory = (data, res) => {
    Category.create(data).then(() => {
        res.json({ message: 'Categoria cadastrada com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

exports.updateCategory = (id, data, res) => {
    Category.findByPk(id).then(() => {
        Category.update(data, {where: { id: id }}).then(() => {
            res.json({ message: 'Categoria atualizado com sucesso' })
        }).catch((e) => {
            res.json({ message:'Erro no servidor' })
        })
    })
}

exports.deleteCategory = (id, res) => {
    Category.findByPk(id).then(() => {
        Category.destroy({ where: { id: id } })
    }).then(() => {
        res.json({ message: 'Categoria deletada com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

exports.findCategory = (data, res) => {
    Category.findAll().then((category) => {
        category.forEach(function(name){
            console.log(name.dataValues.name)
          });
    })
}


//Post
exports.insertPost = (data, res) => {
    Post.create(data).then(() => {
        res.json({ message: 'Post cadastrado com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

exports.updatePost = (id, data, res) => {
    Post.findByPk(id).then(() => {
        Post.update(data, {where: { id: id }}).then(() => {
            res.json({ message: 'Post atualizado com sucesso' })
        }).catch((e) => {
            res.json({ message:'Erro no servidor' })
        })
    })
}

exports.deletePost = (id, res) => {
    Post.findByPk(id).then(() => {
        Post.destroy( {where: { id: id }}).then(() => {
            res.json({ message: 'Post deletado com sucesso' })
        }).catch((e) => {
            res.json({ message:'Erro no servidor' })
        })
    })
}
