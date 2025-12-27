import { useState, useEffect } from 'react';

const STORAGE_KEY = 'wordvia_first_visit';

interface VisitData {
  isFirstVisit: boolean;
  firstVisitDate: string | null;
  visitCount: number;
}

export function useFirstVisit() {
  const [visitData, setVisitData] = useState<VisitData>({
    isFirstVisit: false,
    firstVisitDate: null,
    visitCount: 0,
  });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      // First time visitor
      const now = new Date().toISOString();
      const data: VisitData = {
        isFirstVisit: true,
        firstVisitDate: now,
        visitCount: 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setVisitData(data);
    } else {
      // Returning visitor
      const parsed = JSON.parse(stored) as VisitData;
      const updated: VisitData = {
        isFirstVisit: false,
        firstVisitDate: parsed.firstVisitDate,
        visitCount: parsed.visitCount + 1,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setVisitData(updated);
    }
  }, []);

  const markAsReturning = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as VisitData;
      parsed.isFirstVisit = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      setVisitData(parsed);
    }
  };

  return { ...visitData, markAsReturning };
}
