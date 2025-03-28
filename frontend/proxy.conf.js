module.exports = {
    "/next-netbase-api": {
        target:
            process.env["services__netbaseapi__http__0"] ||
            process.env["services__netbaseapi__https__0"],
        secure: process.env["NODE_ENV"] !== "development",
        pathRewrite: {
            "^/next-netbase-api": "/v1",
        },
    }
};
