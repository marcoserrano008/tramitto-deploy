import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import styles from './ApplicantHomePage.module.scss';
import 'primeicons/primeicons.css';

const ApplicantHomePage = () => {
  const whyItems = [
    { icon: 'pi pi-lock', title: 'Rápido y seguro' },
    { icon: 'pi pi-check-square', title: '100% Digital' },
    { icon: 'pi pi-map-marker', title: 'Seguimiento en tiempo real' },
  ];

  const processItems = [
    { title: 'Legalización', subtitle: 'Diploma de Bachiller' },
    { title: 'Legalización', subtitle: 'Diploma Académico' },
    { title: 'Legalización', subtitle: 'Título Provisión Nacional' },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.welcomeSection}>
        <h1 className={styles.welcomeTitle}>Bienvenido a Tramitto</h1>
        <p className={styles.welcomeSubtitle}>
          Digitaliza y gestiona tus documentos académicos de forma rápida y segura.
        </p>
      </section>

      <section>
        <h2 className={styles.processHeader}>¿Por qué usar Tramitto?</h2>
        <div className={styles.whyUse}>
          {whyItems.map((item, idx) => (
            <div key={idx} className={styles.whyCard}>
              <i className={`${item.icon} ${styles.whyIcon}`}></i>
              <p>{item.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <h2 className={styles.processHeader}>Trámites</h2>
        <div className={styles.processCards}>
          {processItems.map((item, idx) => (
            <Card key={idx} className={styles.processCard}>
              <div className={styles.processCardTitle}>{item.title}</div>
              <div className={styles.processCardSubtitle}>{item.subtitle}</div>
              <Button label="Iniciar" icon="pi pi-play" className="p-button-primary" />
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApplicantHomePage;
