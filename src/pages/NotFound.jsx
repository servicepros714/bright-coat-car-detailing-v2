import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="section notfound">
      <div className="container center-head">
        <p className="mono-label">404</p>
        <h1>This page took a <em>wrong turn.</em></h1>
        <Link to="/" className="btn btn-primary btn-lg">Back to home</Link>
      </div>
    </section>
  );
}
