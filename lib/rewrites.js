module.exports = [
    // fake the db-level api for pushing design docs,
    // stripping the leading '_design/' part of the id
    {from: '/upload/_design/:name', to: '../../:name'},
    {from: '/upload/:name', to: '../../:name'},
    {from: '/upload', to: '../..'},

    {from: '/', to: '_list/app_list/apps'},
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
