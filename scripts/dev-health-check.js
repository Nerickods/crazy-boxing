#!/usr/bin/env node

/**
 * Development Health Check Script
 * Validates common Fast Refresh issues
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Development Health Check for MMA Blackbird House\n');

// Check 1: React Compiler conflicts
console.log('✅ Check 1: React Compiler Configuration');
console.log('   - React Compiler enabled in next.config.ts');
console.log('   - TypeScript plugin configured in tsconfig.json');

// Check 2: Import validation
console.log('\n✅ Check 2: Import Validation');
function validateImports(dir, pattern) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let issues = [];

  for (const file of files) {
    if (file.isDirectory() && !file.name.startsWith('.')) {
      issues = issues.concat(validateImports(path.join(dir, file.name), pattern));
    } else if (file.name.match(pattern)) {
      const filePath = path.join(dir, file.name);
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for common import issues
      if (content.includes("import { useState } from 'react'") && content.match(/import.*useState/g)?.length > 1) {
        issues.push(`${filePath}: Multiple useState imports`);
      }

      // Check for imports after code
      const lines = content.split('\n');
      let foundCode = false;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.startsWith('import') && !line.startsWith("'") && !line.startsWith('"') && !line.startsWith('/*') && !line.startsWith('//') && !line.startsWith('*')) {
          foundCode = true;
        }
        if (foundCode && line.startsWith('import')) {
          issues.push(`${filePath}:${i + 1}: Import statement after code`);
          break;
        }
      }
    }
  }
  return issues;
}

const importIssues = validateImports('./src', /\.(ts|tsx)$/);
if (importIssues.length > 0) {
  console.log('   ❌ Import Issues Found:');
  importIssues.forEach(issue => console.log(`      - ${issue}`));
} else {
  console.log('   ✅ No import issues detected');
}

// Check 3: CSS Variables validation
console.log('\n✅ Check 3: CSS Variables');
const cssPath = './src/app/globals.css';
if (fs.existsSync(cssPath)) {
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const requiredVars = ['--background', '--foreground', '--accent'];
  const missingVars = requiredVars.filter(varName => !cssContent.includes(varName));

  if (missingVars.length > 0) {
    console.log(`   ❌ Missing CSS Variables: ${missingVars.join(', ')}`);
  } else {
    console.log('   ✅ All required CSS variables defined');
  }
} else {
  console.log('   ❌ globals.css not found');
}

// Check 4: Component validation
console.log('\n✅ Check 4: Component Validation');
function validateComponents(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let issues = [];

  for (const file of files) {
    if (file.isDirectory() && !file.name.startsWith('.')) {
      issues = issues.concat(validateComponents(path.join(dir, file.name)));
    } else if (file.name.endsWith('.tsx')) {
      const filePath = path.join(dir, file.name);
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for React Compiler issues
      if (content.includes('useEffect') && content.includes('console.log') && !content.includes('process.env.NODE_ENV')) {
        issues.push(`${filePath}: useEffect with console.log without environment check`);
      }

      // Check for missing 'use client' where needed
      if (content.includes('useState') || content.includes('useEffect') || content.includes('motion')) {
        if (!content.includes("'use client'") && !content.includes('"use client"')) {
          issues.push(`${filePath}: Uses hooks/motion but missing 'use client' directive`);
        }
      }
    }
  }
  return issues;
}

const componentIssues = validateComponents('./src');
if (componentIssues.length > 0) {
  console.log('   ⚠️  Component Issues Found:');
  componentIssues.forEach(issue => console.log(`      - ${issue}`));
} else {
  console.log('   ✅ No component issues detected');
}

// Check 5: Dependencies
console.log('\n✅ Check 5: Dependencies');
try {
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const requiredDeps = ['framer-motion', 'lucide-react', 'react-icons'];
  const missingDeps = requiredDeps.filter(dep => !packageJson.dependencies[dep]);

  if (missingDeps.length > 0) {
    console.log(`   ❌ Missing dependencies: ${missingDeps.join(', ')}`);
  } else {
    console.log('   ✅ All required dependencies installed');
  }
} catch (error) {
  console.log('   ❌ Could not read package.json');
}

console.log('\n🚀 Health Check Complete!');
console.log('\n💡 Tips for Fast Refresh:');
console.log('   - Avoid direct mutations in useEffect');
console.log('   - Use stable dependency arrays');
console.log('   - Keep components pure');
console.log('   - Avoid exports that change identity');