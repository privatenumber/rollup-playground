import path from 'path';
import fs from 'fs';
import assert from 'assert';
import byteSize from 'byte-size';
import findUp from 'find-up';
import commentMark from 'comment-mark';
import outdent from 'outdent';
import markdownTable from 'markdown-table';

const cwd = process.cwd();

const code = string => `\`${string}\``;

function reportTemplate(report) {
	return report.map(file => outdent`
	### ${file.fileName}
	Size: ${code(file.sizeFormatted)}

	${file.modules.length ? markdownTable([
		[`Bundled-in modules (${file.modules.length})`, 'Size', 'Exports'],
		...file.modules.map(([modulePath, meta]) => [
			code(modulePath),
			code(byteSize(meta.renderedLength)),
			meta.renderedExports.map(exp => code(exp)).join(', '),
		]),
	]) : ''}

	${file.imports.length ? markdownTable([
		[`Imports (${file.imports.length})`],
		...file.imports.map(m => [code(m)]),
	]) : ''}

	${file.dynamicImports.length ? markdownTable([
		[`Dynamic Imports (${file.dynamicImports.length})`],
		...file.dynamicImports.map(m => [code(m)]),
	]) : ''}
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
		generateBundle(_, bundle) {
			const report = Object.entries(bundle)
				.map(([fileName, file]) => {
					const sizeBytes = Buffer.byteLength(file.code);
					const sizeFormatted = byteSize(sizeBytes).toString();
					const modules = Object.entries(file.modules).map((
						[modulePath, meta]) => [stripCwdPath(modulePath), meta]
					);

					return {
						fileName,
						sizeBytes,
						sizeFormatted,
						modules,
						imports: file.imports,
						dynamicImports: file.dynamicImports,
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
