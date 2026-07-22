import Image from 'next/image';
import Link from 'next/link';
import { SPECS } from '@/lib/site-config';
import { MATIERE_PHOTOS } from '@/lib/matiere-photos';

/** Matière en grand — photo de marbre clair + texte + liste de specs. */
export function Split() {
    return (
        <section className="section" id="matieres">
            <div className="wrap split" data-reveal>
                <div className="media photo" style={{ position: 'relative' }}>
                    <Image src={MATIERE_PHOTOS['marbre-clair']} alt="Marbre blanc veiné" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                </div>
                <div>
                    <span className="eyebrow">La matière</span>
                    <h2>Ce qui se voit. Ce qui dure.</h2>
                    <p>
                        Nous ne vendons pas des mètres carrés, mais une tenue dans le temps : résistance
                        à l&rsquo;usure, stabilité des teintes, facilité d&rsquo;entretien.
                    </p>
                    <ul className="speclist">
                        {SPECS.map((s) => (
                            <li key={s}>{s}</li>
                        ))}
                    </ul>
                    <Link href="/showroom/" className="btn dark">
                        Demander un échantillon
                    </Link>
                </div>
            </div>
        </section>
    );
}
