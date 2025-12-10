import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import logoTramitto from "../../../../../public/logoTramitto.svg";
import styles from './ApplicantFAQPage.module.scss';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const ApplicantFAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | number[] | null>(null);

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "¿Qué es el Sistema de Información de Tramites?",
      answer: "El Sistema de Información de Tramites es una plataforma web 100% digital de la Universidad Mayor de San Simón que permite la gestión y legalización de documentos académicos mediante firmas digitales. Puedes legalizar diplomas de bachiller, diplomas académicos y títulos en provisión nacional de forma completamente online.",
      category: "General",
      tags: ["documentos", "SIT", "legalización"]
    },
    {
      id: 2,
      question: "¿Qué tipos de documentos puedo legalizar en el Sistema de Información de Tramites?",
      answer: "En el Sistema de Información de Tramites puedes legalizar tres tipos de documentos académicos: Diploma de Bachiller, Diploma Académico y Título en Provisión Nacional. Todos estos documentos son firmados digitalmente por las autoridades de la Universidad Mayor de San Simón.",
      category: "General",
      tags: ["documentos", "tipos", "legalización"]
    },
    {
      id: 3,
      question: "¿Cómo me registro en la plataforma?",
      answer: "El registro incluye un proceso de validación de identidad obligatorio. Debes subir fotos del anverso y reverso de tu carnet de identidad (donde se vean claramente tu foto y datos), tomarte una selfie en el momento, y completar tus datos personales. El sistema validará automáticamente que la información coincida.",
      category: "Registro",
      tags: ["registro", "validación", "identidad", "carnet"]
    },
    {
      id: 4,
      question: "¿Qué hago si falla la validación de mi identidad?",
      answer: "Si la validación falla, aparecerá un modal indicando los errores específicos (como 'las caras no coinciden' o 'no se detectó número de CI'). Debes corregir estos problemas y volver a intentar el proceso de validación con fotos más claras y una selfie actual.",
      category: "Registro",
      tags: ["validación", "error", "identidad", "fotos"]
    },
    {
      id: 5,
      question: "¿Puedo iniciar sesión con mi cuenta de Google?",
      answer: "Sí, puedes iniciar sesión con tu cuenta institucional de Google además del método tradicional con correo electrónico y contraseña.",
      category: "Acceso",
      tags: ["login", "google", "sesión", "acceso"]
    },
    {
      id: 6,
      question: "¿Cómo inicio el proceso de legalización?",
      answer: "Desde el home, selecciona el tipo de documento que deseas legalizar. Antes de iniciar, se te mostrará información sobre requisitos, costo, tiempo aproximado y método de pago. En el paso 1, debes ingresar el número de documento y la gestión correspondiente.",
      category: "Proceso",
      tags: ["legalización", "proceso", "requisitos", "inicio"]
    },
    {
      id: 7,
      question: "¿Qué pasa si mi documento no se encuentra en el sistema?",
      answer: "Si la búsqueda no es exitosa, se habilitará un paso adicional donde deberás subir tu documento escaneado en formato PDF. Asegúrate de que el documento sea legible y esté completo antes de subirlo.",
      category: "Proceso",
      tags: ["documento", "búsqueda", "PDF", "subir"]
    },
    {
      id: 8,
      question: "¿Cómo realizo el pago del trámite?",
      answer: "El pago se realiza mediante código QR utilizando el sistema de e-pagos de la universidad. Una vez que completes el pago, podrás finalizar tu solicitud. El sistema es 100% digital y seguro.",
      category: "Pago",
      tags: ["pago", "QR", "e-pagos", "digital"]
    },
    {
      id: 9,
      question: "¿Cuáles son los estados de mi trámite?",
      answer: "Existen 4 estados: 1) No enviado: puedes continuar desde donde te quedaste, 2) En revisión: tu solicitud está siendo evaluada, 3) Rechazado: hay observaciones que debes corregir, 4) Completado: tu documento está legalizado y listo para descargar.",
      category: "Estados",
      tags: ["estados", "trámite", "seguimiento", "proceso"]
    },
    {
      id: 10,
      question: "¿Qué hago si mi trámite es rechazado?",
      answer: "Si tu trámite es rechazado, recibirás los motivos específicos del rechazo tanto en la plataforma como en tu correo electrónico. Deberás subir un nuevo archivo corrigiendo las observaciones señaladas.",
      category: "Estados",
      tags: ["rechazado", "observaciones", "nuevo archivo", "correcciones"]
    },
    {
      id: 11,
      question: "¿Cómo descargo mi documento legalizado?",
      answer: "Una vez que tu trámite esté completado, podrás descargar tu documento legalizado desde la sección 'Mis Trámites' haciendo clic en 'Abrir Documento'. También recibirás una copia en tu correo electrónico.",
      category: "Descarga",
      tags: ["descarga", "completado", "documento", "correo"]
    },
    {
      id: 12,
      question: "¿Recibo notificaciones del estado de mi trámite?",
      answer: "Sí, recibirás notificaciones por correo electrónico sobre todos los cambios de estado de tu trámite: cuando esté en revisión, si es rechazado (con los motivos), y cuando esté completado con el documento legalizado.",
      category: "Notificaciones",
      tags: ["notificaciones", "correo", "estados", "seguimiento"]
    },
    {
      id: 13,
      question: "¿Cuánto tiempo demora el proceso de legalización?",
      answer: "El tiempo de proceso varía según el tipo de documento, pero generalmente es de 1 a 3 días hábiles una vez que tu solicitud ha sido aceptada y está en proceso de firma digital por las autoridades universitarias.",
      category: "Tiempos",
      tags: ["tiempo", "proceso", "días", "autoridades"]
    },
    {
      id: 14,
      question: "¿Qué formato debe tener mi documento escaneado?",
      answer: "El documento debe estar en formato PDF, ser completamente legible, mostrar toda la información claramente y tener un tamaño adecuado para su revisión. Evita documentos borrosos o incompletos.",
      category: "Requisitos",
      tags: ["PDF", "formato", "legible", "escaneado"]
    },
    {
      id: 15,
      question: "¿Las firmas digitales tienen validez legal?",
      answer: "Sí, las firmas digitales aplicadas por el Jefe de Archivos y el Secretario General de la Universidad Mayor de San Simón tienen plena validez legal y son reconocidas oficialmente.",
      category: "Legal",
      tags: ["firmas digitales", "validez", "legal", "autoridades"]
    },
    {
      id: 16,
      question: "¿Puedo hacer múltiples trámites al mismo tiempo?",
      answer: "Sí, puedes tener múltiples trámites en proceso simultáneamente. Cada uno tendrá su propio estado y podrás seguir el progreso de todos desde la sección 'Mis Trámites'.",
      category: "General",
      tags: ["múltiples", "trámites", "simultáneo", "seguimiento"]
    }
  ];

  // Función para normalizar texto sin tildes
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const filteredFAQ = faqData.filter(item => {
    const searchNormalized = normalizeText(searchTerm);
    return normalizeText(item.question).includes(searchNormalized) ||
      normalizeText(item.answer).includes(searchNormalized) ||
      item.tags.some(tag => normalizeText(tag).includes(searchNormalized));
  });

  const categories = [...new Set(faqData.map(item => item.category))];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'General': 'info',
      'Registro': 'success',
      'Acceso': 'warning',
      'Proceso': 'primary',
      'Estados': 'secondary',
      'Pago': 'info',
      'Descarga': 'success',
      'Notificaciones': 'warning',
      'Tiempos': 'primary',
      'Requisitos': 'secondary',
      'Legal': 'info'
    };
    return colors[category] || 'info';
  };

  return (
    <div className={styles.faqContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.titleSection}>
            <div className={styles.titleContent}>
              <div>
                {/*<i className="pi pi-question-circle" style={{ fontSize: '2.5rem', color: 'white' }}></i>*/}
                <div>
                  <h1 className={styles.title}>Preguntas Frecuentes</h1>
                  <p className={styles.subtitle}>
                    Encuentra respuestas a las preguntas más comunes sobre Tramitto
                  </p>
                </div>
              </div>
            </div>
            <img src={logoTramitto} alt="Logo Tramitto" className={styles.logo} />
          </div>

          <div className={styles.searchSection}>
            <div className={styles.searchWrapper}>
              {/*<i className="pi pi-search" style={{ color: 'var(--text-color-secondary)' }}></i>*/}
              <InputText
                placeholder="Buscar en preguntas frecuentes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
              {searchTerm && (
                <Button
                  icon="pi pi-times"
                  className={styles.clearButton}
                  onClick={() => setSearchTerm('')}
                  text
                  rounded
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <Card className={styles.faqCard}>
          <div className={styles.categoryTags}>
            <span className={styles.categoryLabel}>Categorías:</span>
            {categories.map(category => (
              <Tag
                key={category}
                value={category}
                severity={getCategoryColor(category) as any}
                className={styles.categoryTag}
              />
            ))}
          </div>

          <Divider />

          {filteredFAQ.length > 0 ? (
            <Accordion
              multiple
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)}
              className={styles.accordion}
            >
              {filteredFAQ.map((faq) => (
                <AccordionTab
                  key={faq.id}
                  header={
                    <div className={styles.questionHeader}>
                      <span className={styles.questionText}>{faq.question}</span>
                      <Tag
                        value={faq.category}
                        severity={getCategoryColor(faq.category) as any}
                        className={styles.questionTag}
                      />
                    </div>
                  }
                  className={styles.accordionTab}
                >
                  <div className={styles.answerContent}>
                    <p className={styles.answerText}>{faq.answer}</p>
                    <div className={styles.tags}>
                      {faq.tags.map((tag, index) => (
                        <span key={index} className={styles.tag}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </AccordionTab>
              ))}
            </Accordion>
          ) : (
            <div className={styles.noResults}>
              <i className="pi pi-search" style={{ fontSize: '3rem', color: 'var(--text-color-secondary)' }}></i>
              <h3>No se encontraron resultados</h3>
              <p>Intenta con diferentes términos de búsqueda</p>
              <Button
                label="Limpiar búsqueda"
                icon="pi pi-times"
                text
                onClick={() => setSearchTerm('')}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ApplicantFAQPage;