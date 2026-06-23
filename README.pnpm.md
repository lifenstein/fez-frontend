npm install -g pnpm
npm uninstall -g pnpm #when switching to corepack
#or preferred: 
corepack enable
corepack prepare pnpm@latest --activate
# set packageManager in package.json
corepack use pnpm@11.7.0

#Then
rm -rf node_modules package-lock.json
pnpm install

Equivalent
npm: pnpm
npm ci: pnpm install --frozen-lockfile
npx: pnpm dlx

#some packages are installed by npm even if it's not in package.json, pnpm require installing them explicitly.
pnpm add deepmerge
pnpm why events
pnpm add events