/** Hero — scène sable chaude, grande accroche serif, indice de scroll. */
export function Hero() {
    return (
        <header className="hero" id="accueil">
            <div className="wrap hero-inner">
                <span className="eyebrow">Carrelage & Pierre naturelle — depuis 1998</span>
                <h1>
                    La matière,
                    <br />
                    <em>élevée au rang d&rsquo;art.</em>
                </h1>
                <p>
                    Grès cérame, marbre, terrazzo et pierres d&rsquo;exception, sélectionnés pour les
                    intérieurs qui ne ressemblent à aucun autre.
                </p>
                <div className="hero-actions">
                    <a href="#collections" className="btn">
                        Découvrir les collections
                    </a>
                    <a href="#showroom" className="btn ghost">
                        Visiter le showroom
                    </a>
                </div>
            </div>
            <div className="scroll-cue">
                <span className="line"></span>Défiler
            </div>
        </header>
    );
}
