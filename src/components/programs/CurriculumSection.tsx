'use client';

import { useState } from 'react';
import { BookOpen, ChevronDown, Download, Table2 } from 'lucide-react';

export type Course = {
  serial: number;
  code: string;
  title: string;
  theory: number;
  sessional: number;
  total: number;
};

export type Semester = {
  name: string;
  credits: number;
  courses: Course[];
};

export type CreditRow = {
  semester: string;
  theory: number;
  sessional: number;
  total: number;
  cumulative: number;
};

/** Trailing zeros read as noise on a page of 3.00s and 0.75s. */
const credits = (value: number) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0$/, '');

export default function CurriculumSection({
  semesters,
  creditRows,
  pdfUrl,
  pdfFileName,
}: {
  semesters: Semester[];
  creditRows: CreditRow[];
  pdfUrl: string | null;
  pdfFileName: string | null;
}) {
  /* The first semester is open, the rest closed: twelve semesters of seven
     courses is a wall of table if they all start expanded, and the one a
     visitor most often wants is the one they would start at. */
  const [open, setOpen] = useState<string | null>(semesters[0]?.name ?? null);

  if (semesters.length === 0) return null;

  const total = creditRows.length > 0 ? creditRows[creditRows.length - 1].cumulative : 0;

  return (
    <section className="bg-gray-50 py-14 md:py-20">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <header className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <span className="mb-2 inline-flex items-center gap-2 text-[13px] font-bold tracking-wider text-accent uppercase">
            <BookOpen size={15} aria-hidden />
            Curriculum
          </span>
          <h2 className="font-display text-2xl font-bold text-primary md:text-3xl">
            Course Structure
          </h2>
          <p className="mt-3 text-[15px] leading-[1.85] text-gray-600">
            {semesters.length} semesters · {credits(total)} credits in total. Open a semester to
            see the courses it carries.
          </p>
        </header>

        <div className="mx-auto max-w-5xl space-y-3">
          {semesters.map((semester) => {
            const isOpen = open === semester.name;
            return (
              <div
                key={semester.name}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : semester.name)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50 md:px-6"
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-bold text-primary md:text-base">
                      {semester.name}
                    </span>
                    <span className="block text-[13px] text-gray-500">
                      {semester.courses.length} courses · {credits(semester.credits)} credits
                    </span>
                  </span>
                  <ChevronDown
                    size={18}
                    aria-hidden
                    className={`shrink-0 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="overflow-x-auto border-t border-gray-100">
                    <table className="w-full text-left text-[14.5px]">
                      <caption className="sr-only">
                        Courses in {semester.name}, with their credits
                      </caption>
                      <thead>
                        <tr className="bg-gray-50 text-[11.5px] font-bold tracking-wider text-gray-500 uppercase">
                          <th scope="col" className="px-5 py-2.5 whitespace-nowrap">
                            Code
                          </th>
                          <th scope="col" className="w-full px-5 py-2.5">
                            Course
                          </th>
                          <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                            Theory
                          </th>
                          <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                            Sessional
                          </th>
                          <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                            Credits
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {semester.courses.map((course) => (
                          <tr
                            key={`${course.code}-${course.serial}`}
                            className="border-t border-gray-100"
                          >
                            <td className="px-5 py-3 font-mono text-[13px] whitespace-nowrap text-primary">
                              {course.code}
                            </td>
                            <td className="px-5 py-3 text-gray-800">{course.title}</td>
                            <td className="px-5 py-3 text-right text-gray-500 tabular-nums">
                              {course.theory > 0 ? credits(course.theory) : '—'}
                            </td>
                            <td className="px-5 py-3 text-right text-gray-500 tabular-nums">
                              {course.sessional > 0 ? credits(course.sessional) : '—'}
                            </td>
                            <td className="px-5 py-3 text-right font-semibold text-gray-800 tabular-nums">
                              {credits(course.total)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {creditRows.length > 0 && (
          <div className="mx-auto mt-12 max-w-5xl">
            <h3 className="font-display mb-4 text-center text-lg font-bold text-primary md:text-xl">
              Credit Distribution
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
              <table className="w-full text-left text-[14.5px]">
                <caption className="sr-only">Credits per semester, and the running total</caption>
                <thead>
                  <tr className="bg-gray-50 text-[11.5px] font-bold tracking-wider text-gray-500 uppercase">
                    <th scope="col" className="w-full px-5 py-2.5">
                      Semester
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                      Theory
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                      Sessional
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                      Total
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-right whitespace-nowrap">
                      Cumulative
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {creditRows.map((row) => (
                    <tr key={row.semester} className="border-t border-gray-100">
                      <td className="px-5 py-2.5 text-gray-800">{row.semester}</td>
                      <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                        {credits(row.theory)}
                      </td>
                      <td className="px-5 py-2.5 text-right text-gray-500 tabular-nums">
                        {credits(row.sessional)}
                      </td>
                      <td className="px-5 py-2.5 text-right font-semibold text-gray-800 tabular-nums">
                        {credits(row.total)}
                      </td>
                      <td className="px-5 py-2.5 text-right text-primary tabular-nums">
                        {credits(row.cumulative)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pdfUrl && (
          <div className="mx-auto mt-10 max-w-5xl">
            <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-7 text-center shadow-sm sm:flex-row sm:text-left">
              <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md">
                <Table2 size={22} strokeWidth={1.75} aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-display text-[15px] font-bold text-primary">
                  Course structure and credit distribution
                </p>
                <p className="text-sm text-gray-500">The tables on this page, as a PDF you can keep.</p>
              </div>
              <a
                href={pdfUrl}
                download={pdfFileName ?? undefined}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-white shadow-md transition-colors hover:bg-primary/90"
              >
                <Download size={17} aria-hidden />
                Download PDF
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
