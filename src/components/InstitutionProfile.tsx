import React, { useState, useEffect } from 'react';
import { User, Institution } from '../types';
import { MOCK_INSTITUTIONS } from '../constants';
import { Building2, Edit3, Save, MapPin, Phone, User as UserIcon, Calendar } from 'lucide-react';

interface InstitutionProfileProps {
  user: User;
}

export const InstitutionProfile: React.FC<InstitutionProfileProps> = ({ user }) => {
  const [profile, setProfile] = useState<Institution | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Mock fetching institution profile
    // In a real app, this would fetch the institution associated with the admin user
    const foundProfile = MOCK_INSTITUTIONS[0]; // Just taking the first one for demo
    if (foundProfile) {
        setProfile(foundProfile);
    } else {
        setProfile({
            id: `inst-${Date.now()}`,
            name: '未命名机构',
            contactPerson: user.name,
            phone: user.phone || '',
            city: '',
            status: 'PENDING',
            joinDate: new Date().toISOString().split('T')[0]
        });
    }
  }, [user]);

  const handleSave = () => {
      if (profile) {
          // In a real app, save to backend
          setIsEditing(false);
          // Update global mock for consistency in this session
          const idx = MOCK_INSTITUTIONS.findIndex(p => p.id === profile.id);
          if (idx >= 0) {
              MOCK_INSTITUTIONS[idx] = profile;
          } else {
              MOCK_INSTITUTIONS.push(profile);
          }
      }
  };

  const handleChange = (field: keyof Institution, value: string) => {
      if (profile) {
          setProfile({ ...profile, [field]: value });
      }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">机构入驻信息</h2>
          <p className="text-slate-500 text-sm mt-1">管理您的医疗美容机构基本信息与资质</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                        <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">机构基本信息</h3>
                </div>
                {!isEditing ? (
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                    >
                        <Edit3 className="w-4 h-4" /> 编辑信息
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setIsEditing(false)}
                            className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            取消
                        </button>
                        <button 
                            onClick={handleSave}
                            className="flex items-center gap-2 text-sm text-white bg-primary-600 hover:bg-primary-700 font-medium px-4 py-1.5 rounded-lg transition-colors shadow-sm"
                        >
                            <Save className="w-4 h-4" /> 保存
                        </button>
                    </div>
                )}
            </div>
            
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">机构名称</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={profile.name} 
                                onChange={e => handleChange('name', e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="请输入机构全称"
                            />
                        ) : (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800 font-medium flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-slate-400" />
                                {profile.name || '未设置'}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">所在城市</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={profile.city} 
                                onChange={e => handleChange('city', e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="请输入所在城市"
                            />
                        ) : (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                {profile.city || '未设置'}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">联系人姓名</label>
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={profile.contactPerson} 
                                onChange={e => handleChange('contactPerson', e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="请输入联系人姓名"
                            />
                        ) : (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800 flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-slate-400" />
                                {profile.contactPerson || '未设置'}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                        {isEditing ? (
                            <input 
                                type="tel" 
                                value={profile.phone} 
                                onChange={e => handleChange('phone', e.target.value)}
                                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="请输入联系电话"
                            />
                        ) : (
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {profile.phone || '未设置'}
                            </div>
                        )}
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">入驻状态</label>
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${
                                    profile.status === 'ACTIVE' ? 'bg-green-500' : 
                                    profile.status === 'PENDING' ? 'bg-amber-500' : 'bg-red-500'
                                }`}></span>
                                <span className="text-slate-800">
                                    {profile.status === 'ACTIVE' ? '正常营业' : 
                                     profile.status === 'PENDING' ? '审核中' : '已暂停'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">入驻日期</label>
                            <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                {profile.joinDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
