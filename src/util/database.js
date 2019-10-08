const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
//sqlite
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './src/util/database.sqlite3',
//     dialectOptions: {
//         "timezone": "Europe/Warsaw"
//     }
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
          beforeCreate: hashPassword,
          beforeBulkUpdate: hashPasswordUpdate
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
            allowNull: false
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
            allowNull: false,
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
            allowNull: false,
        }
    }, 
)

Reaction.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
    constraints: false
})

Comment.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
    constraints: false
})

Post.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'post_id',
    constraints: false
})

Post.hasMany(Reaction, {
    as: 'positives',
    foreignKey: 'post_id',
    constraints: false
})

Post.hasMany(Reaction, {
    as: 'negatives',
    foreignKey: 'post_id',
    constraints: false
})

Post.hasMany(Reaction, {
    as: 'reaction',
    foreignKey: 'post_id',
    constraints: false
})

Post.belongsTo(Category, {
    as: 'category',
    foreignKey: 'category_id',
    constraints: false
})

async function hashPassword(user, options) {
    user.password = await bcrypt.hash(user.password, 12);
}

async function hashPasswordUpdate(user, option) {
    user.attributes.password = await bcrypt.hash(user.attributes.password, 12);
}

//atualiza os models com o banco
// sequelize.sync()

