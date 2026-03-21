import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-primary-100 mt-auto" role="contentinfo">
      {/* Decorative geometric border */}
      <div className="h-1 bg-gradient-to-r from-accent-400 via-primary-400 to-accent-400" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-arabic"
                aria-hidden="true"
              >
                ع
              </span>
              <span className="text-white font-bold text-lg">AQ Academy</span>
            </div>
            <p className="text-primary-300 text-sm leading-relaxed">
              Helping non-Arabic-speaking children aged 5–12 learn Arabic and
              Quran through engaging, structured lessons with qualified teachers.
            </p>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer navigation">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Quick Links
            </h2>
            <ul className="flex flex-col gap-2" role="list">
              {[
                { href: "/", label: "Home" },
                { href: "/program", label: "Programs" },
                { href: "/contact", label: "Contact Us" },
                { href: "/login", label: "Login / Subscribe" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-primary-300 hover:text-white text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact info */}
          <div>
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Contact
            </h2>
            <address className="not-italic text-primary-300 text-sm flex flex-col gap-2">
              <a
                href="mailto:info@aqacademy.example.com"
                className="hover:text-white transition-colors"
              >
                info@aqacademy.example.com
              </a>
              <p>Online — worldwide classes</p>
            </address>

            {/* Accessibility note */}
            <div className="mt-4 text-xs text-primary-400 leading-relaxed">
              Our platform is designed with accessibility in mind. If you need
              assistance, please{" "}
              <Link href="/contact" className="underline hover:text-white transition-colors">
                contact us
              </Link>
              .
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-primary-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-primary-400">
          <p>
            &copy; {currentYear} AQ Academy. All rights reserved.
          </p>
          <p className="text-center">
            Designed with care for young learners &amp; their families.
          </p>
        </div>
      </div>
    </footer>
  );
}
