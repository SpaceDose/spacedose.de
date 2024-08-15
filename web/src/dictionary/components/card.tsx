import {PencilIcon} from '@heroicons/react/24/solid';
import {motion} from 'framer-motion';
import {useState, type FC} from 'react';
import {useNavigate} from 'react-router-dom';
import {type Vocabulary} from '../../provider/database';

type CardProps = {
  vocabulary: Vocabulary;
};

export const Card: FC<CardProps> = ({vocabulary}) => {
  const navigate = useNavigate();
  const [visibleSide, setVisibleSide] = useState<'front' | 'back'>('front');

  return (
    <div className='h-32 w-full shrink-0 px-4 py-2 text-lg perspective-1000'>
      <motion.div
        animate={{rotateY: visibleSide === 'front' ? 0 : 180}}
        onClick={() =>
          setVisibleSide(visibleSide === 'front' ? 'back' : 'front')
        }
        style={{transformStyle: 'preserve-3d'}}
        transition={{duration: 0.1}}
        className='relative size-full'
      >
        <div className='absolute flex size-full items-center justify-center rounded-xl border border-purple-light bg-purple/10 px-4 text-purple-light shadow backface-hidden'>
          {vocabulary.english}
        </div>

        <div className='absolute flex size-full items-center justify-center rounded-xl border border-green-light bg-green/10 px-4 text-green-light shadow rotate-y-180 backface-hidden'>
          {vocabulary.german}
        </div>
      </motion.div>
      <button
        className='absolute right-0 top-0 mx-7 my-5 size-6 rounded-full bg-black p-1.5 text-gray'
        onClick={() => navigate(`./${vocabulary.id}`)}
      >
        <PencilIcon />
      </button>
    </div>
  );
};
