function Footer() {
  return (
    <footer>
      <div className="footer-content" id="contact_anchor">
        <h3>HALCYON 2025</h3>
        <ul className="links">
          <li><a href="/RegisterLogin">Register</a></li>
          <li><a href="/faqpage">FAQ</a></li>
        </ul>
        <p>Contact us at : 6656555626</p>
        <p>Reach us at : <a href="mailto:halcyon25@gmail.com">halcyon25@gmail.com</a></p>
        <ul className="socials">
          <li><a href="#"><i className="fab fa-facebook"></i></a></li>
          <li><a href="#"><i className="fab fa-twitter"></i></a></li>
          <li><a href="#"><i className="fab fa-instagram"></i></a></li>
          <li><a href="#"><i className="fab fa-youtube"></i></a></li>
          <li><a href="#"><i className="fab fa-linkedin"></i></a></li>
        </ul>
      </div>
      <div className="footer-bottom">
        <p>Halcyon 2025 <span>all rights reserved</span></p>
      </div>
    </footer>
  );
}

export default Footer;