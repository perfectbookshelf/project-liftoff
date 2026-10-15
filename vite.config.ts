// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    plugins: [{
      name: "three-canvas-no-dom-tags",
      enforce: "post",
      transform(code, id) {
        if (!/3DView\.tsx(?:\?|$)/.test(id)) return null;
        // DOM inspection attributes are invalid pierced properties on Three objects.
        return { code: code.replace(/["']data-tsd-source["']\s*:\s*["'][^"']*["']/g, '"data-tsd-source": undefined'), map: null };
      },
    }],
  },
});
