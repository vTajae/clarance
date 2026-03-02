#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# SF-86 Round-Trip Validation -- Shell Wrapper
#
# Checks that the PDF service is running, then executes the TypeScript
# validation script. Prints a summary of results.
#
# Usage:
#   ./scripts/validate-round-trip.sh [--template <path>] [--service <url>]
#
# Defaults:
#   --service  http://localhost:8001
#   --template sf86.pdf
# ---------------------------------------------------------------------------

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Default values
SERVICE_URL="${SERVICE_URL:-http://localhost:8001}"
TEMPLATE_PATH="${TEMPLATE_PATH:-sf86.pdf}"

# Parse arguments (pass-through to the TS script)
EXTRA_ARGS=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --service)
      SERVICE_URL="$2"
      EXTRA_ARGS+=("--service" "$2")
      shift 2
      ;;
    --template)
      TEMPLATE_PATH="$2"
      EXTRA_ARGS+=("--template" "$2")
      shift 2
      ;;
    --help|-h)
      echo ""
      echo "Usage: $0 [--template <path>] [--service <url>]"
      echo ""
      echo "Options:"
      echo "  --service <url>      PDF service URL (default: http://localhost:8001)"
      echo "  --template <path>    Template PDF path (default: sf86.pdf)"
      echo "  --help, -h           Show this help"
      echo ""
      echo "Environment:"
      echo "  SERVICE_URL          Override PDF service URL"
      echo "  TEMPLATE_PATH        Override template path"
      echo ""
      exit 0
      ;;
    *)
      EXTRA_ARGS+=("$1")
      shift
      ;;
  esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo ""
echo -e "${BOLD}SF-86 Round-Trip Validation${NC}"
echo -e "${CYAN}========================================${NC}"
echo ""

# ---- Check PDF service ----
echo -e "Checking PDF service at ${CYAN}${SERVICE_URL}${NC}..."

if ! command -v curl &>/dev/null; then
  echo -e "${RED}ERROR: curl is required but not installed.${NC}"
  exit 1
fi

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 "${SERVICE_URL}/health" 2>/dev/null || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo -e "${GREEN}  PDF service is running (HTTP 200)${NC}"
elif [[ "$HTTP_CODE" == "000" ]]; then
  echo -e "${RED}ERROR: PDF service is not reachable at ${SERVICE_URL}${NC}"
  echo ""
  echo "  Start the PDF service first:"
  echo "    cd pdf-service && uvicorn main:app --port 8001"
  echo ""
  echo "  Or specify a different URL:"
  echo "    $0 --service http://your-host:port"
  echo ""
  exit 1
else
  echo -e "${YELLOW}WARNING: PDF service returned HTTP ${HTTP_CODE} (expected 200)${NC}"
  echo "  Proceeding anyway..."
fi

echo ""

# ---- Check that npx/tsx are available ----
if ! command -v npx &>/dev/null; then
  echo -e "${RED}ERROR: npx is not available. Install Node.js 18+.${NC}"
  exit 1
fi

# ---- Run the TypeScript validation script ----
echo -e "Running validation script..."
echo ""

cd "$APP_DIR"
npx tsx scripts/validate-round-trip.ts "${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}"
EXIT_CODE=$?

echo ""

# ---- Summary based on exit code ----
if [[ $EXIT_CODE -eq 0 ]]; then
  echo -e "${GREEN}${BOLD}Validation completed successfully.${NC}"
else
  echo -e "${RED}${BOLD}Validation completed with failures (exit code ${EXIT_CODE}).${NC}"
fi

echo -e "Report: ${CYAN}${SCRIPT_DIR}/validation-report.json${NC}"
echo ""

exit $EXIT_CODE
