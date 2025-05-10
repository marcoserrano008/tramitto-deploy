import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import styles from './ApplicantHomePage.module.scss';
import 'primeicons/primeicons.css';
import logoTramitto from "../../../../assets/images/logoTramitto.svg";
import logoUMSS from "../../../../assets/images/logoUMSS.svg";


const ApplicantHomePage = () => {
  const whyItems = [
    { icon: 'pi pi-lock', title: 'Rápido y seguro' },
    { icon: 'pi pi-check-square', title: '100% Digital' },
    { icon: 'pi pi-map-marker', title: 'Seguimiento en tiempo real' },
    { icon: 'pi pi-file-pdf', title: 'Reducción de Papel y Costos' },
    { icon: 'pi pi-shield', title: 'Seguridad y Privacidad' },
    { icon: 'pi pi-pencil', title: 'Firma Digital Legalmente Válida' },
  ];

  const processItems = [
    { title: 'Legalización', subtitle: 'Diploma de Bachiller' },
    { title: 'Legalización', subtitle: 'Diploma Académico' },
    { title: 'Legalización', subtitle: 'Título Provisión Nacional' },
  ];

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroText}>
          <h1>Bienvenido a Tramitto</h1>
          <p>
            Digitaliza y gestiona tus documentos académicos de forma rápida y segura.
          </p>
        </div>
        <div className={styles.heroLogos}>
          <img src={logoTramitto} alt="Logo Tramitto" className={styles.logoImage}/>
          <img src={logoUMSS} alt="Logo UMSS" className={styles.logoImage}/>
        </div>
      </section>

      <section className={styles.whySection}>
        <h2 className={styles.processHeader}>¿Por qué usar Tramitto?</h2>
        <div className={styles.carouselWrapper}>
          <Carousel
            value={whyItems}
            itemTemplate={(item) => (
              <div className={styles.whyCard}>
                <div className={styles.whyLeft}>
                  <i className={`${item.icon} ${styles.whyIcon}`}></i>
                </div>
                <div className={styles.whyRight}>
                  <p>{item.title}</p>
                </div>
              </div>
            )}
            numVisible={3}
            numScroll={1}
            autoplayInterval={3000}
            circular
            responsiveOptions={[
              {
                breakpoint: '1024px',
                numVisible: 2,
                numScroll: 1
              },
              {
                breakpoint: '600px',
                numVisible: 1,
                numScroll: 1
              }
            ]}
          />
        </div>
      </section>

      <section className={styles.processSection}>
        <h2 className={styles.processHeader}>Trámites</h2>
        <div className={styles.processCards}>
          {processItems.map((item, idx) => (
            <Card key={idx} className={styles.processCard}>
              <div className={styles.processCardTitle}>{item.title}</div>
              <div className={styles.processCardSubtitle}>{item.subtitle}</div>
              <Button label="Iniciar" icon="pi pi-play" className="p-button-primary"/>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ApplicantHomePage;
