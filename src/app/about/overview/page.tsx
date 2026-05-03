import PageShell from '@/components/layout/PageShell';

export const metadata = {
  title: 'Overview — Department of Mechanical Engineering',
  description:
    'Overview of the Department of Mechanical Engineering — programs, vision, and the scope of mechanical engineering as a discipline and a career.',
};

export default function OverviewPage() {
  return (
    <PageShell
      title="Department Overview"
      subtitle="Shaping future leaders where creativity meets technology."
    >
      <div className="space-y-6 text-[16px] md:text-[17px] leading-[1.85] text-gray-800 text-justify">
        <p>
          At the heart of innovation and excellence, the Department of Mechanical Engineering is committed to shaping future leaders in the field. Explore the dynamic world of mechanical engineering, where creativity meets technology, and where ideas transform into groundbreaking solutions.
        </p>

        <p>
          At the Department of Mechanical Engineering, we strive to shape the future of engineering by providing cutting-edge education and research opportunities. With a focus on interdisciplinary collaboration and real-world applications, our department prepares students to tackle complex challenges and contribute to the advancement of technology and society.
        </p>

        <p>
          The main responsibility of the Department of Mechanical Engineering is to design, analyze, test, and manufacture machines and equipment. Mechanical Engineering is a vast and heterogeneous field in respect of the different types of products that the engineers work on, the industry in which they work, and the knowledge they need to become successful.
        </p>

        <p>
          The Mechanical Engineers, who are interested in pursuing a career, have the attributes such as: the idea of what Mechanical Engineers work on, the function that Mechanical Engineers fulfill, the type of work environment, and the industries that they serve. Mechanical engineers are involved in a comprehensive variety of products like aircraft, automobile vehicles, industrial equipment and machinery, engines, turbines, pumps, mechanical handling systems, heating and cooling systems, consumer devices, and so on.
        </p>
      </div>
    </PageShell>
  );
}
