const merge = require("webpack-merge");
const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const UnusedWebpackPlugin = require("unused-webpack-plugin");

const cacheDir = path.resolve(__dirname, "node_modules", ".cache");

const baseWebpackConfig = require("./webpack.base.config");

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: "development",
    devtool: "cheap-module-eval-source-map",
    entry: {
        polyfill: '@babel/polyfill',
        app: "./app.js",
    },
    output: {
        filename: `js/[name].js`, // имя файла.
    },
    devServer: {
        // настройки дев серва
        host: "localhost", // default
        contentBase: baseWebpackConfig.externals.paths_src,
        // watchContentBase: true,
        port: "8081", // 8080 по дефолту (у докера такой же), поэтому заменил порт
        overlay: {
            warnings: true,
            errors: true,
        },
        progress: true,
        inline: true,
        quiet: true,
        compress: true,
        historyApiFallback: true,
        hot: false,
        open: true,
    },

    // Пересборка при изменениях и уменьшение задержки перед ней
    watch: true,
    watchOptions: {
        aggregateTimeout: 100,
    },

    module: {
        rules: [
            {
                test: /\.js$/, // какие файлы обрабатывать
                exclude: "/node_modules/", // исключаем тк библиотеки прогоняются через бабель
                use: [
                    {
                        loader: "cache-loader",
                        options: {
                            cacheDirectory: path.resolve(cacheDir, "js"),
                        },
                    },
                    {
                        loader: "thread-loader",
                        options: {
                            workerParallelJobs: 50,
                            poolRespawn: false,
                            name: "js",
                        },
                    },
                    {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                            cacheDirectory: path.resolve(cacheDir, "babel"),
                        },
                    },
                    "webpack-import-glob-loader",
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true,
                        },
                    },
                    {
                        loader: "cache-loader",
                        options: {
                            cacheDirectory: path.resolve(cacheDir, "css"),
                        },
                    },
                    {
                        loader: "thread-loader",
                        options: {
                            workerParallelJobs: 50,
                            poolRespawn: false,
                            name: "css",
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: true,
                            reloadAll: true,
                        },
                    },
                    {
                        loader: "cache-loader",
                        options: {
                            cacheDirectory: path.resolve(cacheDir, "scss"),
                        },
                    },
                    {
                        loader: "thread-loader",
                        options: {
                            workerParallelJobs: 50,
                            poolRespawn: false,
                            name: "scss",
                        },
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                            data: ['@import "./_variables.scss";'],
                            includePaths: [path.resolve(__dirname, "./src/assets/scss/_utils/")],
                        },
                    },
                    "webpack-import-glob-loader",
                ],
            },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        new MiniCssExtractPlugin({
            filename: `css/[name].css`,
        }),

        new UnusedWebpackPlugin({
            directories: [path.join(__dirname, "./assets/js/")],
            root: __dirname,
            failOnUnused: true,
        }),

        // Automatic creation any html pages (Don't forget to RERUN dev server)
        ...baseWebpackConfig.externals.paths_pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    template: `${baseWebpackConfig.externals.paths_dir}/${page}`,
                    filename: `./${page}`,
                }),
        )
    ],
});

module.exports = new Promise((resolve, reject) => {
    resolve(devWebpackConfig);
});
