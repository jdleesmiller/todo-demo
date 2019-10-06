set -e

# Get the full environment name in $ENV, allowing shorthand.
function get_env {
  case $1 in
    d | development ) ENV=development ;;
    t | test ) ENV=test ;;
    * ) echo "Expected environment d[evelopment]|t[est]"; exit 1;;
  esac
}

# Run docker-compose in environment $ENV.
function docker_compose_in_env {
  ENV=$ENV docker-compose \
    --project-name "todo_$ENV" \
    --file docker-compose.yml --file docker-compose.local.yml \
    --file docker-compose.$ENV.yml \
    "$@"
}

# Run docker-compose with the file for shared resources.
function docker_compose_shared {
  docker-compose --file docker-compose.shared.yml "$@"
}

# Run docker-compose for CI (continuous integration).
function docker_compose_ci {
  docker-compose \
    --project-name "todo_ci" \
    --file docker-compose.yml --file docker-compose.ci.yml \
    "$@"
}

# Script to wait for postgres to come up.
WAIT_FOR_PG_ISREADY="while ! pg_isready --quiet; do sleep 1; done;"
