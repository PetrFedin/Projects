'use client';

import { useState, useEffect } from 'react';

interface MetaverseCountdownProps {
  targetDate: Date;
}

const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date();
  let timeLeft = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export default function MetaverseCountdown({ targetDate }: MetaverseCountdownProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="flex justify-center gap-3 md:gap-3">
      <div className="w-24 rounded-lg border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm md:w-32">
        <p className="font-headline text-sm font-bold md:text-base">
          {formatNumber(timeLeft.days)}
        </p>
        <p className="text-sm uppercase tracking-widest text-gray-300 md:text-base">Дней</p>
      </div>
      <div className="w-24 rounded-lg border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm md:w-32">
        <p className="font-headline text-sm font-bold md:text-base">
          {formatNumber(timeLeft.hours)}
        </p>
        <p className="text-sm uppercase tracking-widest text-gray-300 md:text-base">Часов</p>
      </div>
      <div className="w-24 rounded-lg border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm md:w-32">
        <p className="font-headline text-sm font-bold md:text-base">
          {formatNumber(timeLeft.minutes)}
        </p>
        <p className="text-sm uppercase tracking-widest text-gray-300 md:text-base">Минут</p>
      </div>
      <div className="w-24 rounded-lg border border-white/10 bg-white/10 p-4 text-center backdrop-blur-sm md:w-32">
        <p className="font-headline text-sm font-bold md:text-base">
          {formatNumber(timeLeft.seconds)}
        </p>
        <p className="text-sm uppercase tracking-widest text-gray-300 md:text-base">Секунд</p>
      </div>
    </div>
  );
}
