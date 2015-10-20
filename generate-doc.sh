#!/bin/bash

set -e

SOURCE=node-eclib.js  # TODO: Add others

BRANCH=$(git symbolic-ref HEAD); BRANCH=${BRANCH##refs/heads/}
COMMIT=$(git rev-parse --short HEAD)

GITDIR="$(git rev-parse --show-toplevel)"
DOCDIR=$(mktemp -d)

git clone "$GITDIR" $DOCDIR -b gh-pages
git -C $DOCDIR rm -rf .
node_modules/.bin/jsdoc $SOURCE -t node_modules/minami -d $DOCDIR
git -C $DOCDIR add .
git -C $DOCDIR commit -m "Update documentation from eclib@$COMMIT ($BRANCH)"
git -C $DOCDIR push

rm -rf $DOCDIR
