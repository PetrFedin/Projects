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
      <div className="text-center p-4 bg-white/10 rounded-lg w-24 md:w-32 backdrop-blur-sm border border-white/10">
        <p className="font-headline text-sm md:text-base font-bold">{formatNumber(timeLeft.days)}</p>
        <p className="text-sm md:text-base text-gray-300 uppercase tracking-widest">Дней</p>
      </div>
      <div className="text-center p-4 bg-white/10 rounded-lg w-24 md:w-32 backdrop-blur-sm border border-white/10">
        <p className="font-headline text-sm md:text-base font-bold">{formatNumber(timeLeft.hours)}</p>
        <p className="text-sm md:text-base text-gray-300 uppercase tracking-widest">Часов</p>
      </div>
      <div className="text-center p-4 bg-white/10 rounded-lg w-24 md:w-32 backdrop-blur-sm border border-white/10">
        <p className="font-headline text-sm md:text-base font-bold">{formatNumber(timeLeft.minutes)}</p>
        <p className="text-sm md:text-base text-gray-300 uppercase tracking-widest">Минут</p>
      </div>
      <div className="text-center p-4 bg-white/10 rounded-lg w-24 md:w-32 backdrop-blur-sm border border-white/10">
        <p className="font-headline text-sm md:text-base font-bold">{formatNumber(timeLeft.seconds)}</p>
        <p className="text-sm md:text-base text-gray-300 uppercase tracking-widest">Секунд</p>
      </div>
    </div>
  );
}
