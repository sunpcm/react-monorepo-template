const { merge }  = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')


module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].[contenthash].js',
		clean: true,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css'
		}),
		new BundleAnalyzerPlugin({
			// analyzerMode: 'server', // 默认模式：启动一个 HTTP 服务器展示
			analyzerMode: 'static', // 推荐模式：生成一个 HTML 文件 (不占用端口，方便查看)
			openAnalyzer: true,     // 构建完自动打开浏览器
			reportFilename: 'bundle-report.html', // 生成的文件名
		}),
	],
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader'
				]
			}
		]
	},
	optimization: {
		splitChunks: {
			chunks: 'all'
			// 默认情况下，Webpack 会把 node_modules 里的东西单独打包成 vendors
		}
	}
})