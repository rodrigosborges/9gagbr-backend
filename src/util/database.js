const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const sequelize = new Sequelize(process.env.DBCONNECTION || 'mysql://root:@localhost:3306/9gagbr');

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
        token: {
            type: Sequelize.STRING(100),
            allowNull: true
        }
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
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
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

Reaction.belongsTo(Post, {
    as: 'post',
    foreignKey: 'post_id',
    constraints: false,
    onDelete: 'CASCADE',
})

Comment.belongsTo(Post, {
    as: 'post',
    foreignKey: 'post_id',
    constraints: false,
    onDelete: 'CASCADE',
})

Comment.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
    constraints: false
})

User.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'user_id',
    constraints: false
})

Post.hasMany(Comment, {
    as: 'comments',
    foreignKey: 'post_id',
    constraints: false,
    onDelete: 'CASCADE',
})

Post.hasMany(Reaction, {
    as: 'positives',
    foreignKey: 'post_id',
    constraints: false,
    onDelete: 'CASCADE',
})

Post.hasMany(Reaction, {
    as: 'negatives',
    foreignKey: 'post_id',
    constraints: false,
    onDelete: 'CASCADE',
})

Post.hasMany(Reaction, {
    as: 'reaction',
    foreignKey: 'post_id',
    constraints: false,
    onDelete: 'CASCADE',
})

Post.belongsTo(Category, {
    as: 'category',
    foreignKey: 'category_id',
    constraints: false
})

