'use client';

/**
 * Barre de recherche des portails — loupe, effacement en un clic, compteur
 * de résultats. Utilisée à l'identique sur Clients, Devis, Commandes et
 * Factures pour une expérience homogène.
 */
export function SearchBar({
    value,
    onChange,
    placeholder,
    total,
    trouves,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    /** taille de la collection complète */
    total: number;
    /** nombre de résultats après filtre */
    trouves: number;
}) {
    return (
        <div className="searchbar">
            <div className="boite">
                <span className="loupe" aria-hidden="true">⌕</span>
                <input
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    aria-label="Rechercher"
                />
                {value && (
                    <button className="effacer" onClick={() => onChange('')} aria-label="Effacer la recherche">
                        ×
                    </button>
                )}
            </div>
            {value && (
                <span className="nb">
                    {trouves === 0 ? 'Aucun résultat' : `${trouves} résultat${trouves > 1 ? 's' : ''}`} sur {total}
                </span>
            )}
        </div>
    );
}
