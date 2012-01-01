module.exports = [
    // fake the db-level api for pushing design docs,
    // stripping the leading '_design/' part of the id
    {from: '/upload/_design/:name', to: '../../:name'},
    {from: '/upload/:name', to: '../../:name'},
    {from: '/upload', to: '../..'},
    {from: '/', to: '_list/app_list/apps'},
    {from: '/static/*', to: 'static/*'},
    {from: '*', to: '_show/not_found'}
];
