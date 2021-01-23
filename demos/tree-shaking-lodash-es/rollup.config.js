import { nodeResolve } from '@rollup/plugin-node-resolve';
import reporterPlugin from '../../utils/reporter-plugin.js';

const rollupConfig = {
	input: 'src/index.js',
	plugins: [
		nodeResolve(),
		reporterPlugin(),
	],
	output: {
		format: 'es',
		file: 'dist/index.js',
	},
};

export default rollupConfig;
