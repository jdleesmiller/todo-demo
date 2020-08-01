set -e

# Run docker-compose in the given environment.
function docker_compose_in_env {
  local ENV=$(get_full_env_name $1)
  case $ENV in
  development | test )
    ENV=$ENV docker-compose \
      --project-name todo_$ENV \
      --file docker-compose.yml \
      --file docker-compose.$ENV.yml \
      "${@:2}"
    ;;
  shared )
    docker-compose \
      --project-name todo \
      --file docker-compose.shared.yml "${@:2}" ;;
  * ) echo "Unexpected environment name"; exit 1 ;;
  esac
}

# Get the full environment name, allowing shorthand.
function get_full_env_name {
  case $1 in
    d | development ) echo development ;;
    t | test ) echo test ;;
    s | shared ) echo shared ;;
    * ) echo "Expected environment d[evelopment]|t[est]|s[hared]"; exit 1 ;;
  esac
}
