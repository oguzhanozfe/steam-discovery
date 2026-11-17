// Lets plain Node run the TypeScript modules the Vercel function uses: they
// import siblings as "./x.js" (what the compiled function needs), so map a
// missing .js import to the .ts source. Usage: node --import ./scripts/ts-hook.mjs
import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, next) {
    try {
      return next(specifier, context);
    } catch (error) {
      if (specifier.startsWith('.') && specifier.endsWith('.js'))
        return next(`${specifier.slice(0, -3)}.ts`, context);
      throw error;
    }
  },
});
