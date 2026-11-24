import { Link } from 'react-router-dom';
import { ServiceChips } from '../components/Sections.jsx';

// Prerendered as dist/404.html, which Cloudflare Pages serves (with a 404 status) for unknown URLs.

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container center-head">
        <p className="mono-label">404</p>
        <h1>This page took a <em>wrong turn.</em></h1>
        <p className="muted">See our detailing services or book online.</p>
        <ServiceChips home />
        <Link to="/book" className="btn btn-primary btn-lg">Book online</Link>
      </div>
    </section>
  );
}
