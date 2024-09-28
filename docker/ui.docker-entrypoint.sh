#!/usr/bin/env bash
set -Ex

# https://github.com/vercel/next.js/discussions/17641#discussioncomment-339555

# Define the environment variables to replace
env_vars="NEXT_PUBLIC_SCHEMA_REGISTRY_ADDRESS NEXT_PUBLIC_SUN_ID_ADDRESS NEXT_PUBLIC_API_HOST NEXT_PUBLIC_NOTIFICATION"

function apply_path {
    # Load environment variables from .env file if it exists
    if [ -f .env ]; then
        export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
    fi

    # Replace placeholders in /app/dist directory
    for var in $env_vars; do
        value=$(eval echo \$$var)
        echo "Replacing ${var} with ${value}"
        find /app/.next \( -type d -name .git -prune \) -o -type f -print0 | xargs -0 sed -i "s#APP_${var}#${value}#g"

    done
}

apply_path
echo "Starting Nextjs"
exec "$@"
