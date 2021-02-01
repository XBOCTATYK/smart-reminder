const path = require('path');

const rootPath = process.cwd();

module.exports = {
    rootPath: process.cwd(),
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            Src: path.join(rootPath, './src/'),
            Models: path.join(rootPath, './src/models'),
            Services: path.join(rootPath, './src/services'),
            Types: path.join(rootPath, './src/types'),
            Constants: path.join(rootPath, './src/constants'),
            Utils: path.join(rootPath, './src/utils'),
            Repository: path.join(rootPath, './src/infractructure/repository'),
            Domain: path.join(rootPath, './src/domain'),
            DTO: path.join(rootPath, './src/infractructure/DTO'),
            Decorators: path.join(rootPath, './src/infractructure/decorators'),
        }
    }
};
