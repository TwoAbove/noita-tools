#!/bin/bash

server_file=".servers"

while IFS=',' read -r server user_id_dev user_id_prod; do
  echo "Executing commands on $server..."
  ssh "$server" <<EOF
    docker stop noitool-search-dev noitool-search-prod

    if [ -n "$user_id_dev" ]; then
      docker stop noitool-search-dev && docker rm noitool-search-dev

      docker run -d -it --restart=always --pull=always \\
        -e NOITOOL_USER_ID=$user_id_dev \\
        -e NOITOOL_URL=https://dev.noitool.com \\
        --name noitool-search-dev \\
        ghcr.io/twoabove/noitool-console-search:latest-dev
    fi

    if [ -n "$user_id_prod" ]; then
      docker stop noitool-search-prod && docker rm noitool-search-prod

      docker run -d -it --restart=always --pull=always \\
        -e NOITOOL_USER_ID=$user_id_prod \\
        --name noitool-search-prod \\
        ghcr.io/twoabove/noitool-console-search:latest
    fi
EOF
done <"$server_file"
