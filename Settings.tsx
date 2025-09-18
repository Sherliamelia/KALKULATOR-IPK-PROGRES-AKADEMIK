import React, { useState } from 'react';
// Fix: Added .ts extension to the import path for explicit module resolution.
import type { StudentProfile } from '../types.ts';

interface SettingsProps {
    profile: StudentProfile;
    onSaveProfile: (updatedProfile: StudentProfile) => void;
    onChangePassword: (oldPassword: string, newPassword: string) => boolean;
    onResetCourses: () => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onSaveProfile, onChangePassword, onResetCourses }) => {
    const [formData, setFormData] = useState<StudentProfile>(profile);
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
    const [profileSaved, setProfileSaved] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setProfileSaved(false);
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSaveProfile(formData);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        setPasswordMessage({ type: '', text: '' });
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new !== passwords.confirm) {
            setPasswordMessage({ type: 'error', text: 'Password baru tidak cocok.' });
            return;
        }
        if (passwords.new.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password baru minimal 6 karakter.' });
            return;
        }
        const success = onChangePassword(passwords.old, passwords.new);
        if (success) {
            setPasswordMessage({ type: 'success', text: 'Password berhasil diubah!' });
            setPasswords({ old: '', new: '', confirm: '' });
        } else {
            setPasswordMessage({ type: 'error', text: 'Password lama salah.' });
        }
        setTimeout(() => setPasswordMessage({ type: '', text: '' }), 4000);
    };

    const handleReset = () => {
        if (window.confirm('Apakah Anda yakin ingin menghapus semua data nilai? Profil Anda akan tetap tersimpan.')) {
            onResetCourses();
            alert('Semua data nilai telah dihapus.');
        }
    };

    return (
        <div className="space-y-8">
            {/* Profile Settings */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Profil Mahasiswa
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Form fields... */}
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm text-gray-800"/>
                    </div>
                    <div>
                        <label htmlFor="nim" className="block text-sm font-medium text-gray-700">NIM</label>
                        <input type="text" id="nim" name="nim" value={formData.nim} disabled className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-200 sm:text-sm text-gray-500"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" value={formData.email} disabled className="mt-1 block w-full px-3 py-2 border border-gray-200 rounded-md shadow-sm bg-gray-200 sm:text-sm text-gray-500"/>
                    </div>
                    <div>
                        <label htmlFor="major" className="block text-sm font-medium text-gray-700">Jurusan</label>
                        <input type="text" id="major" name="major" value={formData.major} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm text-gray-800"/>
                    </div>
                    <div>
                        <label htmlFor="classYear" className="block text-sm font-medium text-gray-700">Angkatan</label>
                        <input type="text" id="classYear" name="classYear" value={formData.classYear} onChange={handleProfileChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm text-gray-800"/>
                    </div>
                    <div className="flex justify-end items-center">
                        {profileSaved && <span className="text-green-600 text-sm mr-4">Profil berhasil disimpan!</span>}
                        <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition">Simpan Profil</button>
                    </div>
                </form>
            </div>

            {/* Security Settings */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Keamanan
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                         <label htmlFor="old" className="block text-sm font-medium text-gray-700">Password Lama</label>
                         <input type="password" id="old" name="old" value={passwords.old} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm text-gray-800" required/>
                    </div>
                     <div>
                         <label htmlFor="new" className="block text-sm font-medium text-gray-700">Password Baru</label>
                         <input type="password" id="new" name="new" value={passwords.new} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm text-gray-800" required/>
                    </div>
                     <div>
                         <label htmlFor="confirm" className="block text-sm font-medium text-gray-700">Konfirmasi Password Baru</label>
                         <input type="password" id="confirm" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-unsri-yellow focus:border-unsri-yellow sm:text-sm text-gray-800" required/>
                    </div>
                    <div className="flex justify-end items-center pt-2">
                        {passwordMessage.text && <span className={`${passwordMessage.type === 'error' ? 'text-red-600' : 'text-green-600'} text-sm mr-4`}>{passwordMessage.text}</span>}
                        <button type="submit" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md transition">Ubah Password</button>
                    </div>
                </form>
            </div>
            
            {/* Data Reset */}
            <div className="bg-white p-8 rounded-lg shadow-md">
                 <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m-2-11V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Reset Data
                </h2>
                <p className="text-gray-500 mb-4">Tindakan ini akan menghapus semua data semester dan mata kuliah Anda secara permanen. Profil Anda akan tetap tersimpan. Tindakan ini tidak dapat diurungkan.</p>
                <button onClick={handleReset} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition">Reset Semua Data Nilai</button>
            </div>
        </div>
    );
};

export default Settings;