Post.belongsTo(User, {
    as: 'user',
    foreignKey: 'user_id',
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

exports.checkAuth = (data, res) => {
    User.findOne({
        where:{
            id: data.user_id,
            token: data.token
        }
    }).then((user) => {
        res.json(true)
    }).catch((e) => {
        res.json(false)
    })
}

exports.login = (data, res) => {
    User.findOne({
        where:{
            email: data.email
        }
    }).then((user) => {
        bcrypt.compare(data.password, user.password, function(err, response) {
            if (err){
                res.json({ message: 'E-mail ou senha incorretos' })
            }
            if (response){
                bcrypt.hash(user.email, 12).then(function(hash) {
                    user.update({token: hash})
                    res.json({
                        message: 'Login efetuado com sucesso',
                        token: hash,
                        user_id: user.id
                    })
                }).catch((e) => {
                    res.json({ message: 'E-mail ou senha incorretos' })
                })
            } else {
                return res.json({ message: 'E-mail ou senha incorretos' })
            }
        });
    }).catch((e) => {
        res.json({ message: 'E-mail ou senha incorretos' })
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
    Category.findAll({
        order: [
            ['name','ASC']
        ]
    }).then((categories) => {
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
        res.json({ message: 'Publicação cadastrada com sucesso' })
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}

exports.updatePost = (id, data, res) => {
    Post.findByPk(id).then(() => {
        Post.update(data, {where: { id: id }}).then(() => {
            res.json({ message: 'Publicação atualizada com sucesso' })
        }).catch((e) => {
            res.json({ message:'Erro no servidor' })
        })
    })
}

exports.findPostUser = (data, res) => {
    Post.findAll({ 
        where:  { user_id: data.user_id },  
        include: [
            {  
                model: Category, 
                as: 'category'
            },
            {  
                model: Reaction, 
                as: 'positives',
                attributes: ['id','user_id'],
                where: { positive: 1 },
                required:false
                
            },
            {  
                model: Reaction, 
                as: 'negatives',
                attributes: ['id','user_id'],
                where: { positive: 0 },
                required: false
            },
            {  
                model: Comment, 
                as: 'comments',
                required:false
            },

            ],
            order: [
                ['createdAt','DESC']
            ]
    }).then((posts) => {
        res.json({data: posts})
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
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
                attributes: ['id','user_id'],
                where: { positive: 1 },
                required:false
            },
            {  
                model: Reaction, 
                as: 'negatives',
                attributes: ['id','user_id'],
                where: { positive: 0 },
                required: false
            },
            {  
                model: Comment, 
                as: 'comments',
                required:false,
                include: {  
                    model: User, 
                    as: 'user',
                    attributes: ['name']
                },
            },
         ],
         order: [  
            [ { model: Comment, as: 'comments' }, 'createdAt', 'DESC'],  
          ],
    }).then((post) => {
        res.json(post)
    }).catch((e) => {
        res.json({ message: e })
    })
}

exports.paginate = ({ page, pageSize }) => {

    // const offset = ((page-1) * pageSize)+(page == 1 ? 0 : 1);
    // const limit = pageSize;

    return {
        offset,
        limit
    };
};

/**
 * listar posts por categoria 
 * em alta: posts que tiveram mais curtidas nas ultimas 24 horas
 * recentes: ordenar por data
 * quantidade curtidas, comentarios
 * 
 */
exports.listPost = (data, page, res) => {
    let pageSize = 5
    if(data){
        const Op = Sequelize.Op;
        if(data.data == 'Em alta'){
            Post.findAll({
                offset: ((page-1) * pageSize),
                limit: pageSize,
                attributes:[
                    "id",
                    "title",
                    "path",
                    "category_id",
                    "user_id",
                    "createdAt",
                    [sequelize.literal('(SELECT COUNT(*) as positivesCount FROM reactions WHERE reactions.post_id = posts.id AND positive = 1) - (SELECT COUNT(*) as negativesCount FROM reactions WHERE reactions.post_id = posts.id AND positive = 0)'), 'ReactionCount']
                ],
                include: [
                    {  
                        model: Category, 
                        as: 'category'
                    },
                    {  
                        model: Reaction, 
                        as: 'positives',
                        attributes: ['id','user_id'],
                        where: { positive: 1 },
                        required: false
                    },
                    {  
                        model: Reaction, 
                        as: 'negatives',
                        attributes: ['id','user_id'],
                        where: { positive: 0 },
                        required: false
                    },
                    {
                        model: Comment,
                        as: 'comments',
                        required:false
                    },
                ],
                order: [
                    [sequelize.literal('ReactionCount'), 'DESC'],
                    ['createdAt', 'DESC']
                ]
            }).then((posts) => {
               res.json({data:posts, page})
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
                offset: ((page-1) * pageSize),
                limit: pageSize,
                order: [['createdAt', 'DESC']],
                include: [
                    {  
                        model: Category, 
                        as: 'category'
                    },
                    {  
                        model: Reaction, 
                        as: 'positives',
                        attributes: ['id','user_id'],
                        where: { positive: 1 },
                        required: false
                    },
                    {  
                        model: Reaction, 
                        as: 'negatives',
                        attributes: ['id','user_id'],
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
                res.json({data:posts, page});
            }).catch((e) => {
                res.json({ message:'Erro no servidor' })
            });
        }else {
            Category.findOne({ where: {
                name: data.data,
            }}).then((category) => {
                Post.findAll({
                    offset: ((page-1) * pageSize),
                    where: [{ category_id: category.id}],
                    order: [['createdAt', 'DESC']],
                    include: [
                        {  
                            model: Category, 
                            as: 'category'
                        },
                        {  
                            model: Reaction, 
                            as: 'positives',
                            attributes: ['id','user_id'],
                            where: { positive: 1 },
                            required:false
                           
                        },
                        {  
                            model: Reaction, 
                            as: 'negatives',
                            attributes: ['id','user_id'],
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

exports.search = (data, page, res) => {
    let pageSize = 5
    const Op = Sequelize.Op
    Post.findAll({ 
        offset: ((page-1) * pageSize),
        where:  { title: { [Op.like]:'%' + data.search + '%' } },  
        include: [
            {  
                model: Category, 
                as: 'category'
            },
            {  
                model: Reaction, 
                as: 'positives',
                attributes: ['id','user_id'],
                where: { positive: 1 },
                required:false
               
            },
            {  
                model: Reaction, 
                as: 'negatives',
                attributes: ['id','user_id'],
                where: { positive: 0 },
                required: false
            },
            {  
                model: Comment, 
                as: 'comments',
                required:false
            },

         ],
         order: [
             ['createdAt','DESC']
         ]
    }).then((posts) => {
        res.json({data: posts})
    }).catch((e) => {
        res.json({ message: 'Erro no servidor' })
    })
}


exports.deletePost = (id, res) => {
    Post.findByPk(id).then(() => {
        Reaction.destroy({where: {post_id: id}})
        Comment.destroy({where: {post_id: id}})
        Post.destroy( {where: { id: id }}).then(() => {
            res.json({ message: 'Publicação deletada com sucesso' })
        }).catch((e) => {
            res.json({ message:'Erro no servidor' })
        })
    })
}

//Reaction
exports.makeReaction = (data, res) => {
    if(data.remove){
        Reaction.destroy({
            where:{
                user_id: data.user_id,
                post_id: data.post_id,
            }
        }).then(() => {
            res.json({ message: 'Reação deletada com sucesso' })
        }).catch(() => {
            res.json({ message: 'Erro no servidor' })
        })
    }else{
        Reaction.findOne({where:{
                user_id: data.user_id,
                post_id: data.post_id,
            }
        }).then((obj) => {
            if (obj)
                obj.update(data)
            else
                Reaction.create(data)

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