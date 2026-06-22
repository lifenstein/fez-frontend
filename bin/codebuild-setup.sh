 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

corepack enable
corepack use pnpm@11.7.0

printf "Node "; node -v;
printf "(Codeship default) pnpm v"; pnpm -v

printf "\nNow running pnpm v"; pnpm -v

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
pnpm install