import { SPECS } from '@/lib/site-config';

/** Matière en grand — média (matière CSS) + texte + liste de specs. */
export function Split() {
    return (
        <section className="section" id="matieres">
            <div className="wrap split" data-reveal>
                <div className="media mat-marbre"></div>
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
                    <a href="#showroom" className="btn dark">
                        Demander un échantillon
                    </a>
                </div>
            </div>
        </section>
    );
}
