import Image from 'next/image'
import { LinkedinIcon } from './brand-icons'
import styles from './founder-section.module.css'

export function FounderSection() {
  return (
    <section
      id="sobre"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className={styles.portrait}>
        <Image
          src="/mateus-forest.webp"
          alt="Mateus Forest, fundador do Grupo MF"
          fill
          sizes="(max-width: 1100px) 100vw, 62vw"
        />
      </div>
      <div className={'mf-container ' + styles.layout}>
        <div className={styles.copy}>
          <p className="mf-eyebrow">03 / Quem está por trás</p>
          <h2 id="about-title">
            Visão de negócio.
            <br />
            <span>Mentalidade de criação.</span>
          </h2>
          <p className={styles.description}>
            Minha experiência reúne importação, exportação, gestão de empresas e
            gestão de equipes. Diferentes perspectivas que se encontram na forma
            como penso e construo negócios.
          </p>
          <p className={styles.description}>
            No Grupo MF, conecto essa vivência à tecnologia, à inovação, à
            criação de produtos e à inteligência artificial para transformar
            ideias em soluções que fazem sentido na prática.
          </p>
          <div className={styles.signature}>
            <div className={styles.name}>
              <h3>Mateus Forest</h3>
              <a
                href="https://www.linkedin.com/in/mateus-forest-4664b816a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Mateus Forest no LinkedIn (abre em nova aba)"
                title="Mateus Forest no LinkedIn"
              >
                <LinkedinIcon width={18} height={18} />
              </a>
            </div>
            <p>Fundador do Grupo MF</p>
          </div>
        </div>
      </div>
    </section>
  )
}
