import {useMemo, type FC} from 'react';
import {Chart, type AxisOptions} from 'react-charts';
import {getKCalForDay} from '../../utils/kcal';
import {type Day} from '../kcal';

export const DailyChart: FC<{days: Day[]}> = ({days}) => {
  const primaryAxis = useMemo(
    (): AxisOptions<Day> => ({
      getValue: (day) => `${day.date.getDate()}.${day.date.getMonth()}`,
      showGrid: false,
      outerBandPadding: 0.1,
      shouldNice: false,
      invert: true,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<Day>[] => [
      {
        getValue: (day) => getKCalForDay(day),
        elementType: 'area',
        show: true,
        tickCount: 1,
        showGrid: true,
      },
    ],
    [],
  );
  if (days.length === 0) return;

  return (
    <div className='w-full p-4'>
      <p className='pb-1 text-sm text-gray'>Last 7 days</p>
      <div className='h-64 w-full rounded-xl border border-orange-light'>
        <Chart
          options={{
            data: [{data: days.slice(0, 7)}],
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