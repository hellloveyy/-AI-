
import React, { useState } from 'react';
import { LayoutDashboard, Users, CreditCard, Database, Bell, LogOut, ChevronDown, LayoutGrid, Check, Box, TrendingUp, ClipboardCheck, Building2, UserCircle, Briefcase, X, QrCode, Phone } from 'lucide-react';
import { AppMarket, AppDashboard } from './components/AppMarket';
import { AccountManagement } from './components/AccountManagement';
import { FinancialBilling } from './components/FinancialBilling';
import { DataCenter } from './components/DataCenter';
import { LandingPage } from './components/LandingPage';
import { Workbench } from './components/Workbench';
import { ServiceProviderDashboard } from './components/ServiceProviderDashboard';
import { PlatformManagement } from './components/PlatformManagement';
import { InstitutionProfile } from './components/InstitutionProfile';
import { MOCK_USERS, MOCK_ROLES } from './constants';
import { AIApp, RoleType, User } from './types';

type View = 'WORKBENCH' | 'MARKET' | 'ACCOUNT' | 'FINANCE' | 'DATA' | 'APP_RUNNING' | 'PROVIDER_REVENUE' | 'PROVIDER_APPS' | 'PROVIDER_PROFILE' | 'PLATFORM_APP_REVIEW' | 'PLATFORM_INSTITUTIONS' | 'PLATFORM_PROVIDER_REVIEW' | 'INSTITUTION_PROFILE';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('WORKBENCH');
  const [runningApp, setRunningApp] = useState<AIApp | null>(null);
  const [showSupportModal, setShowSupportModal] = useState(false);
  
  // Manage All Users State (initialized with mocks, but mutable for registration)
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  
  // State for current user (toggle between Admin, Staff, Individual, and Provider)
  const [currentUser, setCurrentUser] = useState(MOCK_USERS[0]); 

  // Determine current role type based on roleId
  const currentRole = MOCK_ROLES.find(r => r.id === currentUser.roleId);
  const isIndividual = currentRole?.type === RoleType.INDIVIDUAL;
  const isAdmin = currentRole?.type === RoleType.ADMIN;
  const isProvider = currentRole?.type === RoleType.SERVICE_PROVIDER;
  const isPlatformAdmin = currentRole?.type === RoleType.PLATFORM_ADMIN;
  
  // Check if role is admin or individual to determine visibility of account/finance
  const canManageAccount = isAdmin || isIndividual || isPlatformAdmin;

  const handleLaunchApp = (app: AIApp) => {
      setRunningApp(app);
      setCurrentView('APP_RUNNING');
  };

  const handleBackToWorkbench = () => {
      setRunningApp(null);
      setCurrentView('WORKBENCH');
  };

  const handleSwitchUser = (roleId: string) => {
      const user = allUsers.find(u => u.roleId === roleId); // Use allUsers instead of MOCK_USERS
      if (user) {
          setCurrentUser(user);
          setRunningApp(null);
          // Default view logic
          const role = MOCK_ROLES.find(r => r.id === user.roleId);
          if (role?.type === RoleType.SERVICE_PROVIDER) {
              setCurrentView('PROVIDER_REVENUE');
          } else if (role?.type === RoleType.PLATFORM_ADMIN) {
              setCurrentView('PLATFORM_APP_REVIEW');
          } else {
              setCurrentView('WORKBENCH');
          }
      }
  };

  const handleRegister = (newUser: User) => {
      // Uniqueness Check: Phone + Role Type
      const newRole = MOCK_ROLES.find(r => r.id === newUser.roleId);
      if (!newRole) throw new Error("无效的角色类型");

      const exists = allUsers.find(u => {
          const uRole = MOCK_ROLES.find(r => r.id === u.roleId);
          return u.phone === newUser.phone && uRole?.type === newRole.type;
      });

      if (exists) {
          throw new Error("该手机号已注册此类账户，请直接登录");
      }

      setAllUsers([...allUsers, newUser]);
      setCurrentUser(newUser);
      
      // Route based on role
      if (newRole.type === RoleType.SERVICE_PROVIDER) {
          setCurrentView('PROVIDER_REVENUE');
      } else {
          setCurrentView('WORKBENCH');
      }
      setIsLoggedIn(true);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'WORKBENCH': return <Workbench onLaunchApp={handleLaunchApp} user={currentUser} />;
      case 'APP_RUNNING': return runningApp ? <AppDashboard app={runningApp} onBack={handleBackToWorkbench} /> : <Workbench onLaunchApp={handleLaunchApp} user={currentUser} />;
      case 'MARKET': return <AppMarket user={currentUser} />;
      case 'ACCOUNT': return <AccountManagement currentUser={currentUser} />;
      case 'FINANCE': return <FinancialBilling />;
      case 'DATA': return <DataCenter />;
      case 'INSTITUTION_PROFILE': return <InstitutionProfile user={currentUser} />;
      case 'PROVIDER_REVENUE': return <ServiceProviderDashboard user={currentUser} view="REVENUE" />;
      case 'PROVIDER_APPS': return <ServiceProviderDashboard user={currentUser} view="APPS" />;
      case 'PROVIDER_PROFILE': return <ServiceProviderDashboard user={currentUser} view="PROFILE" />;
      case 'PLATFORM_APP_REVIEW': return <PlatformManagement view="APP_REVIEW" />;
      case 'PLATFORM_INSTITUTIONS': return <PlatformManagement view="INSTITUTION" />;
      case 'PLATFORM_PROVIDER_REVIEW': return <PlatformManagement view="PROVIDER_REVIEW" />;
      default: return <Workbench onLaunchApp={handleLaunchApp} user={currentUser} />;
    }
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={() => setIsLoggedIn(true)} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-meiwos-purple rounded-lg flex items-center justify-center text-white font-bold text-lg">
            M
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
            MeiAI Hub
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
            {!isProvider && !isPlatformAdmin && (
                <NavItem 
                    icon={<LayoutDashboard />} 
                    label="工作台" 
                    active={currentView === 'WORKBENCH' || currentView === 'APP_RUNNING'} 
                    onClick={() => setCurrentView('WORKBENCH')} 
                />
            )}
            
            {/* Common for consumers */}
            {!isProvider && !isPlatformAdmin && (
                <NavItem 
                    icon={<LayoutGrid />} 
                    label="应用市场" 
                    active={currentView === 'MARKET'} 
                    onClick={() => setCurrentView('MARKET')} 
                />
            )}
          
            {/* Account: Visible for Admin, Individual and Platform Admin */}
            {canManageAccount && !isProvider && (
                <NavItem 
                    icon={<Users />} 
                    label="账号管理" 
                    active={currentView === 'ACCOUNT'} 
                    onClick={() => setCurrentView('ACCOUNT')} 
                />
            )}

            {/* Finance: Visible for Admin and Individual only (Not Platform Admin) */}
            {(isAdmin || isIndividual) && (
                <NavItem 
                    icon={<CreditCard />} 
                    label="财务账单" 
                    active={currentView === 'FINANCE'} 
                    onClick={() => setCurrentView('FINANCE')} 
                />
            )}

            {/* Institution Profile: Visible for Admin only */}
            {isAdmin && (
                <NavItem 
                    icon={<Building2 />} 
                    label="入驻信息" 
                    active={currentView === 'INSTITUTION_PROFILE'} 
                    onClick={() => setCurrentView('INSTITUTION_PROFILE')} 
                />
            )}

            {!isProvider && !isPlatformAdmin && (
                <NavItem 
                    icon={<Database />} 
                    label="数据中心" 
                    active={currentView === 'DATA'} 
                    onClick={() => setCurrentView('DATA')} 
                />
            )}

            {/* Service Provider Specific Menu */}
            {isProvider && (
                <>
                    <NavItem 
                        icon={<TrendingUp />} 
                        label="收益概览" 
                        active={currentView === 'PROVIDER_REVENUE'} 
                        onClick={() => setCurrentView('PROVIDER_REVENUE')} 
                    />
                    <NavItem 
                        icon={<Box />} 
                        label="我的应用" 
                        active={currentView === 'PROVIDER_APPS'} 
                        onClick={() => setCurrentView('PROVIDER_APPS')} 
                    />
                    <NavItem 
                        icon={<UserCircle />} 
                        label="入驻信息" 
                        active={currentView === 'PROVIDER_PROFILE'} 
                        onClick={() => setCurrentView('PROVIDER_PROFILE')} 
                    />
                </>
            )}

             {/* Platform Admin Specific Menu */}
             {isPlatformAdmin && (
                <>
                    <NavItem 
                        icon={<ClipboardCheck />} 
                        label="应用审核" 
                        active={currentView === 'PLATFORM_APP_REVIEW'} 
                        onClick={() => setCurrentView('PLATFORM_APP_REVIEW')} 
                    />
                    <NavItem 
                        icon={<Briefcase />} 
                        label="服务商审核" 
                        active={currentView === 'PLATFORM_PROVIDER_REVIEW'} 
                        onClick={() => setCurrentView('PLATFORM_PROVIDER_REVIEW')} 
                    />
                    <NavItem 
                        icon={<Building2 />} 
                        label="机构入驻" 
                        active={currentView === 'PLATFORM_INSTITUTIONS'} 
                        onClick={() => setCurrentView('PLATFORM_INSTITUTIONS')} 
                    />
                </>
            )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">平台支持</h4>
            <p className="text-xs text-slate-400 mb-3">遇到问题？联系美沃斯技术顾问。</p>
            <button 
                onClick={() => setShowSupportModal(true)}
                className="w-full bg-white border border-slate-200 text-slate-600 text-xs py-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              联系客服
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white h-16 border-b border-slate-200 sticky top-0 z-20 px-8 flex items-center justify-between">
            <h1 className="text-lg font-medium text-slate-800 hidden md:block">
              {currentView === 'WORKBENCH' && '工作台'}
              {currentView === 'APP_RUNNING' && '应用执行中'}
              {currentView === 'MARKET' && '医美AI应用市场'}
              {currentView === 'ACCOUNT' && '账号与权限管理'}
              {currentView === 'FINANCE' && '财务与结算中心'}
              {currentView === 'DATA' && '核心数据资产'}
              {currentView === 'INSTITUTION_PROFILE' && '机构入驻信息'}
              {currentView === 'PROVIDER_REVENUE' && '服务商收益中心'}
              {currentView === 'PROVIDER_APPS' && '我的应用管理'}
              {currentView === 'PROVIDER_PROFILE' && '入驻信息管理'}
              {currentView === 'PLATFORM_APP_REVIEW' && '平台应用审核'}
              {currentView === 'PLATFORM_PROVIDER_REVIEW' && '服务商资质审核'}
              {currentView === 'PLATFORM_INSTITUTIONS' && '入驻机构管理'}
            </h1>
            
            <div className="flex items-center gap-6 ml-auto">
               <button className="relative text-slate-400 hover:text-slate-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>

               <div className="h-8 w-px bg-slate-200"></div>

               {/* User Profile Dropdown - Improved Hover Area */}
               <div className="relative group h-16 flex items-center">
                   <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors">
                      <img src={currentUser.avatar} alt="User" className="w-8 h-8 rounded-full border border-slate-200" />
                      <div className="hidden md:block text-sm">
                          <div className="font-medium text-slate-700">{currentUser.name}</div>
                          <div className="text-xs text-slate-400">
                              {currentRole?.name}
                          </div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                   </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 pt-2 hidden group-hover:block w-64 z-50">
                      <div className="bg-white rounded-xl shadow-lg border border-slate-100 py-2">
                        {/* Only show role switcher if user is logged in via mock demo flow, in a real app this wouldn't exist or would be 'Switch Organization' */}
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                            <p className="text-[10px] text-slate-400 uppercase font-bold">切换演示角色</p>
                        </div>
                        
                        <div className="px-2 pb-2">
                            {MOCK_ROLES.map(role => (
                                <button
                                    key={role.id}
                                    onClick={() => handleSwitchUser(role.id)}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                                        currentUser.roleId === role.id 
                                            ? 'bg-primary-50 text-primary-700' 
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className={`w-1.5 h-1.5 rounded-full ${
                                            role.type === RoleType.ADMIN ? 'bg-purple-500' :
                                            role.type === RoleType.INDIVIDUAL ? 'bg-orange-500' :
                                            role.type === RoleType.SERVICE_PROVIDER ? 'bg-emerald-500' :
                                            role.type === RoleType.PLATFORM_ADMIN ? 'bg-slate-800' :
                                            'bg-blue-500'
                                        }`}></span>
                                        {role.name}
                                    </span>
                                    {currentUser.roleId === role.id && <Check className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>

                        <div className="border-t border-slate-50 pt-1">
                            <button 
                                onClick={() => setIsLoggedIn(false)}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                退出登录
                            </button>
                        </div>
                      </div>
                  </div>
               </div>
            </div>
        </header>

        {/* Scrollable Area */}
        <div className="p-8 max-w-7xl mx-auto min-h-[calc(100vh-64px)]">
          {renderContent()}
        </div>
      </main>

      {/* Support Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-fade-in-up">
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">联系平台客服</h3>
                    <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-8 flex flex-col items-center text-center">
                    <div className="w-48 h-48 bg-white border-2 border-slate-100 rounded-xl p-2 mb-4 shadow-sm flex items-center justify-center">
                        <QrCode className="w-40 h-40 text-slate-800" strokeWidth={1} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2">扫码添加企业微信</h4>
                    <p className="text-sm text-slate-500">
                        美沃斯技术顾问 7x24小时为您服务<br/>
                        解决账号、支付及技术对接问题
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-primary-600 bg-primary-50 px-4 py-2 rounded-full text-xs font-medium">
                        <Phone className="w-3 h-3" /> 400-888-6666
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
        active 
          ? 'bg-primary-50 text-primary-700 shadow-sm' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <span className={active ? 'text-primary-600' : 'text-slate-400'}>
        {React.cloneElement(icon as React.ReactElement<any>, { size: 20 })}
      </span>
      {label}
    </button>
  );
};

export default App;
