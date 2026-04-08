import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content" id="contact_anchor">
        <h3 className="footer-title">HALCYON 2026</h3>

        <div className="footer-grid">
          {/* Executive Committee Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Executive Committee</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">CEO</span><span className="contact-info">: DR. SHIVAKUMARAIAH</span>
              </li>
              <li>
                <span className="contact-name">PRINCIPAL</span><span className="contact-info">: DR. S V DINESH</span>
              </li>
              <li>
                <span className="contact-name">CULTURAL CO-ORDINATOR</span><span className="contact-info">: DR. SAGAR T S</span>
              </li>
            </ul>

            <h4 className="footer-section-title mobile-section-spacing">Registration</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">SUMUKHA BHARADWAJ</span><span className="contact-info">: 72047 66483</span>
              </li>
              <li>
                <span className="contact-name">CHAITHRA Y U</span><span className="contact-info">: 84318 70362</span>
              </li>
            </ul>
          </div>

          {/* Student Co-ordinators Section */}
          <div className="footer-section">
            <h4 className="footer-section-title">Student Co-ordinators</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">PRAJWAL GOWDA T</span><span className="contact-info">: 90355 87984</span>
              </li>
              <li>
                <span className="contact-name">JP GOWDA BY</span><span className="contact-info">: 96634 99618</span>
              </li>
              <li>
                <span className="contact-name">SUJAL HUKKERI</span><span className="contact-info">: 86607 65383</span>
              </li>
            </ul>

            <h4 className="footer-section-title mobile-section-spacing">Digital Design</h4>
            <ul className="contact-list">
              <li>
                <span className="contact-name">AAKASH AGADI</span><span className="contact-info">: 98445 84717</span>
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