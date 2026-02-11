#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DETALLADA DE IMPORTS\n');

// Verificar Header.tsx específicamente
console.log('📋 Análisis completo de Header.tsx:');
const headerPath = path.join(__dirname, '../src/components/Header.tsx');
const headerContent = fs.readFileSync(headerPath, 'utf8');

console.log('\n1️⃣ Imports encontrados:');
const importMatches = headerContent.match(/import.*from.*['"][^'"]+['"];?/g) || [];
importMatches.forEach((match, index) => {
  console.log(`   ${index + 1}. ${match.trim()}`);
});

console.log('\n2️⃣ Uso de iconos:');
const iconUsages = [
  { name: 'Menu', used: headerContent.includes('<Menu') },
  { name: 'X', used: headerContent.includes('<X') },
  { name: 'Zap', used: headerContent.includes('<Zap') },
  { name: 'FaFistRaised', used: headerContent.includes('FaFistRaised') },
  { name: 'FaBars', used: headerContent.includes('FaBars') }
];

iconUsages.forEach(icon => {
  console.log(`   ${icon.used ? '✅' : '❌'} ${icon.name}: ${icon.used ? 'USADO' : 'NO USADO'}`);
});

// Buscar posibles problemas en el resto del proyecto
console.log('\n🔎 Buscando problemas en el proyecto...');

// Buscar imports incorrectos
const srcPath = path.join(__dirname, '../src');
function findIncorrectImports(dir, depth = 0) {
  if (depth > 3) return; // Limitar profundidad para no muy grande

  try {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        findIncorrectImports(filePath, depth + 1);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');

          // Buscar problemas específicos
          const issues = [];

          // Import de FaBars sin estar definido
          if (content.includes('FaBars') && !content.includes("FaBars")) {
            issues.push('FaBars usado sin import');
          }

          // Import de FaFistRaised pero con librería incorrecta
          if (content.includes('FaFistRaised') && !content.includes("from 'react-icons/fa'")) {
            issues.push('FaFistRaised usado sin import correcto de react-icons/fa');
          }

          // Imports duplicados
          const reactImports = content.match(/import.*from\s*['"]react['"];?/g) || [];
          if (reactImports.length > 1) {
            issues.push(`Múltiples imports de react: ${reactImports.length}`);
          }

          if (issues.length > 0) {
            console.log(`\n❌ ${path.relative(__dirname, '../..', filePath)}:`);
            issues.forEach(issue => console.log(`   - ${issue}`));
          }

        } catch (error) {
          // Ignorar errores de archivos individuales
        }
      }
    });
  } catch (error) {
    // Ignorar errores de directorio
  }
}

findIncorrectImports(srcPath);

console.log('\n🎯 VERIFICACIÓN COMPLETADA');
console.log('\n📝 Si no se encontraron errores arriba, el problema puede ser:');
console.log('   1. Cache de Next.js corrupta');
console.log('   2. Cache del navegador');
console.log('   3. Problema con el módulo de resolución de Next.js');
console.log('\n🛠️ Prueba estos comandos:');
console.log('   rm -rf .next');
console.log('   npm run dev');
console.log('   Limpia cache del navegador (Ctrl+Shift+R)');