
import React, { useState, useEffect } from 'react';
import { MOCK_APPS, MOCK_SERVICE_PROVIDERS } from '../constants';
import { User, AIApp, AppType, PricingPlan, ServiceProvider } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Plus, TrendingUp, DollarSign, Users, Eye, Edit3, Trash2, X, Check, CreditCard, UserCircle, Save, Briefcase, Phone, Mail, Image as ImageIcon, FileText, Upload, Bold, Italic, List, Link as LinkIcon, Package, Building2, EyeOff } from 'lucide-react';

interface ServiceProviderDashboardProps {
  user: User;
  view: 'REVENUE' | 'APPS' | 'PROFILE';
}

const CATEGORIES = ['获客引流', '咨询转化', '运营管理', '治疗执行', '术后服务', '复购增购'];

export const ServiceProviderDashboard: React.FC<ServiceProviderDashboardProps> = ({ user, view }) => {
  const [myApps, setMyApps] = useState<AIApp[]>(
      MOCK_APPS.filter(app => app.provider === user.name).map(app => ({
          ...app,
          auditStatus: app.auditStatus || 'APPROVED',
          listingStatus: app.listingStatus || 'LISTED'
      }))
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingApp, setEditingApp] = useState<AIApp | null>(null);
  const [profile, setProfile] = useState<ServiceProvider | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [trendPeriod, setTrendPeriod] = useState<'7DAYS' | '6MONTHS'>('7DAYS');

  // Initialize profile based on user name (mocking a database fetch)
  useEffect(() => {
    const foundProfile = MOCK_SERVICE_PROVIDERS.find(p => p.name === user.name);
    if (foundProfile) {
        setProfile(foundProfile);
        setIsEditingProfile(false);
    } else {
        // New profile template if not found
        setProfile({
            id: `new-${Date.now()}`,
            name: user.name,
            contactPerson: '',
            phone: '',
            email: '',
            description: '',
            status: 'PENDING',
            joinDate: new Date().toISOString().split('T')[0]
        });
        setIsEditingProfile(true);
    }
  }, [user.name]);

  const [confirmDialog, setConfirmDialog] = useState<{
      isOpen: boolean;
      title: string;
      message: string;
      onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  const [alertDialog, setAlertDialog] = useState<{
      isOpen: boolean;
      title: string;
      message: string;
  }>({ isOpen: false, title: '', message: '' });

  // Mock Dashboard Data
  const revenueData7Days = [
    { name: 'Mon', value: 1200 },
    { name: 'Tue', value: 980 },
    { name: 'Wed', value: 1500 },
    { name: 'Thu', value: 2100 },
    { name: 'Fri', value: 1800 },
    { name: 'Sat', value: 800 },
    { name: 'Sun', value: 600 },
  ];

  const revenueData6Months = [
    { name: '9月', value: 12000 },
    { name: '10月', value: 15000 },
    { name: '11月', value: 18000 },
    { name: '12月', value: 22000 },
    { name: '1月', value: 25000 },
    { name: '2月', value: 28000 },
  ];

  const currentRevenueData = trendPeriod === '7DAYS' ? revenueData7Days : revenueData6Months;

  // Mock Revenue Breakdown by App
  const appRevenueStats = myApps.map((app, index) => ({
      id: app.id,
      name: app.name,
      totalRevenue: 12000 + (index * 5400) + Math.floor(Math.random() * 2000),
      monthlyRevenue: 3000 + (index * 1200) + Math.floor(Math.random() * 500),
      subscribers: 40 + (index * 15),
      trend: index % 2 === 0 ? `+${8 + index}%` : `-${2 + index}%`
  }));

  const handleCreateApp = (newApp: AIApp) => {
      if (editingApp) {
          // Update existing app
          setMyApps(myApps.map(app => app.id === editingApp.id ? {
              ...newApp,
              id: editingApp.id, // Ensure ID doesn't change
              auditStatus: 'PENDING',
              listingStatus: editingApp.listingStatus // Preserve listing status
          } : app));
      } else {
          // Create new app
          setMyApps([...myApps, {
              ...newApp,
              auditStatus: 'PENDING',
              listingStatus: 'LISTED'
          }]);
      }
      setShowCreateModal(false);
      setEditingApp(null);
  };

  const handleDeleteApp = (appId: string) => {
      if (window.confirm('确定要删除这个应用吗？')) {
          setMyApps(myApps.filter(app => app.id !== appId));
      }
  };

  const handleToggleListing = (app: AIApp) => {
      const isListed = app.listingStatus === 'LISTED';
      
      if (isListed) {
          setConfirmDialog({
              isOpen: true,
              title: '确认下架',
              message: '下架后不影响有试用和正式订阅的机构，但是不能被平台服务市场收录。确定要下架吗？',
              onConfirm: () => {
                  setMyApps(myApps.map(a => a.id === app.id ? { ...a, listingStatus: 'UNLISTED' } : a));
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
              }
          });
      } else {
          setConfirmDialog({
              isOpen: true,
              title: '确认上架',
              message: '确定要重新上架该应用吗？',
              onConfirm: () => {
                  setMyApps(myApps.map(a => a.id === app.id ? { ...a, listingStatus: 'LISTED' } : a));
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
              }
          });
      }
  };

  const handleEditApp = (app: AIApp) => {
      const doEdit = () => {
          setEditingApp(app);
          setShowCreateModal(true);
      };

      if (app.auditStatus === 'APPROVED') {
          setConfirmDialog({
              isOpen: true,
              title: '编辑已审核应用',
              message: '编辑已审核通过的应用将重新进入待审核状态，期间不影响已订阅机构的使用。是否继续？',
              onConfirm: () => {
                  doEdit();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
              }
          });
      } else {
          doEdit();
      }
  };

  const handleSaveProfile = () => {
      if (profile) {
          // In a real app, save to backend
          setIsEditingProfile(false);
          // Update global mock for consistency in this session
          const idx = MOCK_SERVICE_PROVIDERS.findIndex(p => p.id === profile.id);
          if (idx >= 0) {
              MOCK_SERVICE_PROVIDERS[idx] = profile;
          } else {
              MOCK_SERVICE_PROVIDERS.push(profile);
          }
      }
  };

  const handleProfileChange = (field: keyof ServiceProvider, value: string) => {
      if (profile) {
          setProfile({ ...profile, [field]: value });
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {view === 'REVENUE' ? '收益数据概览' : view === 'APPS' ? '我的应用管理' : '服务商入驻信息'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {view === 'REVENUE' ? '查看应用产生的收益与订阅数据' : view === 'APPS' ? '管理应用的发布、上架与配置' : '完善企业信息，通过审核后即可发布应用'}
          </p>
        </div>
        
        {/* Actions based on view */}
        {view === 'APPS' && (
            <button 
                onClick={() => {
                    setEditingApp(null);
                    setShowCreateModal(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 shadow-sm flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                创建新应用
            </button>
        )}
      </div>

      {view === 'REVENUE' && (
         <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                 {/* Card 1: Total Revenue */}
                 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                     <div className="flex justify-between items-start mb-2">
                         <div>
                             <div className="text-sm text-slate-500 mb-1">累计总收益</div>
                             <div className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">¥ 145,200.00</div>
                         </div>
                         <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                             <CreditCard className="w-6 h-6" />
                         </div>
                     </div>
                     <div className="h-5"></div> {/* Spacer for alignment */}
                 </div>

                 {/* Card 2: Monthly Revenue */}
                 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                     <div className="flex justify-between items-start mb-2">
                         <div>
                             <div className="text-sm text-slate-500 mb-1">本月总收益</div>
                             <div className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">¥ 12,450.00</div>
                         </div>
                         <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                             <DollarSign className="w-6 h-6" />
                         </div>
                     </div>
                     <div className="text-xs text-emerald-600 flex items-center gap-1 h-5">
                         <TrendingUp className="w-3 h-3" />
                         环比增长 +8.5%
                     </div>
                 </div>
                 
                 {/* Card 3: Subscribers */}
                 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                     <div className="flex justify-between items-start mb-2">
                         <div>
                             <div className="text-sm text-slate-500 mb-1">累计订阅机构</div>
                             <div className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">42 <span className="text-sm font-normal text-slate-400">家</span></div>
                         </div>
                         <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                             <Users className="w-6 h-6" />
                         </div>
                     </div>
                     <div className="h-5"></div> {/* Spacer for alignment */}
                 </div>

                 {/* Card 4: Trial Institutions */}
                 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
                     <div className="flex justify-between items-start mb-2">
                         <div>
                             <div className="text-sm text-slate-500 mb-1">累计试用机构</div>
                             <div className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">128 <span className="text-sm font-normal text-slate-400">家</span></div>
                         </div>
                         <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                             <Box className="w-6 h-6" />
                         </div>
                     </div>
                     <div className="h-5"></div> {/* Spacer for alignment */}
                 </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Trend Chart */}
                 <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800">收益趋势</h3>
                        <div className="flex bg-slate-100 p-1 rounded-lg">
                            <button 
                                onClick={() => setTrendPeriod('7DAYS')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${trendPeriod === '7DAYS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                最近7天
                            </button>
                            <button 
                                onClick={() => setTrendPeriod('6MONTHS')}
                                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${trendPeriod === '6MONTHS' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                最近6个月
                            </button>
                        </div>
                    </div>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentRevenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fill="url(#colorRevenue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 {/* Revenue by App Breakdown */}
                 <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">应用维度累计收益汇总</h3>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">应用名称</th>
                                    <th className="px-6 py-3 text-right">本月收益</th>
                                    <th className="px-6 py-3 text-right">累计收益</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {appRevenueStats.map(stat => (
                                    <tr key={stat.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-800 max-w-[120px] truncate" title={stat.name}>{stat.name}</td>
                                        <td className="px-6 py-4 text-right font-bold text-slate-700">¥{stat.monthlyRevenue.toLocaleString()}</td>
                                        <td className="px-6 py-4 text-right font-bold text-primary-600">¥{stat.totalRevenue.toLocaleString()}</td>
                                    </tr>
                                ))}
                                {appRevenueStats.length === 0 && (
                                    <tr><td colSpan={3} className="text-center py-8 text-slate-400">暂无应用数据</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                 </div>
             </div>
         </div>
      )}

      {view === 'APPS' && (
          <div className="animate-fade-in space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myApps.length > 0 ? myApps.map(app => (
                      <div key={app.id} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex gap-4 hover:border-primary-200 transition-all group">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-500">
                               {/* Use a generic icon or map based on string */}
                               <Box className="w-8 h-8" />
                          </div>
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <h3 className="font-bold text-slate-800 text-lg">{app.name}</h3>
                                  <div className="flex gap-2">
                                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                          app.auditStatus === 'APPROVED' ? 'bg-green-50 text-green-600 border-green-100' : 
                                          app.auditStatus === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                                          'bg-amber-50 text-amber-600 border-amber-100'
                                      }`}>
                                          {app.auditStatus === 'APPROVED' ? '审核通过' : app.auditStatus === 'REJECTED' ? '审核拒绝' : '待审核'}
                                      </span>
                                      <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                          app.listingStatus === 'LISTED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                          'bg-slate-50 text-slate-500 border-slate-100'
                                      }`}>
                                          {app.listingStatus === 'LISTED' ? '已上架' : '已下架'}
                                      </span>
                                  </div>
                              </div>
                              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{app.description}</p>
                              <div className="flex items-center gap-4 mt-4 text-xs text-slate-400">
                                  <span>分类: {app.category}</span>
                                  <span>价格方案: {app.pricing.length}个</span>
                              </div>
                          </div>
                          <div className="flex flex-col gap-2 justify-center border-l border-slate-50 pl-4">
                              <button 
                                  onClick={() => handleEditApp(app)}
                                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-slate-50 rounded-lg"
                                  title="编辑应用"
                              >
                                  <Edit3 className="w-4 h-4" />
                              </button>
                              <button 
                                  onClick={() => handleToggleListing(app)}
                                  className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg"
                                  title={app.listingStatus === 'LISTED' ? '下架应用' : '上架应用'}
                              >
                                  {app.listingStatus === 'LISTED' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                          </div>
                      </div>
                  )) : (
                      <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-400">
                          <Box className="w-12 h-12 mx-auto mb-4 opacity-20" />
                          <p>您还没有创建任何应用</p>
                      </div>
                  )}
              </div>
          </div>
      )}

      {view === 'PROFILE' && profile && (
          <div className="animate-fade-in max-w-4xl mx-auto">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                              <Building2 className="w-5 h-5" />
                          </div>
                          <h3 className="text-lg font-bold text-slate-800">企业基本信息</h3>
                      </div>
                      {!isEditingProfile ? (
                          <button 
                              onClick={() => setIsEditingProfile(true)}
                              className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                          >
                              <Edit3 className="w-4 h-4" /> 编辑信息
                          </button>
                      ) : (
                          <div className="flex items-center gap-2">
                              <button 
                                  onClick={() => setIsEditingProfile(false)}
                                  className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                              >
                                  取消
                              </button>
                              <button 
                                  onClick={handleSaveProfile}
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
                              <label className="block text-sm font-medium text-slate-700 mb-1">企业名称</label>
                              {isEditingProfile ? (
                                  <input 
                                      type="text" 
                                      value={profile.name} 
                                      onChange={e => handleProfileChange('name', e.target.value)}
                                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                      placeholder="请输入企业全称"
                                  />
                              ) : (
                                  <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800 font-medium">{profile.name || '未设置'}</div>
                              )}
                          </div>
                          
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">联系人姓名</label>
                              {isEditingProfile ? (
                                  <input 
                                      type="text" 
                                      value={profile.contactPerson} 
                                      onChange={e => handleProfileChange('contactPerson', e.target.value)}
                                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                      placeholder="请输入联系人姓名"
                                  />
                              ) : (
                                  <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800">{profile.contactPerson || '未设置'}</div>
                              )}
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">联系电话</label>
                              {isEditingProfile ? (
                                  <input 
                                      type="tel" 
                                      value={profile.phone} 
                                      onChange={e => handleProfileChange('phone', e.target.value)}
                                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                      placeholder="请输入联系电话"
                                  />
                              ) : (
                                  <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800">{profile.phone || '未设置'}</div>
                              )}
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">联系邮箱</label>
                              {isEditingProfile ? (
                                  <input 
                                      type="email" 
                                      value={profile.email} 
                                      onChange={e => handleProfileChange('email', e.target.value)}
                                      className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                      placeholder="请输入联系邮箱"
                                  />
                              ) : (
                                  <div className="p-2.5 bg-slate-50 rounded-lg border border-transparent text-slate-800">{profile.email || '未设置'}</div>
                              )}
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">企业简介</label>
                          {isEditingProfile ? (
                              <textarea 
                                  value={profile.description} 
                                  onChange={e => handleProfileChange('description', e.target.value)}
                                  rows={4}
                                  className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                                  placeholder="请简要介绍您的企业、核心业务及优势..."
                              />
                          ) : (
                              <div className="p-3 bg-slate-50 rounded-lg border border-transparent text-slate-800 min-h-[100px] whitespace-pre-wrap">
                                  {profile.description || '暂无简介'}
                              </div>
                          )}
                      </div>

                      <div className="border-t border-slate-100 pt-6">
                          <label className="block text-sm font-medium text-slate-700 mb-3">资质证明</label>
                          <div className="flex items-center gap-4">
                              <div className="w-32 h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-100 hover:border-primary-300 transition-colors cursor-pointer group">
                                  <ImageIcon className="w-8 h-8 mb-2 group-hover:text-primary-500 transition-colors" />
                                  <span className="text-xs group-hover:text-primary-600 font-medium">营业执照</span>
                              </div>
                              <div className="text-sm text-slate-500">
                                  <p className="mb-1">请上传最新的营业执照扫描件或照片。</p>
                                  <p>支持 JPG, PNG 格式，大小不超过 5MB。</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {showCreateModal && (
          <CreateAppModal 
            onClose={() => {
                setShowCreateModal(false);
                setEditingApp(null);
            }} 
            onSubmit={handleCreateApp}
            providerName={user.name}
            initialData={editingApp}
          />
      )}

      {/* Custom Confirm Dialog */}
      {confirmDialog.isOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                  <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
                      <p className="text-slate-600 text-sm">{confirmDialog.message}</p>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                      <button 
                          onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-lg transition-colors"
                      >
                          取消
                      </button>
                      <button 
                          onClick={confirmDialog.onConfirm}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                      >
                          确定
                      </button>
                  </div>
              </div>
          </div>
      )}

      {/* Custom Alert Dialog */}
      {alertDialog.isOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
                  <div className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-2">{alertDialog.title}</h3>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">{alertDialog.message}</p>
                  </div>
                  <div className="bg-slate-50 px-6 py-4 flex justify-end border-t border-slate-100">
                      <button 
                          onClick={() => setAlertDialog({ ...alertDialog, isOpen: false })}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors shadow-sm"
                      >
                          知道了
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// --- Create App Modal ---

interface CreateAppModalProps {
    onClose: () => void;
    onSubmit: (app: AIApp) => void;
    providerName: string;
    initialData?: AIApp | null;
}

const CreateAppModal: React.FC<CreateAppModalProps> = ({ onClose, onSubmit, providerName, initialData }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<Partial<AIApp>>(initialData ? { ...initialData } : {
        name: '',
        description: '', // Short description
        fullDescription: '', // Functional Intro
        category: CATEGORIES[0],
        type: AppType.THIRD_PARTY,
        icon: 'box',
        status: 'active', // Default for demo
        integrationType: 'API_EMBEDDED', // Default, hidden from user
        rating: 5.0,
        provider: providerName,
        documentation: '',
        attachments: [],
        features: [],
        pricing: [],
        reviews: [],
        trialUsed: false
    });

    // Form helpers
    const [featureInput, setFeatureInput] = useState({ title: '', description: '' });
    const [pricingInput, setPricingInput] = useState<Partial<PricingPlan> & { 
        billingCycle: 'MONTHLY' | 'YEARLY',
        tempPrice: number 
    }>({ 
        name: '', 
        type: 'SUBSCRIPTION',
        model: 'SEAT',
        priceMonth: 0,
        priceYear: 0,
        pricePerUnit: 0,
        packQuota: 0,
        packPrice: 0,
        unitName: '次',
        features: [],
        includedSeats: 1,
        billingCycle: 'MONTHLY',
        tempPrice: 0
    });
    const [attachmentInput, setAttachmentInput] = useState('');

    const handleBasicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const addFeature = () => {
        if (featureInput.title && featureInput.description) {
            setFormData({
                ...formData,
                features: [...(formData.features || []), featureInput]
            });
            setFeatureInput({ title: '', description: '' });
        }
    };

    const addAttachment = () => {
        if (attachmentInput) {
             setFormData({
                ...formData,
                attachments: [...(formData.attachments || []), attachmentInput]
            });
            setAttachmentInput('');
        }
    };

    const addPricing = () => {
        if (pricingInput.name) {
            const newPlan: PricingPlan = {
                id: `p-${Date.now()}`,
                name: pricingInput.name!,
                type: pricingInput.type as any,
                model: pricingInput.model as any,
                // Assign price based on cycle if model is SEAT
                priceMonth: pricingInput.model === 'SEAT' && pricingInput.billingCycle === 'MONTHLY' ? Number(pricingInput.tempPrice) : 
                            pricingInput.model === 'SUBSCRIPTION' ? Number(pricingInput.priceMonth) : undefined,
                priceYear: pricingInput.model === 'SEAT' && pricingInput.billingCycle === 'YEARLY' ? Number(pricingInput.tempPrice) : 
                           pricingInput.model === 'SUBSCRIPTION' ? Number(pricingInput.priceYear) : undefined,
                
                pricePerUnit: Number(pricingInput.pricePerUnit),
                packQuota: Number(pricingInput.packQuota),
                packPrice: Number(pricingInput.packPrice),
                unitName: pricingInput.unitName,
                includedSeats: Number(pricingInput.includedSeats),
                features: ['全功能可用', '技术支持'], 
            };
            setFormData({
                ...formData,
                pricing: [...(formData.pricing || []), newPlan]
            });
            // Reset form
            setPricingInput({ 
                name: '', 
                type: 'SUBSCRIPTION', 
                model: 'SEAT', 
                priceMonth: 0, 
                priceYear: 0, 
                pricePerUnit: 0, 
                packQuota: 0, 
                packPrice: 0, 
                unitName: '次',
                features: [],
                includedSeats: 1,
                billingCycle: 'MONTHLY',
                tempPrice: 0
            });
        }
    };

    const handleSubmit = () => {
        const newApp = {
            ...formData,
            id: `app-new-${Date.now()}`
        } as AIApp;
        onSubmit(newApp);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-slate-800">{initialData ? '编辑应用' : '创建新应用'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {/* Steps Indicator */}
                    <div className="flex items-center gap-4 mb-8 text-sm">
                        <span className={`px-3 py-1 rounded-full ${step === 1 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>1. 基础信息</span>
                        <div className="h-px bg-slate-200 w-10"></div>
                        <span className={`px-3 py-1 rounded-full ${step === 2 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>2. 功能详情</span>
                        <div className="h-px bg-slate-200 w-10"></div>
                        <span className={`px-3 py-1 rounded-full ${step === 3 ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>3. 价格方案</span>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">应用名称</label>
                                    <input name="name" value={formData.name} onChange={handleBasicChange} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="例如：智能面诊Pro" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">应用分类</label>
                                    <select name="category" value={formData.category} onChange={handleBasicChange} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white">
                                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">简短描述 (列表页展示)</label>
                                <textarea name="description" value={formData.description} onChange={handleBasicChange} rows={2} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="一句话介绍应用的核心价值..." />
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">详细功能介绍 (详情页展示)</label>
                                <textarea name="fullDescription" value={formData.fullDescription} onChange={handleBasicChange} rows={4} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none" placeholder="详细描述应用的功能、优势及解决的痛点..." />
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-3">核心亮点 (Features)</label>
                                <div className="bg-slate-50 p-4 rounded-xl mb-3">
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <input 
                                            placeholder="亮点标题" 
                                            value={featureInput.title}
                                            onChange={e => setFeatureInput({...featureInput, title: e.target.value})}
                                            className="p-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <input 
                                            placeholder="亮点描述" 
                                            value={featureInput.description}
                                            onChange={e => setFeatureInput({...featureInput, description: e.target.value})}
                                            className="p-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                    </div>
                                    <button onClick={addFeature} className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1">
                                        <Plus className="w-3 h-3" /> 添加亮点
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.features?.map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 border border-slate-100 rounded-lg text-sm bg-white">
                                            <Check className="w-4 h-4 text-green-500" />
                                            <div className="flex-1">
                                                <span className="font-bold">{f.title}: </span>
                                                <span className="text-slate-500">{f.description}</span>
                                            </div>
                                            <button onClick={() => {
                                                const newFeatures = [...(formData.features || [])];
                                                newFeatures.splice(i, 1);
                                                setFormData({...formData, features: newFeatures});
                                            }} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-6">
                                <label className="block text-sm font-medium text-slate-700 mb-3">应用说明文档 (Rich Text & Attachments)</label>
                                <div className="border border-slate-200 rounded-lg overflow-hidden mb-4">
                                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-2">
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><Bold className="w-4 h-4" /></button>
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><Italic className="w-4 h-4" /></button>
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><List className="w-4 h-4" /></button>
                                        <button className="p-1 hover:bg-slate-200 rounded text-slate-600"><LinkIcon className="w-4 h-4" /></button>
                                    </div>
                                    <textarea 
                                        name="documentation"
                                        value={formData.documentation}
                                        onChange={handleBasicChange}
                                        rows={6}
                                        className="w-full p-4 text-sm focus:outline-none"
                                        placeholder="在此输入详细的产品使用手册、接入文档或HTML内容..."
                                    />
                                </div>

                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <div className="flex gap-2 mb-3">
                                        <input 
                                            placeholder="附件文件名 (如: UserManual.pdf)..." 
                                            value={attachmentInput}
                                            onChange={e => setAttachmentInput(e.target.value)}
                                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                                        />
                                        <button onClick={addAttachment} className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm text-slate-600 flex items-center gap-2">
                                            <Upload className="w-4 h-4" /> 上传附件
                                        </button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.attachments?.map((file, i) => (
                                            <div key={i} className="flex items-center gap-3 p-2 border border-slate-200 rounded-lg text-sm bg-white">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                                <span className="flex-1 truncate">{file}</span>
                                                <button onClick={() => {
                                                    const newAttachments = [...(formData.attachments || [])];
                                                    newAttachments.splice(i, 1);
                                                    setFormData({...formData, attachments: newAttachments});
                                                }} className="text-slate-300 hover:text-red-500"><X className="w-4 h-4" /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                                <h4 className="font-bold text-blue-800 text-sm mb-3">配置价格方案</h4>
                                <div className="grid grid-cols-2 gap-4 mb-3">
                                    <input 
                                        placeholder="方案名称 (如: 标准版)" 
                                        value={pricingInput.name}
                                        onChange={e => setPricingInput({...pricingInput, name: e.target.value})}
                                        className="p-2 border border-blue-200 rounded-lg text-sm"
                                    />
                                    <select 
                                         value={pricingInput.type}
                                         onChange={e => setPricingInput({...pricingInput, type: e.target.value as any})}
                                         className="p-2 border border-blue-200 rounded-lg text-sm bg-white"
                                    >
                                        <option value="SUBSCRIPTION">正式订阅 (收费)</option>
                                        <option value="TRIAL">试用 (免费)</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold text-blue-800 mb-2 uppercase">计费模式</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 'SEAT', label: '席位订阅', icon: UserCircle },
                                            { id: 'SUBSCRIPTION', label: '账户订阅', icon: CreditCard },
                                            { id: 'USAGE', label: '按量付费', icon: TrendingUp },
                                            { id: 'RESOURCE_PACK', label: '资源包', icon: Package },
                                        ].map(m => (
                                            <button 
                                                key={m.id}
                                                onClick={() => setPricingInput({...pricingInput, model: m.id as any})}
                                                className={`flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all ${
                                                    pricingInput.model === m.id 
                                                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                                    : 'bg-white text-blue-900 border-blue-200 hover:bg-blue-50'
                                                }`}
                                            >
                                                <m.icon className="w-5 h-5 mb-1" />
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {pricingInput.model === 'SEAT' && (
                                    <div className="grid grid-cols-3 gap-4 mb-4 animate-fade-in bg-white p-3 border border-blue-100 rounded-lg">
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">包含席位数量</label>
                                            <input 
                                                type="number"
                                                placeholder="1" 
                                                value={pricingInput.includedSeats}
                                                onChange={e => setPricingInput({...pricingInput, includedSeats: Number(e.target.value)})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">付费类型 (周期)</label>
                                            <select 
                                                value={pricingInput.billingCycle}
                                                onChange={e => setPricingInput({...pricingInput, billingCycle: e.target.value as any})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm bg-white"
                                            >
                                                <option value="MONTHLY">月付 (Monthly)</option>
                                                <option value="YEARLY">年付 (Yearly)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">价格 (¥)</label>
                                            <input 
                                                type="number"
                                                placeholder="0" 
                                                value={pricingInput.tempPrice}
                                                onChange={e => setPricingInput({...pricingInput, tempPrice: Number(e.target.value)})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {pricingInput.model === 'SUBSCRIPTION' && (
                                    <div className="grid grid-cols-2 gap-4 mb-4 animate-fade-in">
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">月付价格 (¥)</label>
                                            <input 
                                                type="number"
                                                placeholder="0" 
                                                value={pricingInput.priceMonth}
                                                onChange={e => setPricingInput({...pricingInput, priceMonth: Number(e.target.value)})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">年付价格 (¥)</label>
                                            <input 
                                                type="number"
                                                placeholder="0" 
                                                value={pricingInput.priceYear}
                                                onChange={e => setPricingInput({...pricingInput, priceYear: Number(e.target.value)})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {pricingInput.model === 'USAGE' && (
                                    <div className="grid grid-cols-2 gap-4 mb-4 animate-fade-in">
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">单次调用费用 (¥)</label>
                                            <input 
                                                type="number"
                                                placeholder="0.00" 
                                                value={pricingInput.pricePerUnit}
                                                onChange={e => setPricingInput({...pricingInput, pricePerUnit: Number(e.target.value)})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">计费单位</label>
                                            <input 
                                                placeholder="如: 次, 分钟" 
                                                value={pricingInput.unitName}
                                                onChange={e => setPricingInput({...pricingInput, unitName: e.target.value})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                )}

                                {pricingInput.model === 'RESOURCE_PACK' && (
                                    <div className="grid grid-cols-2 gap-4 mb-4 animate-fade-in">
                                        <div>
                                            <label className="block text-xs text-blue-700 mb-1">资源包总价 (¥)</label>
                                            <input 
                                                type="number"
                                                placeholder="0" 
                                                value={pricingInput.packPrice}
                                                onChange={e => setPricingInput({...pricingInput, packPrice: Number(e.target.value)})}
                                                className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="block text-xs text-blue-700 mb-1">包含数量</label>
                                                <input 
                                                    type="number"
                                                    placeholder="1000" 
                                                    value={pricingInput.packQuota}
                                                    onChange={e => setPricingInput({...pricingInput, packQuota: Number(e.target.value)})}
                                                    className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                                />
                                            </div>
                                            <div className="w-16">
                                                <label className="block text-xs text-blue-700 mb-1">单位</label>
                                                <input 
                                                    value={pricingInput.unitName}
                                                    onChange={e => setPricingInput({...pricingInput, unitName: e.target.value})}
                                                    className="w-full p-2 border border-blue-200 rounded-lg text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button onClick={addPricing} className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                                    添加方案
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.pricing?.map((plan, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:border-primary-200 bg-white">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-800">{plan.name}</h4>
                                                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                                    plan.type === 'TRIAL' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'
                                                }`}>{plan.type === 'TRIAL' ? '试用' : '正式'}</span>
                                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                                    {plan.model === 'SEAT' ? '席位' : 
                                                     plan.model === 'SUBSCRIPTION' ? '订阅' : 
                                                     plan.model === 'USAGE' ? '按量' : '资源包'}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-500 mt-1">
                                                {plan.model === 'SEAT' ? (
                                                    <span>
                                                        {plan.priceMonth ? `¥${plan.priceMonth}/月` : `¥${plan.priceYear}/年`} 
                                                        <span className="text-xs ml-1 bg-slate-100 px-1 rounded text-slate-500">含{plan.includedSeats || 1}席位</span>
                                                    </span>
                                                ) : plan.model === 'SUBSCRIPTION' ? (
                                                    `¥${plan.priceMonth}/月 ${plan.priceYear ? `或 ¥${plan.priceYear}/年` : ''}`
                                                ) : plan.model === 'USAGE' ? (
                                                    `¥${plan.pricePerUnit} / ${plan.unitName}`
                                                ) : (
                                                    `¥${plan.packPrice} (含 ${plan.packQuota} ${plan.unitName})`
                                                )}
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            const newPricing = [...(formData.pricing || [])];
                                            newPricing.splice(i, 1);
                                            setFormData({...formData, pricing: newPricing});
                                        }} className="text-slate-300 hover:text-red-500">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {formData.pricing?.length === 0 && (
                                    <div className="text-center text-slate-400 text-sm py-8">
                                        暂无价格方案，请上方添加
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 flex justify-between bg-slate-50 rounded-b-xl">
                    {step > 1 ? (
                         <button onClick={() => setStep(step - 1)} className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-lg font-medium">上一步</button>
                    ) : <div></div>}
                    
                    {step < 3 ? (
                        <button onClick={() => setStep(step + 1)} className="px-6 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium">下一步</button>
                    ) : (
                        <button onClick={handleSubmit} className="px-8 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg font-bold shadow-lg shadow-primary-200">
                            {initialData ? '保存修改并提交审核' : '提交审核'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
