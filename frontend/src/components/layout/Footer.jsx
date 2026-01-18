// src/components/layout/Footer.jsx
function Footer() {
  return (
    <footer className="bg-islamic-green/90 border-t border-gold/20 py-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 text-center text-stone">
        <p>© {new Date().getFullYear()} Tārīkh al-Islām • Preserving Islamic History</p>
        <p className="mt-2 text-sm">A scholarly platform for verified historical events</p>
      </div>
    </footer>
  );
}

export default Footer;   // ← important line