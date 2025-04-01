/**
 * Script para probar la conexión y subida de documentos a Paperless
 * Se puede ejecutar con: npx ts-node src/utils/testPaperlessUpload.ts
 */
import { PaperlessService } from '../service/PaperlessService';
import * as fs from 'fs';
import * as path from 'path';

// Función principal
async function main() {
  try {
    console.log('=== Iniciando prueba de subida a Paperless ===');
    
    // Crear instancia del servicio de Paperless
    const paperlessService = new PaperlessService();
    
    // Probar conexión
    console.log('Probando conexión a Paperless...');
    const isConnected = await paperlessService.testConnection();
    
    if (!isConnected) {
      console.error('❌ No se pudo conectar a Paperless. Verifica la URL y token en .env');
      return;
    }
    
    console.log('✅ Conexión exitosa a Paperless');
    
    // Ruta a una imagen de ejemplo en la carpeta public
    const sampleImagePath = path.join(process.cwd(), 'public', 'uploads', 'documents');
    
    // Verificar si hay alguna imagen en la carpeta
    const files = fs.readdirSync(sampleImagePath);
    const imageFiles = files.filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
    
    if (imageFiles.length === 0) {
      console.error('❌ No se encontraron imágenes en la carpeta public/uploads/documents');
      // Crear una imagen base64 de ejemplo
      console.log('Usando imagen de prueba incorporada...');
      
      // Pequeña imagen base64 (un círculo rojo)
      const testImage = 'data:image/png;base64,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';
      
      // Subir la imagen de prueba a Paperless
      console.log('Subiendo imagen de prueba a Paperless...');
      const paperlessUrl = await paperlessService.uploadDocument(
        testImage,
        'test_image.png',
        'TEST_IMAGE',
        'test-verification-id'
      );
      
      if (paperlessUrl) {
        console.log(`✅ Imagen de prueba subida exitosamente a Paperless: ${paperlessUrl}`);
      } else {
        console.error('❌ Error al subir imagen de prueba a Paperless');
      }
      
      return;
    }
    
    // Tomar la primera imagen encontrada
    const imageFile = imageFiles[0];
    const imagePath = path.join(sampleImagePath, imageFile);
    
    console.log(`Usando imagen existente: ${imagePath}`);
    
    // Leer la imagen y convertirla a base64
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    
    // Subir la imagen a Paperless
    console.log('Subiendo imagen a Paperless...');
    const paperlessUrl = await paperlessService.uploadDocument(
      base64Image,
      imageFile,
      'TEST_UPLOAD',
      'test-verification-id'
    );
    
    if (paperlessUrl) {
      console.log(`✅ Imagen subida exitosamente a Paperless: ${paperlessUrl}`);
    } else {
      console.error('❌ Error al subir imagen a Paperless');
    }
    
  } catch (error) {
    console.error('Error durante la prueba de Paperless:', error);
  }
}

// Ejecutar la función principal
main().catch(error => {
  console.error('Error no controlado:', error);
  process.exit(1);
}); 