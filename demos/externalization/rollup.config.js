import reporterPlugin from '../../utils/reporter-plugin.js';

const rollupConfig = {
	input: 'src/index.js',
	plugins: [
		reporterPlugin(),
	],
	external: ['lodash-es'],
	output: {
		dir: 'dist',
		format: 'es',
	},
};

export default rollupConfig;
