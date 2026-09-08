import { ReferenceRegister } from './source-references';
import advertisingReferences from './data/advertising-sources.json';

export function AdvertisingPolicy() {
  return <section id="advertising" className="surface-panel editorial-panel">
    <h2>Advertising & editorial independence</h2>
    <p>Advertising is kept separate from our research. Paid placements will identify the advertiser and appear in clearly labeled blocks. Payment does not determine our findings, comparisons or source selection. A placement does not imply endorsement by the publications or developers we cite.</p>
    <h3>Current status</h3>
    <p>The site currently displays sponsorship availability notices, not paid campaigns. These blocks contain no ad-network scripts or advertising cookies. No advertiser, affiliate relationship or advertising-network approval is implied.</p>
    <p>Before enabling a third-party advertising service, we will configure the real publisher account, update the disclosures and implement the applicable consent controls. We have not published a placeholder publisher ID or seller declaration.</p>
    <p>Research citations are evidence links, not advertisements. Sponsored links, if introduced, will be identified separately and marked as sponsored in their link metadata.</p>
    <h3>Publisher guidance</h3>
    <p>The references below inform implementation planning. They are not a certification that this site is approved by Google or compliant with every jurisdiction.</p>
    <ReferenceRegister references={advertisingReferences} />
  </section>;
}
