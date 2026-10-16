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
const majorNode = Number(versaoNode.split('.')[0]);

if (majorNode >= 20) {
  ok(`Node.js ${versaoNode} (minimo exigido: 20)`);
} else {
  erro(
    `Node.js ${versaoNode} e antigo demais.`,
    'Instale a versao 20 ou superior em https://nodejs.org'
  );
}

if (existsSync(join(raiz, 'node_modules'))) {
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

console.log('Ambiente pronto. Execute npm run dev para abrir o site.');
console.log('');
