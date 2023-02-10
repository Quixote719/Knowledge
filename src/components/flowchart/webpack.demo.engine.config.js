const path = require('path')
const ExtractTextWebapckPlugin = require('extract-text-webpack-plugin') //CSS文件单独提取出来
module.exports = {
    entry: __dirname + '/example/engine/index.js', // 入口文件
    output: {
        // 出口文件
        path: __dirname + '/example/engine', // 出口文件位置，一定要是绝对路径
        filename: 'dist.js' // 出口文件名
    },
    resolve: {
        extensions: ['.js', '.css', '.json'],
        alias: {} //配置别名可以加快webpack查找模块的速度
    },
    module: {
        // 多个loader是有顺序要求的，从右往左写，因为转换的时候是从右往左转换的
        rules: [
            {
                test: /\.less$/,
                use: ExtractTextWebapckPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'less-loader']
                }),
                include: path.join(__dirname, 'src'),
                exclude: /node_modules/
            },
            {
                test: /\.(css)$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.js?$/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        //同时可以把babel配置写到根目录下的.babelrc中
                        presets: ['env', 'stage-0'] // env转换es6 stage-0转es7
                    }
                }
            },
            {
                //file-loader 解决css等文件中引入图片路径的问题
                // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        outputPath: 'images/', // 图片输出的路径
                        limit: 1 * 1024
                    }
                }
            }
        ]
    }
}
