/**
 * Verificacao de ambiente do AproVest.
 *
 * Executa checagens antes de instalar ou rodar o site,
 * para que problemas de configuracao aparecam como
 * mensagens claras em vez de erros tecnicos.
 *
 * Uso: node scripts/verificar-ambiente.mjs
 */

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { supportedNodeVersion } from './node-version.mjs';

const raiz = dirname(dirname(fileURLToPath(import.meta.url)));

let falhas = 0;

function ok(mensagem) {
  console.log(`  [OK] ${mensagem}`);
}

function erro(mensagem, solucao) {
  falhas += 1;
  console.error(`  [ERRO] ${mensagem}`);
  if (solucao) {
    console.error(`         Solucao: ${solucao}`);
  }
}

console.log('');
console.log('=== AproVest - verificacao do ambiente ===');
console.log('');

const versaoNode = process.versions.node;
const instalar = process.argv.includes('--instalacao');

if (supportedNodeVersion(versaoNode)) {
  ok(`Node.js ${versaoNode} compativel`);
} else {
  erro(
    `Node.js ${versaoNode} e antigo demais.`,
    'Instale Node.js LTS 22.12+ ou 24 em https://nodejs.org'
  );
}

if (instalar) {
  ok('Verificacao antes da instalacao concluida');
} else if (existsSync(join(raiz, 'node_modules', 'vite', 'package.json'))) {
  ok('Dependencias instaladas (pasta node_modules presente)');
} else {
  erro(
    'Dependencias ainda nao instaladas.',
    'Execute npm install na pasta do projeto'
  );
}

if (existsSync(join(raiz, 'package-lock.json'))) {
  ok('Arquivo de versoes travadas presente (instalacao reproduzivel)');
}

console.log('');

if (falhas > 0) {
  console.error(`Foram encontrados ${falhas} problema(s). Corrija e tente novamente.`);
  console.log('');
  process.exit(1);
}

console.log(instalar ? 'Instalacao pode continuar.' : 'Ambiente pronto. Execute npm run dev para abrir o site.');
console.log('');
