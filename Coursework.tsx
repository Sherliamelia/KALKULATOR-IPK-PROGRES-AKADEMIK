import React, { useState, useEffect } from 'react';
// Fix: Added .ts extension for explicit module resolution.
import type { Semester, StudentProfile } from '../types.ts';
// Fix: Added .tsx extension for explicit module resolution.
import SemesterCard from './SemesterCard.tsx';
// Fix: Added .tsx extension for explicit module resolution.
import AddSemesterModal from './AddSemesterModal.tsx';
import CalculationSummary from './CalculationSummary.tsx';
import { generateTranscriptPdf } from '../services/pdfService.ts';

interface CourseworkProps {
  semesters: Semester[];
  onUpdateSemesters: (semesters: Semester[]) => void;
  profile: StudentProfile;
  ipk: number | null;
  totalCredits: number;
  totalQualityPoints: number;
  targetCredits: number;
}

const Coursework: React.FC<CourseworkProps> = ({ 
    semesters, 
    onUpdateSemesters,
    profile,
    ipk,
    totalCredits,
    totalQualityPoints,
    targetCredits
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentlyDeleted, setRecentlyDeleted] = useState<{ semester: Semester; index: number } | null>(null);
  const [undoTimeoutId, setUndoTimeoutId] = useState<number | null>(null);

  useEffect(() => {
    // Cleanup timeout on component unmount
    return () => {
      if (undoTimeoutId) clearTimeout(undoTimeoutId);
    };
  }, [undoTimeoutId]);

  const handleAddSemester = (name: string) => {
    const newSemester: Semester = {
      id: `semester-${Date.now()}`,
      name,
      courses: [],
      ips: null,
    };
    onUpdateSemesters([...semesters, newSemester]);
    setIsModalOpen(false);
  };

  const handleUpdateSemester = (updatedSemester: Semester) => {
    onUpdateSemesters(
      semesters.map(s => (s.id === updatedSemester.id ? updatedSemester : s))
    );
  };

  const handleRemoveSemester = (id: string) => {
    const semesterIndex = semesters.findIndex(s => s.id === id);
    if (semesterIndex === -1) return;

    const semesterToDelete = semesters[semesterIndex];
    
    // Clear any pending undo action
    if (undoTimeoutId) clearTimeout(undoTimeoutId);

    // Store for potential undo
    setRecentlyDeleted({ semester: semesterToDelete, index: semesterIndex });

    // Optimistically remove from UI
    onUpdateSemesters(semesters.filter(s => s.id !== id));

    // Set timeout to finalize deletion
    const timeoutId = window.setTimeout(() => {
      setRecentlyDeleted(null);
    }, 5000); // 5 seconds to undo
    setUndoTimeoutId(timeoutId);
  };
  
  const handleUndoDelete = () => {
    if (!recentlyDeleted) return;

    // Restore semester
    const newSemesters = [...semesters];
    newSemesters.splice(recentlyDeleted.index, 0, recentlyDeleted.semester);
    onUpdateSemesters(newSemesters);

    // Clear undo state
    setRecentlyDeleted(null);
    if (undoTimeoutId) {
      clearTimeout(undoTimeoutId);
      setUndoTimeoutId(null);
    }
  };
  
  const handleDownloadTranscript = () => {
    generateTranscriptPdf(semesters, profile, ipk, totalCredits);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Input Nilai Perkuliahan</h1>
          <p className="text-gray-500">Tambah, ubah, atau hapus data semester dan mata kuliah Anda.</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleDownloadTranscript}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-md transition flex items-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={semesters.length === 0}
            title={semesters.length === 0 ? "Tambahkan data semester terlebih dahulu" : "Unduh Transkrip Lengkap (PDF)"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh Transkrip
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Tambah Semester
          </button>
        </div>
      </div>

      {semesters.length > 0 ? (
        <>
            <div className="space-y-6">
            {semesters.map(semester => (
                <SemesterCard
                key={semester.id}
                semester={semester}
                profile={profile}
                onUpdateSemester={handleUpdateSemester}
                onRemoveSemester={handleRemoveSemester}
                />
            ))}
            </div>
            <CalculationSummary
                ipk={ipk}
                totalCredits={totalCredits}
                totalQualityPoints={totalQualityPoints}
                targetCredits={targetCredits}
            />
        </>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">Belum ada data semester.</p>
          <p className="text-gray-500 mt-2">Klik "Tambah Semester" untuk memulai.</p>
        </div>
      )}

      {isModalOpen && (
        <AddSemesterModal
          onClose={() => setIsModalOpen(false)}
          onAdd={handleAddSemester}
        />
      )}

      {/* Undo Toast */}
      {recentlyDeleted && (
        <div className="fixed bottom-8 right-8 bg-slate-800 text-white py-3 px-5 rounded-lg shadow-lg flex items-center gap-4 z-50">
          <span>Semester "{recentlyDeleted.semester.name}" dihapus.</span>
          <button
            onClick={handleUndoDelete}
            className="font-bold text-unsri-yellow hover:text-yellow-400"
            aria-label="Urungkan penghapusan semester"
          >
            Urungkan
          </button>
        </div>
      )}
    </div>
  );
};

export default Coursework;