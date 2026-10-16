#!/usr/bin/env bash
# ============================================================
#  AproVest - Inicializador universal para macOS e Linux
#  Uso: bash iniciar-mac-linux.sh
# ============================================================

set -e

cd "$(dirname "$0")"

echo ""
echo "=== AproVest - verificacao do ambiente ==="
echo ""

if ! command -v node >/dev/null 2>&1; then
    echo "[ERRO] Node.js nao encontrado."
    echo "Instale a versao 20 ou superior em https://nodejs.org"
    echo "e execute este arquivo novamente."
    exit 1
fi

NODE_MAJOR="$(node -v | sed 's/^v//' | cut -d. -f1)"
if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "[ERRO] Node.js versao 20 ou superior e necessaria."
    node -v
    echo "Atualize em https://nodejs.org"
    exit 1
fi

echo "Node.js encontrado:"
node -v
echo ""

if [ ! -d node_modules ]; then
    echo "Instalando dependencias pela primeira vez..."
    echo "Isso pode levar alguns minutos."
    echo ""
    npm install
fi

echo ""
echo "=== Iniciando o site ==="
echo "Quando aparecer \"Local:\", abra o endereco no navegador."
echo "Para encerrar, pressione Ctrl+C."
echo ""

npm run dev
