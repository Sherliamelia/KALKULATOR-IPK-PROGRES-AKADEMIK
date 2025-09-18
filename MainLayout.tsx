// Fix: Implemented the missing MainLayout component.
import React, { useState, useMemo, useCallback } from 'react';
import Sidebar from './Sidebar.tsx';
import Dashboard from './Dashboard.tsx';
import Coursework from './Coursework.tsx';
import Reports from './Reports.tsx';
import Settings from './Settings.tsx';
import type { UserData, View, StudentProfile, Semester } from '../types.ts';
import { getGradeDetailsFromScore } from '../constants.ts';

interface MainLayoutProps {
    userData: UserData;
    onSave: (updatedData: UserData) => void;
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ userData, onSave, onLogout }) => {
    const [view, setView] = useState<View>('dashboard');

    const academicData = useMemo(() => {
        let totalCredits = 0;
        let totalQualityPoints = 0;
        
        const ipkProgression: { name: string; ipk: number | null }[] = [];
        let cumulativeCredits = 0;
        let cumulativeQualityPoints = 0;

        userData.semesters.forEach(semester => {
            let semesterCredits = 0;
            let semesterQualityPoints = 0;

            semester.courses.forEach(course => {
                if (course.score !== null && course.credits > 0) {
                    const gradeDetails = getGradeDetailsFromScore(course.score);
                    semesterCredits += course.credits;
                    semesterQualityPoints += gradeDetails.point * course.credits;
                }
            });

            totalCredits += semesterCredits;
            totalQualityPoints += semesterQualityPoints;

            if (semester.courses.filter(c => c.score !== null).length > 0) {
                 cumulativeCredits += semesterCredits;
                 cumulativeQualityPoints += semesterQualityPoints;
                 const currentIpk = cumulativeCredits > 0 ? cumulativeQualityPoints / cumulativeCredits : null;
                 ipkProgression.push({ name: semester.name, ipk: currentIpk });
            } else {
                 const lastIpk = ipkProgression.length > 0 ? ipkProgression[ipkProgression.length-1].ipk : null;
                 ipkProgression.push({ name: semester.name, ipk: lastIpk });
            }
        });

        const ipk = totalCredits > 0 ? totalQualityPoints / totalCredits : null;
        return { ipk, totalCredits, totalQualityPoints, ipkProgression };
    }, [userData.semesters]);

    const handleUpdateSemesters = useCallback((updatedSemesters: Semester[]) => {
        onSave({ ...userData, semesters: updatedSemesters });
    }, [userData, onSave]);

    const handleSaveProfile = (updatedProfile: StudentProfile) => {
        onSave({ ...userData, profile: updatedProfile });
    };

    const handleChangePassword = (oldPassword: string, newPassword: string): boolean => {
        if (userData.password === oldPassword) {
            onSave({ ...userData, password: newPassword });
            return true;
        }
        return false;
    };
    
    const handleResetCourses = () => {
        handleUpdateSemesters([]);
    };

    const renderContent = () => {
        switch (view) {
            case 'coursework':
                return <Coursework 
                    semesters={userData.semesters} 
                    onUpdateSemesters={handleUpdateSemesters}
                    profile={userData.profile}
                    ipk={academicData.ipk}
                    totalCredits={academicData.totalCredits}
                    totalQualityPoints={academicData.totalQualityPoints}
                    targetCredits={144} // Example target, could be configurable
                />;
            case 'reports':
                return <Reports 
                    semesters={userData.semesters} 
                    profile={userData.profile}
                    ipk={academicData.ipk}
                    totalCredits={academicData.totalCredits}
                />;
            case 'profile':
                return <Settings 
                    profile={userData.profile} 
                    onSaveProfile={handleSaveProfile}
                    onChangePassword={handleChangePassword}
                    onResetCourses={handleResetCourses}
                />;
            case 'dashboard':
            default:
                return <Dashboard 
                    semesters={userData.semesters}
                    ipk={academicData.ipk}
                    totalCredits={academicData.totalCredits}
                    ipkProgression={academicData.ipkProgression}
                />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-200 text-gray-800">
            <Sidebar 
                view={view}
                setView={setView}
                onLogout={onLogout}
                user={userData.profile}
            />
            <main className="flex-1 p-8 overflow-y-auto">
                {renderContent()}
            </main>
        </div>
    );
};

export default MainLayout;