const path = require("path");
const fs = require("fs");

const CopyWebpackPlugin = require("copy-webpack-plugin");
// const ImageminPlugin = require('imagemin-webpack-plugin').default;

// Переменные для путей
const PATH_SRC = path.join(__dirname, "./src");
const PATH_BUILD = path.join(__dirname, "./build");
const PATH_ASSETS = path.join(__dirname, "./src/assets/");
const PATH_COMPONENTS = path.join(__dirname, "./src/assets/components/");

// Переменные для HtmlWebpackPlugin
const PAGES_DIR = path.join(__dirname, "./src/pages"); // путь к html-файлам
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith(".html"));

module.exports = {
    // BASE config
    context: path.resolve(__dirname, "src"),

    externals: {
        // нужно для получения доступа к константе из других конфигов
        paths_src: PATH_SRC,
        paths_build: PATH_BUILD,
        paths_assets: PATH_ASSETS,
        paths_components: PATH_COMPONENTS,
        paths_dir: PAGES_DIR,
        paths_pages: PAGES,
    },
    output: {
        path: PATH_BUILD, // папка куда кладем
        publicPath: "/", // относительная ссылка на файл который будет подставляться из браузера
        filename: `js/[name].[chunkhash].js`, // имя файла
    },

    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                default: false,
                vendor: {
                    name: "vendors",
                    // name(module) {
                    //     // получает имя, то есть node_modules/packageName/not/this/part.js
                    //     // или node_modules/packageName
                    //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                    //     // имена npm-пакетов можно, не опасаясь проблем, использовать
                    //     // в URL, но некоторые серверы не любят символы наподобие @
                    //     return `npm.${packageName.replace('@', '')}`;
                    // },
                    test: /node_modules/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },

    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg|webp|ico)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]?[hash]",
                },
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                loader: "file-loader",
                options: {
                    name: "[path][name].[ext]?[hash]",
                },
            },
            {
                test: /\.xml$/,
                use: ["xml-loader"],
            },
            {
                test: /\.csv$/,
                use: ["csv-loader"],
            },
        ],
    },
    resolve: {
        modules: ["node_modules"],
        extensions: ["*", ".js", ".css", ".scss"],
        alias: {
            "@": path.resolve(__dirname, "src"),
            // "@core": path.resolve(__dirname, "src/core"),
        },
    },

    resolveLoader: {
        modules: ["node_modules"],
        extensions: ["*", ".js", ".css", ".scss"],
    },

    plugins: [
        new CopyWebpackPlugin([
            {
                from: `${PATH_ASSETS}/img`,
                to: `img`,
            },
            {
                from: `${PATH_ASSETS}/fonts`,
                to: `fonts`,
            },
            {
                from: `${PATH_SRC}/static`,
                to: ``,
            },
        ]),

        // new ImageminPlugin()
    ],
};
