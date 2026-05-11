import { Calendar, FileText, Hash, Download, Building2 } from 'lucide-react';
import PageShell from '@/components/layout/PageShell';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Admission Notice — Department of Mechanical Engineering',
  description:
    'Official notice from Sonargaon University regarding the Summer-2026 Admission Fair Inauguration Ceremony.',
};

const NOTICE_FILE = '/assets/admission-notice-summer-2026.pdf';

export default function AdmissionNoticePage() {
  return (
    <PageShell
      title="Admission Notice"
      overline="Admission"
      image="/assets/admission-hero.jpg"
      imagePosition="top"
      contentClassName="bg-gray-50 py-12 md:py-20"
    >
      <Container>
        {/* Notice document card */}
        <article className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          {/* Letterhead */}
          <header className="bg-gradient-to-r from-primary to-accent text-white px-6 md:px-10 py-7 md:py-8 text-center">
            <div className="inline-flex items-center gap-3 text-button-yellow mb-2">
              <Building2 size={18} />
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase">
                Office of the Registrar
              </span>
            </div>
            <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold uppercase tracking-wide">
              Sonargaon University (SU)
            </h2>
            <div className="mt-3 inline-block px-4 py-1 rounded-full bg-white/15 border border-white/25">
              <span className="text-[12px] font-bold tracking-[0.4em] uppercase text-button-yellow">
                Notice
              </span>
            </div>
          </header>

          {/* Meta row */}
          <div className="px-6 md:px-10 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Hash size={15} className="text-accent" />
              <span className="font-semibold text-gray-700">Ref No:</span>
              <span className="font-mono text-gray-800">SU/Reg/Notice/2026/74</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={15} className="text-accent" />
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="text-gray-800">March 05, 2026</span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 md:px-10 py-8 md:py-10">
            <div className="mb-6">
              <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-accent mb-1">
                Subject
              </span>
              <h3 className="font-display text-lg md:text-xl font-bold text-primary leading-snug">
                Attendance at the Inauguration Ceremony of the Summer-2026 Admission Fair
              </h3>
            </div>

            <div className="space-y-5 text-[15px] md:text-[16px] leading-[1.85] text-gray-800 text-justify">
              <p>
                By order of the university authority, this is to inform all Deans of Faculties, Heads of Departments, Coordinators, and Section / Office Heads that the Inauguration Ceremony of the <strong>Summer-2026 Admission Fair</strong> has been scheduled for <strong>tomorrow, March 06, 2026, at 04:00 PM</strong> at the 147/I, Green Road building of Sonargaon University.
              </p>

              <p>
                The ceremony will be presided over by the Honourable Vice-Chancellor (Acting) of the University, <strong>Professor Dr. Mohammad Ekramul Islam</strong>.
              </p>

              <p>
                <strong>Advocate Umme Salma</strong>, Honourable Member of the Board of Trustees, SU Trust, has kindly consented to grace the occasion as the <em>Chief Guest</em>. Additionally, the Honourable Advisor of Sonargaon University, <strong>Mr. Azizul Bari (Shipu)</strong>, will be present as the <em>Inaugurator</em> of the event.
              </p>

              <p className="font-semibold text-primary">
                All concerned are requested to attend the inauguration ceremony at the scheduled time.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-10 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-600 italic mb-6">
                By order of the Vice-Chancellor (Acting),
              </p>
              <div>
                <p className="font-display font-bold text-primary text-base">S. M. Nurul Huda</p>
                <p className="text-sm text-gray-600">Registrar</p>
              </div>
            </div>

            {/* Cc */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent mb-3">
                Copy for Kind Information (not according to seniority)
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-[14px] text-gray-700">
                <li>Office of the Board of Trustees, SU Trust</li>
                <li>Office of the Vice-Chancellor</li>
                <li>Office of the Pro-Vice-Chancellor</li>
                <li>Office of the Treasurer</li>
                <li>Office File</li>
              </ol>
            </div>
          </div>
        </article>

        {/* Download CTA */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
              <FileText size={22} strokeWidth={1.75} />
            </div>
            <div>
              <h4 className="font-display font-bold text-primary text-base">
                Official Notice Document
              </h4>
              <p className="text-sm text-gray-600">
                Download the original signed notice as a PDF.
              </p>
            </div>
          </div>

          <a
            href={NOTICE_FILE}
            download="SU-Admission-Notice-Summer-2026.pdf"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-md shadow-md hover:shadow-lg hover:brightness-110 transition-all whitespace-nowrap"
          >
            <Download size={18} />
            Download Notice (PDF)
          </a>
        </div>
      </Container>
    </PageShell>
  );
}