// USER
exports.insertUser = (data, res) => {
    User.create(data).then(() => {
        res.json({ message: 'Usuario cadastrado com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

exports.updateUser = (id, data, res) => {
    User.findByPk(id).then(() => {
        User.update(data, {where: { id: id }}).then(() => {
            res.json({ message: 'Usuario atualizado com sucesso' })
        }).catch((e) => {
            res.json({ message: 'Erro no servidor' })
        })
    })
}

exports.deleteUser = (id, res) => {
    User.findByPk(id).then(() => {
        User.destroy({ where: { id: id } })
    }).then(() => {
        res.json({ message: 'Usuario deletado com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
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

exports.listCategory = (res) => {
    Category.findAll().then((categories) => {
        res.json({data:categories});
      }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
      });
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

exports.findPost = (id, res) => {
    Post.findOne({ 
        where:  { 
            id: id.id
        },  
        include: [
            {  
                model: Category, 
                as: 'category'
            },
            {  
                model: Reaction, 
                as: 'positives',
                attributes: ['id'],
                where: { positive: 1 },
                required:false
               
            },
            {  
                model: Reaction, 
                as: 'negatives',
                attributes: ['id'],
                where: { positive: 0 },
                required: false
            },
            {  
                model: Comment, 
                as: 'comments',
                required:false
            },

         ],
    }).then((post) => {
            res.json({post})
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

/**
 * listar posts por categoria 
 * em alta: posts que tiveram mais curtidas nas ultimas 24 horas
 * recentes: ordenar por data
 * quantidade curtidas, comentarios
 * 
 */
exports.listPost = (data, res) => {
    if(data){
        const Op = Sequelize.Op;
        if(data.data == 'Em alta'){
            Post.findAll({
                include: [
                    {  
                        model: Category, 
                        as: 'category'
                    },
                    {  
                        model: Reaction, 
                        as: 'positives',
                        attributes: ['id'],
                        required:false
                    },
                    {  
                        model: Reaction, 
                        as: 'negatives',
                        attributes: ['id'],
                        required: false
                    },
                    {
                        model: Comment,
                        as: 'comments',
                        required:false
                    },
                    {
                        model: Reaction,
                        as: 'reaction'
                    }
                 ],
                 order: [
                    //['reaction', 'updatedAt', 'DESC'],
                
                ],
            }).then((post) => {
                res.json({data:post});
            }).catch((e) => {
                res.json({ message: e })
            });
        }else if(data.data == 'Aleatório'){
            Post.findOne({ 
                order: Sequelize.literal('rand()'), limit: 1,               
            }).then((posts) => {
                res.json(posts.id);
            }).catch((e) => {
                res.json({ message:'Erro no servidor' })
            });
        }else if(data.data == 'Recentes' || data.data == undefined){
            Post.findAll({
                order: [['createdAt', 'DESC']],
                include: [
                    {  
                        model: Category, 
                        as: 'category'
                    },
                    {  
                        model: Reaction, 
                        as: 'positives',
                        attributes: ['id'],
                        where: { positive: 1 },
                        required: false
                    },
                    {  
                        model: Reaction, 
                        as: 'negatives',
                        attributes: ['id'],
                        where: { positive: 0 },
                        required: false
                    },
                    {
                        model: Comment,
                        as: 'comments',
                        required:false
                    }
                 ],
            }).then((posts) => {
                res.json({data:posts});
            }).catch((e) => {
                res.json({ message:'Erro no servidor' })
            });
        }else {
            Category.findOne({ where: {
                name: data.data,
            }}).then((category) => {
                Post.findAll({
                    where: [{ category_id: category.id}],
                    include: [
                        {  
                            model: Category, 
                            as: 'category'
                        },
                        {  
                            model: Reaction, 
                            as: 'positives',
                            attributes: ['id'],
                            where: { positive: 1 },
                            required:false
                           
                        },
                        {  
                            model: Reaction, 
                            as: 'negatives',
                            attributes: ['id'],
                            where: { positive: 0 },
                            required: false
                        },
                        {  
                            model: Comment, 
                            as: 'comments',
                            required:false
                        },

                     ],
                }).then((posts) => {
                    res.json({data:posts});
                }).catch((e) => {
                    res.json({ message:'Erro no servidor' })
                });

            }).catch((e) => {
                res.json({ message:'Erro no servidor' })
            })
        }
    }  
}
/**
 * Funcao de busca: nome do post
*/

exports.search = (data, res) => {
    const Op = Sequelize.Op
    Post.findAll({ 
        where:  { title: { [Op.like]:'%' + data.search + '%' } },  
        include: [
            {  
                model: Category, 
                as: 'category'
            },
            {  
                model: Reaction, 
                as: 'positives',
                attributes: ['id'],
                where: { positive: 1 },
                required:false
               
            },
            {  
                model: Reaction, 
                as: 'negatives',
                attributes: ['id'],
                where: { positive: 0 },
                required: false
            },
            {  
                model: Comment, 
                as: 'comments',
                required:false
            },

         ],
    }).then((posts) => {
        res.json({data: posts})
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
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

//Reaction
exports.makeReaction = (data, res) => {
    if(data.remove){
        Reaction.findByPk(data.id).then(() => {
            Reaction.destroy({ where: {id: data.id} }).then(() => {
                res.json({ message: 'Reação deletada com sucesso' })
            }).catch(() => {
                res.json({ message: 'Erro no servidor' })
            })
        })
    }else{
        Reaction.create(data).then(() => {
            res.json({ message: 'Reação cadastrada com sucesso' })
        }).catch((e) => {
            res.json({ message: 'Erro no servidor' })
        })
    } 
}

exports.countReaction = (id, res) => {
    Reaction.count({
        where: {
            post_id: id.post_id,
        }
    }).then(function(posts){
        res.json({data:posts});
        }).catch((e) => {
        res.json({ message:'Erro no servidor' })
    });
}

//Comment
exports.insertComment = (data, res) => {
    Comment.create(data).then(() => {
        res.json({ message: 'Post comentado com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

exports.updateComment = (id, data, res) => {
    Comment.findByPk(id).then(() => {
        Comment.update(data, { where: { id: id } }).then(() => {
            res.json({ message: 'Comentario atualizado com sucesso' })
        }).catch((e) => {
            res.json({ message: 'Erro no servidor' })
        })
    })
}

exports.deleteComment = (id, res) => {
    Comment.findByPk(id).then(() => {
        Comment.destroy({ where: { id: id } }).then(() => {
            res.json({ message: 'Comentario deletado com sucesso' })
        }).catch((e) => {
            res.json({ message: 'Erro no servidor' })
        })
    })
}
