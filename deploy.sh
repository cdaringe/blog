#!/usr/bin/env bash
set -euox pipefail

REMOTE_BLOG_DIRNAME="/www/static/blog"
# echo "rm -rf $REMOTE_BLOG_DIRNAME && mkdir -p $REMOTE_BLOG_DIRNAME" | ssh root@$DROPLET_IP
yarn build
rsync -r --verbose public $USER@$DROPLET_IP:$REMOTE_BLOG_DIRNAME
