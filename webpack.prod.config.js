const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const PurgecssPlugin = require("purgecss-webpack-plugin")

const baseWebpackConfig = require("./webpack.base.config");

const buildWebpackConfig = merge(baseWebpackConfig, {
    mode: "production",
    entry: {
        polyfill: '@babel/polyfill',
        app: "./app.js",
    },
    optimization: {
        moduleIds: "hashed",
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false,
            }),
        ],
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: "/node_modules/", // исключаем, тк библиотеки прогоняются через бабель
                use: [
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
                        loader: "thread-loader",
                        options: {
                            workerParallelJobs: 50,
                            poolRespawn: false,
                            name: "css",
                        },
                    },
                    "css-loader",
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: "thread-loader",
                        options: {
                            workerParallelJobs: 50,
                            poolRespawn: false,
                            name: "css",
                        },
                    },
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            config: {
                                path: `./postcss.config.js`,
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            data: ['@import "./_utils/_variables.scss";'],
                            includePaths: [path.resolve(__dirname, "./src/assets/scss/")],
                        },
                    },
                    "webpack-import-glob-loader",
                ],
            },
        ],
    },

    plugins: [
        new CleanWebpackPlugin(),

        new webpack.HashedModuleIdsPlugin({
            hashFunction: "md4",
            hashDigest: "base64",
            hashDigestLength: 8,
        }),

        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ru/),

        new MiniCssExtractPlugin({
            filename: `css/[name].[contenthash].css`,
        }),

        // Automatic creation any html pages (Don't forget to RERUN dev server)
        ...baseWebpackConfig.externals.paths_pages.map(
            (page) =>
                new HtmlWebpackPlugin({
                    template: `${baseWebpackConfig.externals.paths_dir}/${page}`,
                    filename: `./${page}`,
                    minify: {
                        removeComments: true,
                        collapseWhitespace: true,
                    },
                }),
        )

        // new PurgecssPlugin({
        //     paths: glob.sync([
        //         path.join(__dirname, './src/pages/*.html'),
        //         path.join(__dirname, './src/assets/js/*.js'),
        //         path.join(__dirname, './src/save/*.php')
        //     ], {
        //         nodir: true
        //     }),
        //     whitelist: ["html", "body"]
        // })
    ],
});

// eslint-disable-next-line no-unused-vars
module.exports = new Promise((resolve, reject) => {
    resolve(buildWebpackConfig);
});
