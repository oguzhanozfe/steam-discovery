export function AdSlot({ placement }: { placement: string }) {
  return (
    <aside className="ad-slot" aria-label="Advertising space" data-ad-placement={placement}>
      <span className="ad-label">ADVERTISEMENT SPACE</span>
      <div><strong>Sponsorship space available</strong><p>No paid sponsor is featured in this space.</p></div>
      <a href="/about/#advertising">Advertising policy →</a>
    </aside>
  );
}
