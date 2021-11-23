#!/usr/bin/env bash
set -euox pipefail

REMOTE_BLOG_DIRNAME="/www/static/blog"
fnm use
npm run build
rsync -r --verbose public $USER@$DROPLET_IP:$REMOTE_BLOG_DIRNAME
# !!! Run deploy script in provisioner afterwards
