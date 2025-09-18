
export interface GradeDetails {
  letter: string;
  point: number;
  color: string;
}

export const TARGET_SKS = 144;

export const GRADE_SCALE: { minScore: number; details: GradeDetails }[] = [
  { minScore: 86, details: { letter: 'A', point: 4.0, color: 'text-green-500' } },
  { minScore: 71, details: { letter: 'B', point: 3.0, color: 'text-blue-500' } },
  { minScore: 56, details: { letter: 'C', point: 2.0, color: 'text-yellow-500' } },
  { minScore: 40, details: { letter: 'D', point: 1.0, color: 'text-orange-500' } },
  { minScore: 0, details: { letter: 'E', point: 0.0, color: 'text-red-500' } },
];

export const getGradeDetailsFromScore = (score: number | null): GradeDetails => {
  if (score === null || score < 0 || score > 100) {
    return { letter: '-', point: 0, color: 'text-gray-500' };
  }
  const grade = GRADE_SCALE.find(g => score >= g.minScore);
  return grade ? grade.details : { letter: 'E', point: 0.0, color: 'text-red-500' };
};

// Fungsi baru untuk mendapatkan nilai huruf dari bobot
export const getGradeLetterFromPoint = (point: number | null): string => {
    if (point === null || point < 0 || point > 4) return '-';
    // Cari bobot yang paling mendekati dari skala yang ada
    const closestGrade = GRADE_SCALE.reduce((prev, curr) => {
        return (Math.abs(curr.details.point - point) < Math.abs(prev.details.point - point) ? curr : prev);
    });
    // Hanya tampilkan jika bobotnya sama persis untuk menghindari ambiguitas
    if (closestGrade.details.point === point) {
        return closestGrade.details.letter;
    }
    return '?';
};