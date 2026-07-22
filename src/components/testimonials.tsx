/** Avis clients (fictifs — à remplacer par les vrais avis Google à terme). */

const AVIS = [
    {
        nom: 'Claire M.',
        role: 'Rénovation salle de bain — Dijon',
        note: 5,
        texte: 'Conseil remarquable : on est arrivés avec une photo Pinterest, on est repartis avec une composition complète et les échantillons. Le zellige posé est encore plus beau qu’en photo.',
    },
    {
        nom: 'Marc & Sophie L.',
        role: 'Construction neuve — Beaune',
        note: 5,
        texte: 'Le calepinage proposé pour notre séjour en 120×120 a tout changé. Livraison à la date promise, pas un carreau cassé, et un carreleur recommandé sérieux. Rien à redire.',
    },
    {
        nom: 'Restaurant Le Comptoir',
        role: 'Projet professionnel — Dijon',
        note: 5,
        texte: 'Un an de service intensif sur le terrazzo : aucune trace d’usure. L’équipe avait anticipé nos contraintes d’exploitation, jusqu’aux profilés laiton. Des vrais professionnels.',
    },
    {
        nom: 'Julien P.',
        role: 'Terrasse & piscine — Mâcon',
        note: 4,
        texte: 'Très bon accompagnement sur le choix du travertin et la pose sur plots. Petit délai supplémentaire sur les margelles sur mesure, mais le résultat en valait la peine.',
    },
];

export function Testimonials() {
    return (
        <section className="section">
            <div className="wrap">
                <div className="section-head" data-reveal>
                    <span className="eyebrow">Ils nous ont confié leurs sols</span>
                    <h2>La matière, jugée sur pièce.</h2>
                </div>
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                    {AVIS.map((a) => (
                        <figure key={a.nom} className="form-panel avis-card" data-reveal>
                            <span className="stars" aria-label={`${a.note} étoiles sur 5`}>
                                {'★'.repeat(a.note)}{'☆'.repeat(5 - a.note)}
                            </span>
                            <blockquote style={{ fontSize: 15, color: 'var(--encre)', margin: '12px 0 0' }}>
                                « {a.texte} »
                            </blockquote>
                            <cite>
                                {a.nom} <span className="role">— {a.role}</span>
                            </cite>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}
