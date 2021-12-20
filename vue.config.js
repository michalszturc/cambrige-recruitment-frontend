module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/app/" : "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost",
        changeOrigin: true,
      },
    },
  },
};
