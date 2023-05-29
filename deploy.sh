#!/usr/bin/env sh

set -e

npm run build

cd dist

echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'


# git push -f https://github.com/<你的 GitHub 帳號>/<你的 Repository 的名稱> main:gh-pages

git push -f https://github.com/amanoizumi/deploy-test main:gh-pages

cd -
