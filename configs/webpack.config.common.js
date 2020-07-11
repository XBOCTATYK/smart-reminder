const path = require('path');

const rootPath = process.cwd();

module.exports = {
    rootPath: process.cwd(),
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            Src: path.join(rootPath, './src/'),
            Models: path.join(rootPath, './src/models'),
        }
    }
};
