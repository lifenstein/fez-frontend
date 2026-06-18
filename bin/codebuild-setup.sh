 #!/bin/bash

# exit if command returns error (non-zero status)
set -e

printf "Node "; node -v;
printf "(Codeship default) pnpm v"; pnpm -v

printf "\n\n--- GET LATEST VERSION OF pnpm 11.12.1 ---\n"
echo "$ pnpm install -g pnpm@11.12.1"
pnpm install -g pnpm@11.12.1

printf "\nNow running pnpm v"; pnpm -v

printf "\n$ pnpm cache clear\n"
# pnpm cache verify
pnpm cache clear -f

printf "\n\n--- INSTALL DEPENDENCIES ---\n"
echo "$ pnpm ci"
pnpm ci
