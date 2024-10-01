#!/usr/bin/env bash
set -Ex

# https://github.com/vercel/next.js/discussions/17641#discussioncomment-339555

# Define the environment variables to replace
env_vars="NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS NEXT_PUBLIC_SUN_ID_ADDRESS NEXT_PUBLIC_API_HOST NEXT_PUBLIC_NOTIFICATION NEXT_PUBLIC_BTFS_GATEWAY_URL"

function apply_path {
    # Load environment variables from .env file if it exists
    if [ -f .env ]; then
        export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
    fi

    for var in $env_vars; do
        echo "Replacing ${var} with ${!var}"
        find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_${var}#${!var}#g"
    done
}

apply_path
echo "Starting Nextjs"
exec "$@"
