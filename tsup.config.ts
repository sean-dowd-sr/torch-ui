import { defineConfig } from 'tsup'
import * as preset from 'tsup-preset-solid'

const preset_options: preset.PresetOptions = {
	entries: [
		{
			entry: 'src/index.tsx',
		},
		{
			name: 'actions',
			entry: 'src/components/actions/index.tsx',
		},
		{
			name: 'forms',
			entry: 'src/components/forms/index.tsx',
		},
		{
			name: 'feedback',
			entry: 'src/components/feedback/index.tsx',
		},
		{
			name: 'data-display',
			entry: 'src/components/data-display/index.tsx',
		},
		{
			name: 'navigation',
			entry: 'src/components/navigation/index.tsx',
		},
		{
			name: 'overlays',
			entry: 'src/components/overlays/index.tsx',
		},
		{
			name: 'layout',
			entry: 'src/components/layout/index.tsx',
		},
		{
			name: 'typography',
			entry: 'src/components/typography/index.tsx',
		},
		{
			name: 'charts',
			entry: 'src/components/charts/index.tsx',
		},
	],
	drop_console: true,
	cjs: false,
}

const CI =
	process.env['CI'] === 'true' ||
	process.env['GITHUB_ACTIONS'] === 'true' ||
	process.env['CI'] === '"1"' ||
	process.env['GITHUB_ACTIONS'] === '"1"'

export default defineConfig((config) => {
	const watching = !!config.watch

	const parsed_options = preset.parsePresetOptions(preset_options, watching)

	if (!watching && !CI) {
		const package_fields = preset.generatePackageExports(parsed_options)
		for (const key of Object.keys(package_fields.exports)) {
			const exp = package_fields.exports[key]
			if (!exp || typeof exp !== 'object') continue
			const solid = (exp as any).solid
			const importDefault = (exp as any).import?.default
			if (typeof solid === 'string' && typeof importDefault === 'string') {
				;(exp as any).solid = importDefault
			}
		}

		// Inject CSS exports that the preset doesn't know about
		package_fields.exports['./styles/theme.css'] = {
			style: './dist/styles/theme.css',
			default: './dist/styles/theme.css',
		}
		package_fields.exports['./styles/code-block-tokens.css'] = {
			style: './dist/styles/code-block-tokens.css',
			default: './dist/styles/code-block-tokens.css',
		}

		console.log(`\npackage.json exports:\n${JSON.stringify(package_fields, null, 2)}\n`)
		preset.writePackageJson(package_fields)
	}

	const tsupOptions = preset.generateTsupOptions(parsed_options)

	// Force .js extension for the compiled ESM build (preset writes .js paths but tsup defaults to .mjs).
	// Leave the solid build alone — it outputs .jsx with preserved JSX and has its own outExtension.
	return tsupOptions.map((opt: any) => {
		const external = Array.isArray(opt.external) ? opt.external : []
		const solidExternal = [
			'solid-js',
			'solid-js/web',
			'solid-js/store',
			'solid-js/html',
		]
		const mergedExternal = Array.from(new Set([...external, ...solidExternal]))

		const isPreservedJsx =
			opt.esbuildOptions?.jsx === 'preserve' ||
			(typeof opt.outExtension === 'function' &&
				opt.outExtension({ format: 'esm' })?.js === '.jsx')
		if (isPreservedJsx) return { ...opt, external: mergedExternal }
		return { ...opt, external: mergedExternal, outExtension: () => ({ js: '.js' }) }
	})
})
