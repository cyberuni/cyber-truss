import { Command, type CommanderError } from 'commander'
import { EXIT_USAGE, TrussError } from './cli-error.js'
import { setOutputFormat } from './output.js'
import { readPackageVersion } from './version.js'

/**
 * The CLI shell: global options, usage-error handling, and the command tree.
 *
 * Built as a function rather than a module-level singleton so tests can drive a fresh
 * program without touching `process.argv` or exiting the runner.
 */
export function createProgram(version: string = readPackageVersion()): Command {
	const program = new Command()

	program
		.name('truss')
		.description('The convergence layer — holds a repository in its settled state across every change')
		.version(version, '-v, --version')
		.option('--json', 'emit JSON instead of human-readable text')
		.hook('preAction', (command) => {
			if (command.opts().json) setOutputFormat('json')
		})

	// Commander's default is to print and call process.exit itself. Turning both off
	// routes an unknown flag or subcommand through the same top-level catch as every
	// other failure, so exit codes are decided in one place.
	program.exitOverride((error: CommanderError) => {
		if (
			error.code === 'commander.version' ||
			error.code === 'commander.help' ||
			error.code === 'commander.helpDisplayed'
		) {
			throw error
		}
		throw new TrussError(error.message, { exitCode: EXIT_USAGE, cause: error })
	})
	program.configureOutput({ writeErr: () => {} })

	return program
}
