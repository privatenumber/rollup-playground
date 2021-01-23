import path from 'path';
import fs from 'fs';
import assert from 'assert';
import byteSize from 'byte-size';
import findUp from 'find-up';
import commentMark from 'comment-mark';
import outdent from 'outdent';

const cwd = process.cwd();

const code = string => `\`${string}\``;

function reportTemplate(report) {
	return report.map(file => outdent`
	### ${file.fileName}
	Size: ${code(file.sizeFormatted)}

	| Bundled-in modules (${file.modules.length}) |
	| - |
	${file.modules
		.map(m => `| ${code(m)} |`)
		.join('\n')}
	`).join('\n\n');
}

function reporterPlugin() {
	let directoryPath = cwd;

	function stripCwdPath(modulePath) {
		if (!modulePath.includes(directoryPath) && directoryPath === cwd) {
			const gitDirectoryPath = findUp.sync('.git', { type: 'directory' });
			if (gitDirectoryPath) {
				directoryPath = path.dirname(gitDirectoryPath);
			}
		}
		return modulePath.replace(directoryPath, '');
	}

	return {
		name: 'reporter-plugin',
		generateBundle(outputOptions, bundle) {
			const report = Object.entries(bundle)
				.map(([fileName, file]) => {
					const sizeBytes = Buffer.byteLength(file.code);
					const sizeFormatted = byteSize(sizeBytes).toString();
					const modules = Object.keys(file.modules).map(m => stripCwdPath(m));

					return {
						fileName,
						sizeBytes,
						sizeFormatted,
						modules,
					};
				});

			const readmePath = path.join(cwd, 'README.md');
			assert(fs.existsSync(readmePath), `README not found at: ${readmePath}`);
			let readmeString = fs.readFileSync(readmePath).toString();

			readmeString = commentMark(readmeString, {
				report: reportTemplate(report),
			});

			fs.writeFileSync(readmePath, readmeString);
		},
	};
}

export default reporterPlugin;
