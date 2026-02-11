#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎨 ESTANDARIZANDO LIBRERÍAS DE ICONOS\n');

// Mapeo de react-icons/fa a lucide-react
const iconMappings = {
  'FaFistRaised': 'Zap', // Alternativa más apropiada
  'FaFire': 'Flame',
  'FaBolt': 'Zap',
  'FaShieldAlt': 'Shield',
  'FaTrophy': 'Trophy',
  'FaChartLine': 'TrendingUp',
  'FaCertificate': 'Award',
  'FaPlus': 'Plus',
  'FaMinus': 'Minus',
  'FaChevronDown': 'ChevronDown',
  'FaChevronUp': 'ChevronUp',
  'FaUser': 'User',
  'FaEnvelope': 'Mail',
  'FaPhone': 'Phone',
  'FaClock': 'Clock',
  'FaQuoteLeft': 'Quote',
  'FaHeart': 'Heart',
  'FaWeight': 'Weight',
  'FaInstagram': 'Instagram',
  'FaFacebook': 'Facebook',
  'FaYoutube': 'Youtube',
  'FaWhatsapp': 'MessageCircle',
  'FaMapMarkerAlt': 'MapPin',
  'FaArrowUp': 'ArrowUp',
  'FaUsers': 'Users',
  'FaStar': 'Star',
  'FaQuestionCircle': 'HelpCircle'
};

const componentsPath = path.join(__dirname, '../src/components');
const featuresPath = path.join(__dirname, '../src/features');

function processDirectory(directoryPath, directoryName) {
  console.log(`📁 Procesando ${directoryName}...`);

  if (!fs.existsSync(directoryPath)) {
    console.log(`ℹ️  Directorio ${directoryName} no existe`);
    return;
  }

  const files = fs.readdirSync(directoryPath);

  files.forEach(file => {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(directoryPath, file);
      const content = fs.readFileSync(filePath, 'utf8');

      // Solo procesar archivos que usen react-icons/fa
      if (content.includes("from 'react-icons/fa'")) {
        console.log(`\n🔄 Procesando ${file}...`);

        let newContent = content;
        let modified = false;

        // Reemplazar imports
        let importMatch = content.match(/import\s*\{\s*([^}]+)\s*\}\s*from\s*['"]react-icons\/fa['"];?/);

        if (importMatch) {
          const oldImports = importMatch[1].split(',').map(s => s.trim());
          const newImports = [];

          oldImports.forEach(iconName => {
            if (iconMappings[iconName]) {
              newImports.push(iconMappings[iconName]);
              console.log(`   🔄 ${iconName} → ${iconMappings[iconName]}`);
            } else {
              console.log(`   ⚠️  No hay mapeo para ${iconName}`);
              newImports.push(iconName);
            }
          });

          // Reemplazar línea de import
          newContent = newContent.replace(
            importMatch[0],
            `import { ${newImports.join(', ')} } from 'lucide-react';`
          );
          modified = true;
        }

        // Reemplazar uso de iconos en el código
        Object.entries(iconMappings).forEach(([oldIcon, newIcon]) => {
          const regex = new RegExp(`\\b${oldIcon}\\b`, 'g');
          if (newContent.match(regex)) {
            newContent = newContent.replace(regex, newIcon);
            modified = true;
          }
        });

        if (modified) {
          fs.writeFileSync(filePath, newContent);
          console.log(`✅ ${file} actualizado`);
        } else {
          console.log(`ℹ️  ${file} no necesitaba cambios`);
        }
      }
    }
  });
}

// Procesar directorios
processDirectory(componentsPath, 'components');
processDirectory(featuresPath, 'features');

console.log('\n🎯 ESTANDARIZACIÓN COMPLETADA');
console.log('\n📝 Resumen:');
console.log('   - react-icons/fa → lucide-react');
console.log('   - Iconos mapeados a equivalentes en lucide-react');
console.log('   - Todos los archivos actualizados');
console.log('\n⚠️  NOTA: Algunos iconos pueden necesitar ajustes manuales');
console.log('     ya que lucide-react tiene diferentes nombres o estilos');