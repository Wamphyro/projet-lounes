import { STATS } from '@/lib/site-config';

/** Chiffres clés — pilotés par STATS (site-config). */
export function Stats() {
    return (
        <div className="stats" data-reveal>
            {STATS.map((s) => (
                <div className="stat" key={s.label}>
                    <div className="num">{s.num}</div>
                    <div className="label">{s.label}</div>
                </div>
            ))}
        </div>
    );
}
