// import {fetchDocument} from "../services/Document.http.service.ts";
//
// export async function handleDownload(documentId: string, filename?: string) {
//   const blob = await fetchDocument(documentId);
//   const url  = URL.createObjectURL(blob);
//
//   const link = document.createElement('a');
//   link.href = url;
//   link.download = filename ?? `document-${documentId}.pdf`;
//   document.body.appendChild(link);
//   link.click();
//
//   link.remove();
//   URL.revokeObjectURL(url);
// }
//
// export async function handlePreview(documentId: string) {
//   const blob = await fetchDocument(documentId);
//   const url  = URL.createObjectURL(blob);
//   window.open(url, '_blank');
// }

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { fetchDocument } from "../services/Document.http.service.ts";
import { ProcedureResponse } from "../types/ProcedureResponse.interface.ts";

// Importar las imágenes
import firmaImage from '../assets/images/imagenFirma.png';
import qrImage from '../assets/images/QRLEG.png';

// Función para obtener el tipo de documento correcto
function getDocumentTypeName(procedure?: ProcedureResponse): string {
  if (!procedure) return 'DOCUMENTO';

  const typeName = procedure.procedureTypeName.toUpperCase();

  // Mapeo basado en los nombres reales de tu sistema
  if (typeName.includes('BACHILLER')) {
    return 'DIPLOMA DE BACHILLER';
  } else if (typeName.includes('ACADÉMICO') || typeName.includes('ACADEMICO')) {
    return 'DIPLOMA ACADÉMICO';
  } else if (typeName.includes('TÍTULO') || typeName.includes('TITULO') || typeName.includes('PROVISIÓN') || typeName.includes('PROVISION')) {
    return 'TÍTULO EN PROVISIÓN NACIONAL';
  }

  return typeName; // Retorna el nombre original si no coincide
}

async function createCertificationPage(pdfDoc: PDFDocument, procedure?: ProcedureResponse) {
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();

  const timesRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const timesRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);

  // Cargar imágenes
  const qrImageBytes = await fetch(qrImage).then(res => res.arrayBuffer());
  const qrImg = await pdfDoc.embedPng(qrImageBytes);

  const firmaImageBytes = await fetch(firmaImage).then(res => res.arrayBuffer());
  const firmaImg = await pdfDoc.embedPng(firmaImageBytes);

  const documentType = getDocumentTypeName(procedure);

  // 1. Código QR
  page.drawImage(qrImg, {
    x: 40,
    y: height - 140,
    width: 100,
    height: 100,
  });

  // 2. Encabezado
  page.drawText('EL SECRETARIO GENERAL DE LA UNIVERSIDAD', {
    x: 160,
    y: height - 70,
    size: 13,
    font: timesRomanBold,
    color: rgb(0, 0, 0),
  });

  page.drawText('ARCH 23/2025', {
    x: 160,
    y: height - 95,
    size: 11,
    font: timesRoman,
    color: rgb(0.3, 0.3, 0.3),
  });

  // 3. CERTIFICA
  page.drawText('CERTIFICA:', {
    x: 40,
    y: height - 180,
    size: 12,
    font: timesRomanBold,
    color: rgb(0, 0, 0),
  });

  // 4. Cuerpo del texto - MEJORADO para que fluya naturalmente
  const margin = 40;
  let currentY = height - 215;
  const lineHeight = 18;

  // Línea 1
  page.drawText('Que, la copia fotostática del anverso corresponde al', {
    x: margin,
    y: currentY,
    size: 12,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  // Línea 2 - Tipo de documento + Nº
  currentY -= lineHeight;
  page.drawText(documentType, {
    x: margin,
    y: currentY,
    size: 12,
    font: timesRomanBold,
    color: rgb(0, 0, 0),
  });

  // Calcular posición después del tipo de documento
  const docTypeWidth = documentType.length * 7.2;
  page.drawText('       Nº ARCH 23/2025 perteneciente a:', {
    x: margin + docTypeWidth,
    y: currentY,
    size: 12,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  // Línea 3 - Nombre del usuario
  currentY -= lineHeight;
  page.drawText('USUARIO DEMO', {
    x: margin,
    y: currentY,
    size: 12,
    font: timesRomanBold,
    color: rgb(0, 0, 0),
  });

  // Calcular posición exacta después del nombre
  const nombreWidth = 'USUARIO DEMO'.length * 7.2;
  page.drawText('    expedido por esta Casa Superior de Estudios, siendo', {
    x: margin + nombreWidth,
    y: currentY,
    size: 12,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  // Línea 4
  currentY -= lineHeight;
  page.drawText('auténticas las firmas y rúbricas estampadas en el mismo. Esto es una prueba.', {
    x: margin,
    y: currentY,
    size: 12,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  // 5. Firmado Digitalmente por:
  page.drawText('Firmado Digitalmente por:', {
    x: margin,
    y: 320,
    size: 10,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  // 6. Imagen de la firma
  const firmaWidth = 180;
  const firmaHeight = 70;
  page.drawImage(firmaImg, {
    x: (width - firmaWidth) / 2,
    y: 220,
    width: firmaWidth,
    height: firmaHeight,
  });

  // Línea debajo de la firma
  page.drawLine({
    start: { x: 180, y: 215 },
    end: { x: width - 180, y: 215 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });

  // 7. Nombre y cargo
  page.drawText('M.Sc. Oscar Alfredo Aquino Ledezma', {
    x: (width - 220) / 2,
    y: 190,
    size: 10,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });

  page.drawText('JEFE UNIDAD ARCHIVOS', {
    x: (width - 160) / 2,
    y: 175,
    size: 10,
    font: timesRomanBold,
    color: rgb(0, 0, 0),
  });

  // 8. Fecha
  const today = new Date();
  const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const dateStr = `Cochabamba, ${days[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]} de ${today.getFullYear()}`;

  page.drawText(dateStr, {
    x: width - 300,
    y: 50,
    size: 9,
    font: timesRoman,
    color: rgb(0, 0, 0),
  });
}

export async function handleDownload(documentId: string, filename?: string, procedure?: ProcedureResponse) {
  const blob = await fetchDocument(documentId);

  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  await createCertificationPage(pdfDoc, procedure);

  const modifiedPdfBytes = await pdfDoc.save();

  const modifiedBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(modifiedBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename ?? `document-${documentId}.pdf`;
  document.body.appendChild(link);
  link.click();

  link.remove();
  URL.revokeObjectURL(url);
}

export async function handlePreview(documentId: string, procedure?: ProcedureResponse) {
  const blob = await fetchDocument(documentId);

  const arrayBuffer = await blob.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);

  await createCertificationPage(pdfDoc, procedure);

  const modifiedPdfBytes = await pdfDoc.save();

  const modifiedBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(modifiedBlob);

  // Abrir en la misma pestaña en lugar de ventana emergente
  window.location.href = url;
}