import {useEffect, useMemo, useState, type FC} from 'react';
import {Chart, type AxisOptions} from 'react-charts';
import {useDb, type Meal} from '../../provider/database';
import {getKCalForEntries} from '../../utils/kcal';

type DateWithKCal = {date: string; kcal: number};

export const DailyChart: FC<{days: [string, Meal[] | undefined][]}> = ({
  days,
}) => {
  const db = useDb();
  const [daysWithKCal, setDaysWithKCal] = useState<DateWithKCal[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const dayWithKCal: DateWithKCal[] = [];

      for await (const [date, meals] of days) {
        const entryIds = meals?.flatMap((meal) => meal.entryIds) ?? [];
        const entries = await db.entries.where('id').anyOf(entryIds).toArray();
        dayWithKCal.push({date, kcal: getKCalForEntries(entries)});
      }

      return dayWithKCal;
    };

    loadData().then((res) => setDaysWithKCal(res));
  }, [days, db.entries]);

  const primaryAxis = useMemo(
    (): AxisOptions<DateWithKCal> => ({
      getValue: (day) => {
        const date = new Date(day.date);

        return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      },
      showGrid: false,
      outerBandPadding: 0.2,
      shouldNice: false,
      invert: true,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<DateWithKCal>[] => [
      {
        getValue: (day) => day.kcal,
        elementType: 'bar',
        show: true,
        tickCount: 1,
        showGrid: true,
      },
    ],
    [],
  );

  const avg = Math.floor(
    daysWithKCal.reduce((acc, day) => acc + day.kcal, 0) / days.length,
  );

  if (daysWithKCal.length === 0) return null;

  return (
    <div className='w-full p-4'>
      <div className='flex justify-between pb-1 text-sm text-gray'>
        <p>Last 7 days</p>
        <p>avg. {avg} kcal</p>
      </div>

      <div className='h-64 w-full rounded-xl border border-orange-light'>
        <Chart
          options={{
            data: [{data: daysWithKCal}],
            primaryAxis,
            secondaryAxes,
            padding: 16,
            tooltip: false,
            dark: true,
            defaultColors: ['#9EB353'],
          }}
        />
      </div>
    </div>
  );
};
