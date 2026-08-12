/**
 * Which room each office, classroom and laboratory is in.
 *
 * Follows the department's own Layout Plan: the headed block naming the
 * university and the department, then the three columns the document uses —
 * serial, the room's name, its number — with the building carried underneath
 * the number where the document puts it in a remarks column.
 *
 * The department's own rooms are marked. That is the one departure, and it
 * changes neither the content nor the order: on a department's own site,
 * those are the rows most visitors came for.
 */

export type Room = {
  id: string;
  name: string;
  room: string;
  building: string;
};

/** The rows that belong to this department rather than to the university. */
const DEPARTMENTAL = /head of the department|coordinator|teachers room|classroom|lab/i;

export default function RoomDirectory({
  rooms,
  departmentName,
}: {
  rooms: Room[];
  departmentName: string;
}) {
  if (rooms.length === 0) return null;

  /* The document repeats one building down most of the column and abbreviates
     the rest with a ditto mark; naming it once above the table says the same
     thing without the repetition. */
  const buildings = [...new Set(rooms.map((r) => r.building).filter(Boolean))];
  const common = buildings.length > 0 ? buildings[0] : null;

  return (
    <section className="mx-auto max-w-5xl">
      <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm">
        <header className="border-b border-gray-300 px-6 py-6 text-center">
          <h2 className="font-display text-xl font-bold text-primary md:text-2xl">
            Sonargaon University
          </h2>
          <p className="mt-1 text-[15px] text-gray-700">{departmentName}</p>
          {common && buildings.length === 1 && (
            <p className="mt-0.5 text-[13.5px] text-gray-500">{common}</p>
          )}
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left align-top text-[15px]">
            <caption className="sr-only">
              Offices, classrooms and laboratories, and the room each is in
            </caption>
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50 text-[13px] font-bold text-gray-700">
                <th scope="col" className="px-5 py-3 md:px-6">
                  S/N
                </th>
                {/* Takes the slack, so the space the card does not need falls
                    between the columns rather than off the right of each row. */}
                <th scope="col" className="w-full px-5 py-3 md:px-6">
                  Offices and Classrooms
                </th>
                <th scope="col" className="px-5 py-3 whitespace-nowrap md:px-6">
                  Room No / Layout
                </th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((r, index) => {
                const isDepartmental = DEPARTMENTAL.test(r.name);
                return (
                  <tr key={r.id} className="border-b border-gray-200 last:border-b-0">
                    <td className="px-5 py-3.5 align-top text-gray-400 tabular-nums md:px-6">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-5 py-3.5 align-top md:px-6">
                      <span
                        className={isDepartmental ? 'font-semibold text-primary' : 'text-gray-800'}
                      >
                        {r.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 align-top whitespace-nowrap md:px-6">
                      <span className="font-semibold text-gray-800">{r.room}</span>
                      {r.building && r.building !== common && (
                        <span className="block text-[13px] text-gray-500">{r.building}</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {buildings.length > 1 && common && (
        <p className="mt-4 text-center text-[13px] text-gray-500">
          Rooms are at {common} unless another building is named beside the number.
        </p>
      )}
    </section>
  );
}
