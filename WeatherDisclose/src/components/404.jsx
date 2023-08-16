function ErrorContent() {
  return (
    <section className="error-content" data-error-content>
      <h2 className="heading">404</h2>
      <p className="body-1">Page Not Found</p>
      <a href="/" className="btn-primary">
        <span>Go Home</span>
      </a>
    </section>
  );
}

export default ErrorContent;
