import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import reporterPlugin from '../../utils/reporter-plugin.js';

const rollupConfig = {
	input: 'src/index.js',
	plugins: [
		nodeResolve(),
		commonjs(),
		reporterPlugin(),
	],
	output: {
		format: 'es',
		file: 'dist/index.js',
	},
};

export default rollupConfig;
