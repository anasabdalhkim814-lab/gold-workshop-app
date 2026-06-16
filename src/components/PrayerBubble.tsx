import { useState, useEffect } from 'react';
import { PRAYERS } from '../store/types';

export default function PrayerBubble() {
  const [prayer, setPrayer] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => {
      setPrayer(PRAYERS[Math.floor(Math.random() * PRAYERS.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    };
    show();
    const id = setInterval(show, 120000);
    return () => clearInterval(id);
  }, []);

  if (!visible || !prayer) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 animate-fadeInUp">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-sm max-w-xs leading-relaxed">
        {prayer}
      </div>
    </div>
  );
}
