import React, { useState, useEffect } from 'react';
import { User, Institution } from '../types';
import { Building2, Phone, UserCircle, MapPin, CheckCircle2, AlertCircle, Clock, Image as ImageIcon } from 'lucide-react';

interface InstitutionProfileProps {
  user: User;
}

export const InstitutionProfile: React.FC<InstitutionProfileProps> = ({ user }) => {
  const [profile, setProfile] = useState<Partial<Institution>>({
    name: '',
    contactPerson: '',
    phone: '',
    city: '',
    status: 'PENDING',
  });
  const [isEditing, setIsEditing] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<'IDLE' | 'SUBMITTING' | 'SUCCESS'>('IDLE');

  // Mock fetching existing data
  useEffect(() => {
    // In a real app, fetch institution data based on user
    // For demo, we'll just leave it empty for new registration
  }, [user]);

  const handleChange = (field: keyof Institution, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!profile.name || !profile.contactPerson || !profile.phone || !profile.city) {
      alert('请填写完整信息');
      return;
    }
    
    setSubmitStatus('SUBMITTING');
    
    // Mock API call
    setTimeout(() => {
      setSubmitStatus('SUCCESS');
      setProfile(prev => ({ ...prev, status: 'PENDING' }));
      setIsEditing(false);
      
      setTimeout(() => {
        setSubmitStatus('IDLE');
      }, 3000);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">机构入驻信息</h2>
        <p className="text-slate-500 mt-2">完善机构信息，提交平台审核后即可使用更多高级功能。</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Status Banner */}
        {!isEditing && profile.status === 'PENDING' && (
          <div className="bg-amber-50 border-b border-amber-100 p-4 flex items-center gap-3 text-amber-700">
            <Clock className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-medium">您的入驻申请正在审核中</p>
              <p className="text-sm text-amber-600/80 mt-0.5">我们将在1-3个工作日内完成审核，请耐心等待。</p>
            </div>
          </div>
        )}
        
        {!isEditing && profile.status === 'ACTIVE' && (
          <div className="bg-green-50 border-b border-green-100 p-4 flex items-center gap-3 text-green-700">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <div>
              <p className="font-medium">审核已通过</p>
              <p className="text-sm text-green-600/80 mt-0.5">您的机构已成功入驻平台。</p>
            </div>
          </div>
        )}

        <div className="p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                机构名称 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                  placeholder="请输入完整的医疗机构名称"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  联系人姓名 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={profile.contactPerson}
                    onChange={e => handleChange('contactPerson', e.target.value)}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    placeholder="请输入负责人或联系人姓名"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  联系电话 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    disabled={!isEditing}
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                    placeholder="请输入手机号码或座机"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                所在城市 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={profile.city}
                  onChange={e => handleChange('city', e.target.value)}
                  disabled={!isEditing}
                  className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-slate-50 disabled:text-slate-500 transition-colors"
                  placeholder="例如：北京市朝阳区"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                资质证明 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                <div className={`w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 transition-colors ${isEditing ? 'hover:bg-slate-100 hover:border-primary-300 cursor-pointer group' : 'opacity-70'}`}>
                  <ImageIcon className={`w-8 h-8 mb-2 transition-colors ${isEditing ? 'group-hover:text-primary-500' : ''}`} />
                  <span className={`text-xs font-medium ${isEditing ? 'group-hover:text-primary-600' : ''}`}>营业执照</span>
                </div>
                <div className="text-sm text-slate-500">
                  <p className="mb-1">请上传最新的营业执照扫描件或照片。</p>
                  <p>支持 JPG, PNG 格式，大小不超过 5MB。</p>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">入驻须知</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-700/80">
                    <li>请确保填写的机构信息真实有效，平台将进行人工审核。</li>
                    <li>审核通过后，您将获得完整的平台功能访问权限。</li>
                    <li>如需修改已提交的信息，请联系平台客服。</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex justify-end gap-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors"
              >
                修改信息
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitStatus === 'SUBMITTING'}
                className="px-8 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm shadow-primary-200 disabled:opacity-70 flex items-center gap-2"
              >
                {submitStatus === 'SUBMITTING' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    提交中...
                  </>
                ) : submitStatus === 'SUCCESS' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    提交成功
                  </>
                ) : (
                  '提交审核'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
