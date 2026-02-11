#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 LIMPIANDO CACHE Y VERIFICANDO PROYECTO\n');

// 1. Limpiar cache de TypeScript
console.log('1️⃣ Eliminando cache de TypeScript...');
try {
  const tsbuildinfoPath = path.join(__dirname, '../tsconfig.tsbuildinfo');
  if (fs.existsSync(tsbuildinfoPath)) {
    fs.unlinkSync(tsbuildinfoPath);
    console.log('✅ tsconfig.tsbuildinfo eliminado');
  } else {
    console.log('ℹ️  tsconfig.tsbuildinfo no existe');
  }
} catch (error) {
  console.log('❌ Error eliminando tsconfig.tsbuildinfo:', error.message);
}

// 2. Limpiar cache de Next.js
console.log('\n2️⃣ Limpiando cache de Next.js...');
try {
  const nextCachePath = path.join(__dirname, '../.next');
  if (fs.existsSync(nextCachePath)) {
    fs.rmSync(nextCachePath, { recursive: true, force: true });
    console.log('✅ .next eliminado');
  } else {
    console.log('ℹ️  .next no existe');
  }
} catch (error) {
  console.log('❌ Error eliminando .next:', error.message);
}

// 3. Verificar imports de Header.tsx
console.log('\n3️⃣ Verificando Header.tsx...');
try {
  const headerPath = path.join(__dirname, '../src/components/Header.tsx');
  const headerContent = fs.readFileSync(headerPath, 'utf8');

  // Verificar que no tenga FaFistRaised ni FaBars
  if (headerContent.includes('FaFistRaised')) {
    console.log('❌ Header.tsx contiene FaFistRaised (debería usar lucide-react)');
  } else {
    console.log('✅ Header.tsx no contiene FaFistRaised');
  }

  if (headerContent.includes('FaBars')) {
    console.log('❌ Header.tsx contiene FaBars (debería usar Menu de lucide-react)');
  } else {
    console.log('✅ Header.tsx no contiene FaBars');
  }

  // Verificar que tenga los imports correctos de lucide-react
  if (headerContent.includes("import { Menu, X, Zap } from 'lucide-react'")) {
    console.log('✅ Header.tsx tiene los imports correctos de lucide-react');
  } else {
    console.log('❌ Header.tsx no tiene los imports correctos de lucide-react');
  }

} catch (error) {
  console.log('❌ Error verificando Header.tsx:', error.message);
}

// 4. Verificar todos los archivos que usan FaFistRaised
console.log('\n4️⃣ Verificando archivos con FaFistRaised...');
const filesWithFaFistRaised = [
  'src/components/DisciplinesGrid.tsx',
  'src/components/WhyTheBest.tsx',
  'src/components/Footer.tsx'
];

filesWithFaFistRaised.forEach(file => {
  try {
    const filePath = path.join(__dirname, '../', file);
    const content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('FaFistRaised') && content.includes("from 'react-icons/fa'")) {
      console.log(`✅ ${file}: FaFistRaised importado correctamente de react-icons/fa`);
    } else if (content.includes('FaFistRaised') && !content.includes("from 'react-icons/fa'")) {
      console.log(`❌ ${file}: FaFistRaised usado pero no importado de react-icons/fa`);
    } else {
      console.log(`ℹ️  ${file}: No usa FaFistRaised`);
    }
  } catch (error) {
    console.log(`❌ Error verificando ${file}:`, error.message);
  }
});

// 5. Verificar consistencia de librerías de iconos
console.log('\n5️⃣ Verificando consistencia de librerías de iconos...');
const componentsPath = path.join(__dirname, '../src/components');
const files = fs.readdirSync(componentsPath);

let lucideReactCount = 0;
let reactIconsCount = 0;

files.forEach(file => {
  if (file.endsWith('.tsx') || file.endsWith('.ts')) {
    try {
      const filePath = path.join(componentsPath, file);
      const content = fs.readFileSync(filePath, 'utf8');

      if (content.includes("from 'lucide-react'")) {
        lucideReactCount++;
      }
      if (content.includes("from 'react-icons/fa'")) {
        reactIconsCount++;
      }
    } catch (error) {
      // Ignorar errores de lectura
    }
  }
});

console.log(`📊 Estadísticas de uso de librerías de iconos:`);
console.log(`   - lucide-react: ${lucideReactCount} archivos`);
console.log(`   - react-icons/fa: ${reactIconsCount} archivos`);

if (lucideReactCount > 0 && reactIconsCount > 0) {
  console.log(`⚠️  Mezcla de librerías detectada - considere estandarizar`);
} else if (lucideReactCount > 0) {
  console.log(`✅ Uso consistente de lucide-react`);
} else {
  console.log(`ℹ️  No se detectó uso consistente de una sola librería`);
}

console.log('\n🎯 VERIFICACIÓN COMPLETADA');
console.log('\n📝 Próximos pasos recomendados:');
console.log('   1. npm run dev (iniciar servidor)');
console.log('   2. npm run typecheck (verificar TypeScript)');
console.log('   3. npm run build (verificar build)');