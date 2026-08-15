import Link from 'next/link';

type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  after?: string;
};

type LegalContentProps = {
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
  contactNote?: string;
};

export default function LegalContent({
  lastUpdated,
  intro,
  sections,
  contactNote,
}: LegalContentProps) {
  return (
    <section className="section-padding bg-white">
      <div className="container">
        <article className="max-w-3xl mx-auto">
          <p className="text-sm text-purple-700 font-medium mb-8">
            Last updated: {lastUpdated}
          </p>
          <p className="text-gray-600 leading-relaxed mb-12">{intro}</p>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph} className="text-gray-600 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
                {section.bullets ? (
                  <ul className="list-disc pl-6 space-y-2 text-gray-600 mb-4">
                    {section.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {section.after ? (
                  <p className="text-gray-600 leading-relaxed">{section.after}</p>
                ) : null}
              </div>
            ))}
          </div>

          {contactNote ? (
            <div className="mt-12 bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <p className="text-gray-700 leading-relaxed">{contactNote}</p>
              <p className="mt-4">
                <a
                  href="mailto:teamgzura@gmail.com"
                  className="text-purple-700 font-medium hover:underline"
                >
                  teamgzura@gmail.com
                </a>
                {' · '}
                <a
                  href="tel:6360685656"
                  className="text-purple-700 font-medium hover:underline"
                >
                  6360685656
                </a>
              </p>
            </div>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-4 text-sm">
            <Link href="/privacy" className="text-purple-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-purple-700 hover:underline">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-purple-700 hover:underline">
              Cookie Policy
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
