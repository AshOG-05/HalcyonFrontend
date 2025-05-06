import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content" id="contact_anchor">
        <h3 className="footer-title">HALCYON 2025</h3>

        <div className="footer-grid">
          {/* Executive Committee Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Executive Committee</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">CEO</span>
                <span className="contact-info">: DR. SHIVAKUMARAIAH</span>
              </li>
              <li>
                <span className="contact-name">PRINCIPAL</span>
                <span className="contact-info">: DR. S V DINESH</span>
              </li>
              <li>
                <span className="contact-name">CULTURAL CO-ORDINATOR</span>
                <span className="contact-info">: DR. SAGAR T S</span>
              </li>
            </ul>

            <h4 className="footer-section-title" style={{ marginTop: '2rem' }}>Registration</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">TARUN N</span>
                <span className="contact-info">: 99729 09371</span>
              </li>
              <li>
                <span className="contact-name">ANKITHA G</span>
                <span className="contact-info">: 93539 91404</span>
              </li>
            </ul>
          </div>

          {/* Student Co-ordinators Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Student Co-ordinators</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">SUCHITH S</span>
                <span className="contact-info">: 9481460046</span>
              </li>
              <li>
                <span className="contact-name">NAMITH R K</span>
                <span className="contact-info">: 82963 71301</span>
              </li>
              <li>
                <span className="contact-name">ISHITHA BR</span>
                <span className="contact-info">: 80952 99195</span>
              </li>
            </ul>

            <h4 className="footer-section-title" style={{ marginTop: '2rem' }}>Digital Design</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">AAKASH AGADI</span>
                <span className="contact-info">: 9844584717</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-contact">
          <ul className="socials">
            <li><a href="#"><i className="fab fa-facebook"></i></a></li>
            <li><a href="mailto:halcyon.sit@gmail.com"><i className="fas fa-envelope"></i></a></li>
            <li><a href="https://www.instagram.com/halcyon_official" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p>Halcyon 2025 <span>all rights reserved</span></p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;