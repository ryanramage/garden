module.exports = [
    // fake the db-level api for pushing design docs,
    // stripping the leading '_design/' part of the id
    {from: '/upload/_design/:name', to: '../../:name'},
    {from: '/upload/:name', to: '../../:name'},
    {from: '/upload', to: '../..'}
];
