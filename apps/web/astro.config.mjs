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
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', link: '/' },
						{ label: 'Getting Started', link: '/getting-started/' },
					],
				},
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
						{ label: 'Waterfall in the model', link: '/model/waterfall/' },
						{ label: 'Formal workflows', link: '/model/formal-workflows/' },
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
