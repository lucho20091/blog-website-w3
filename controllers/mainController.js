
const main_index = (req, res) => {
    res.render('index');
}

const main_about = (req, res) => {
    res.render('about');
}

module.exports = {
    main_index,
    main_about
}
