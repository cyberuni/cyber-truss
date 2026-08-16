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
				{ label: 'Getting Started', link: '/getting-started/' },
				{
					label: 'Concepts',
					items: [{ autogenerate: { directory: 'concepts' } }],
				},
				{
					label: 'The lattice model',
					items: [
						{ label: 'Overview', link: '/model/' },
						{ label: 'Artifact-sets', link: '/model/artifact-sets/' },
						{ label: 'Connections', link: '/model/connections/' },
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
					],
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
