const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

// Tạo config cho tất cả các template wedding
const weddingTemplates = Array.from({ length: 13 }, (_, i) => i + 1).map((num) => {
  return new HtmlWebpackPlugin({
    template: `./template/wedding${num}/index.html`,
    filename: `template/wedding${num}/index.html`,
    chunks: [`wedding${num}`],
  });
});

// Config cho các template custom
const customTemplates = [
  new HtmlWebpackPlugin({
    template: "./template/wedding4-custome1/index.html",
    filename: "template/wedding4-custome1/index.html",
    chunks: ["wedding4-custome1"],
  }),
  new HtmlWebpackPlugin({
    template: "./template/wedding6-custome1/index.html",
    filename: "template/wedding6-custome1/index.html",
    chunks: ["wedding6-custome1"],
  }),
];

// Tạo patterns cho CopyPlugin
const weddingPatterns = Array.from({ length: 13 }, (_, i) => i + 1).flatMap((num) => [
  {
    from: `template/wedding${num}/css`,
    to: `template/wedding${num}/css`,
    noErrorOnMissing: true,
  },
  {
    from: `template/wedding${num}/js`,
    to: `template/wedding${num}/js`,
    noErrorOnMissing: true,
  },
]);

const customPatterns = [
  {
    from: "template/wedding4-custome1/css",
    to: "template/wedding4-custome1/css",
    noErrorOnMissing: true,
  },
  {
    from: "template/wedding4-custome1/js",
    to: "template/wedding4-custome1/js",
    noErrorOnMissing: true,
  },
  {
    from: "template/wedding6-custome1/css",
    to: "template/wedding6-custome1/css",
    noErrorOnMissing: true,
  },
  {
    from: "template/wedding6-custome1/js",
    to: "template/wedding6-custome1/js",
    noErrorOnMissing: true,
  },
];

module.exports = {
  entry: {
    main: "./home/index.html",
    // Thêm entry points cho mỗi template
    ...Array.from({ length: 13 }, (_, i) => ({
      [`wedding${i + 1}`]: `./template/wedding${i + 1}/index.html`,
    })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
    "wedding4-custome1": "./template/wedding4-custome1/index.html",
    "wedding6-custome1": "./template/wedding6-custome1/index.html",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true,
            sources: {
              list: [
                {
                  tag: "img",
                  attribute: "src",
                  type: "src",
                  filter: (tag, attribute, attributes) => {
                    if (!attributes.src) {
                      return false;
                    }
                    return true;
                  },
                },
              ],
            },
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "fonts/[hash][ext][query]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./home/index.html",
      filename: "index.html",
      chunks: ["main"],
    }),
    ...weddingTemplates,
    ...customTemplates,
    new CopyPlugin({
      patterns: [
        {
          from: "home/css",
          to: "css",
          noErrorOnMissing: true,
        },
        {
          from: "home/js",
          to: "js",
          noErrorOnMissing: true,
        },
        ...weddingPatterns,
        ...customPatterns,
      ],
    }),
  ],
};
