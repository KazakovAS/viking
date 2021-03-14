/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */
module.exports = {
    plugins: [
        require("autoprefixer")({
            grid: "autoplace",
        }),
        require("cssnano")({
            preset: [
                "default",
                {
                    discardComments: {
                        removeAll: true,
                    },
                },
            ],
        }),
        require("postcss-flexbugs-fixes"),
    ],
};
