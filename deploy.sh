#!/usr/bin/env bash
set -euox pipefail

HTTP_SERVER_ADMIN=root
HTTP_SERVER_IP=$DROPLET_IP
REMOTE_BLOG_DIRNAME="/www/static/blog"
SKIP_BUILD=${SKIP_BUILD:-"false"}

fnm use
if [ "$SKIP_BUILD" = "true" ]; then
    echo "Skipping build step"
else
    npm run build
fi
rsync -r --verbose public $HTTP_SERVER_ADMIN@$HTTP_SERVER_IP:$REMOTE_BLOG_DIRNAME
ssh $HTTP_SERVER_ADMIN@$HTTP_SERVER_IP chown -R $USER:webadmins $REMOTE_BLOG_DIRNAME
