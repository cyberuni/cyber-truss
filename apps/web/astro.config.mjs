import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
	site: 'https://cyberuni.github.io',
	base: '/cyber-truss',
	integrations: [
		starlight({
			title: 'cyber-truss',
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/cyberuni/cyber-truss',
				},
			],
			sidebar: [
				{ label: 'What is cyber-truss', link: '/what-is-cyber-truss/' },
				{ label: 'Getting Started', link: '/getting-started/' },
				{
					label: 'The lattice model',
					items: [
						{ label: 'The lattice', link: '/model/lattice/' },
						{ label: 'Model overview', link: '/model/' },
						{ label: 'Artifact-sets', link: '/model/artifact-sets/' },
						{ label: 'Specification', link: '/model/specification/' },
						{ label: 'Connections', link: '/model/connections/' },
						{ label: 'Join', link: '/model/join/' },
						{ label: 'Workflow', link: '/model/workflow/' },
						{ label: 'Confluence', link: '/model/confluence/' },
						{ label: 'Canonical execution', link: '/model/canonical-execution/' },
						{ label: 'Relationship to SDD', link: '/model/relationship-to-sdd/' },
						{
							label: 'Formal workflows',
							items: [
								{ label: 'The catalog', link: '/model/workflows/' },
								{ label: 'Waterfall in the model', link: '/model/workflows/waterfall/' },
							],
						},
						{ label: 'Open questions', link: '/model/open-questions/' },
						{ label: 'Glossary', link: '/model/glossary/' },
					],
				},
				{
					label: 'Examples',
					items: [{ autogenerate: { directory: 'examples' } }],
				},
				{
					label: 'CLI',
					items: [{ autogenerate: { directory: 'cli' } }],
				},
			],
			editLink: {
				baseUrl: 'https://github.com/cyberuni/cyber-truss/edit/main/apps/web/',
			},
		}),
	],
})
