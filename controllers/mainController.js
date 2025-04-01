const Post = require('../server/model/Post');
const main_index = async (req, res) => {
    const locals ={
        title: 'NodeBlog',
        description: 'A blog built with Node.js, Express, and MongoDB',
        posts: []
    }
    let perPage = 2;
    let page = req.query.page || 1;
    try {
        const posts = await Post.aggregate([{ $sort: { createdAt: -1 }}])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
        locals.posts = posts;
        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= (count / perPage);
        res.render('index', {
            locals,
            nextPage,
            hasNextPage,
            currentRoute: '/'
        });
    } catch (err) {
        console.log(err);
    }
}

const main_about = (req, res) => {  
    const locals ={
        title: 'About',
        description: 'About Page'
    }
    res.render('about', { locals, currentRoute: '/about' });
}

const main_post = async (req, res) => { 
    try{
        const post = await Post.findOne({ _id: req.params.id });         
        const locals = {
            title: post.title,
            description: 'Post Page'
        }
        res.render('post', { locals, post, currentRoute: `/post/${req.params.id}` });
    }catch(error){
        console.log(error);
    }
}

const main_search = async (req, res) => {
    try{
        const locals = {
            title: 'Search',
            description: 'Search Page'
        }
        const searchTerm = req.body.searchTerm
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, '');
        console.log(searchNoSpecialChars);
        const posts = await Post.find(
            { $or: [
                { title: { $regex: '.*' + searchNoSpecialChars + '.*' } },
                { body: { $regex: '.*' + searchNoSpecialChars + '.*' } }
            ]}
        );
        res.render('search', { locals, posts, currentRoute: '/search' });
    }catch(error){
        console.log(error);
    }
}
module.exports = {
    main_index,
    main_about,
    main_post,
    main_search
}
