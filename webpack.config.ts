import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

interface EnvOptions {
  mode: 'production' | 'development';
  port: number;
}

export default (env: EnvOptions) => {
  const isDev = env.mode === 'development';
  const config: webpack.Configuration = {
    mode: env.mode ?? 'development',
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
      path: path.resolve(__dirname, './dist/'),
      filename: 'bundle-[contenthash:8].js',
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: path.resolve(__dirname, './public/index.html') }),
      isDev ? new webpack.ProgressPlugin() : undefined,
      !isDev
        ? new MiniCssExtractPlugin({
            filename: '[name]-[contenthash:8].css',
            chunkFilename: '[name]-[contenthash:8].css',
          })
        : undefined,
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        },
        {
          test: /\.css$/i,
          use: [isDev ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: isDev ? 'inline-source-map' : undefined,
    devServer: isDev
      ? {
          port: env.port ?? 3000,
          open: true,
        }
      : undefined,
  };

  return config;
};
