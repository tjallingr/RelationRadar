import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/kit").Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// adapter-auto resolves to the Vercel adapter when deployed on Vercel and
		// to the node adapter locally. Swap for @sveltejs/adapter-vercel directly
		// if Vercel-specific options (regions, ISR) are ever needed.
		adapter: adapter()
	}
};

export default config;
