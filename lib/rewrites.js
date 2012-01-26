module.exports = [
    // fake the db-level api for pushing design docs,
    // stripping the leading '_design/' part of the id
    {from: '/upload/_design/:name', to: '../../:name'},
    {from: '/upload/:name', to: '../../:name'},
    {from: '/upload', to: '../..'},

    {from: '/', to: '_list/home/apps'},
    {from: '/all', to: '_list/category_page/apps', query: {category: 'all'}},
    {
        from: '/category/:category',
        to: '_list/category_page/apps_by_category', query: {
            startkey: [':category'],
            endkey: [':category', {}],
            reduce: 'false',
            sort: 'alphabetical'
        }
    },
    {
        from: '/user/:user',
        to: '_list/user_page/apps_by_user', query: {
            startkey: [':user'],
            endkey: [':user', {}],
            sort: 'alphabetical'
        }
    },
    {from: '/upload_app', to: '_show/upload_app'},
    {from: '/details/:name', to: '_list/app_details/apps', query: {
        key: [':name']
    }},
    {from: '/details/:name/install.sh', to: '_show/install_script/:name'},
    {from: '/details/:name/json', to: '_show/kanso_details/:name'},
    {from: '/details/:name/ddoc', to: '../../:name'},
    {from: '/static/*', to: 'static/*'},
    {from: '*', to: '_show/not_found'}
];
