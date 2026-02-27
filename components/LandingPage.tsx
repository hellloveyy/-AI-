
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Zap, Shield, Box, Globe, Cpu, Database, X, User, Building, Briefcase } from 'lucide-react';
import { User as UserType } from '../types';

interface LandingPageProps {
  onLogin: () => void;
  onRegister?: (user: UserType) => void;
}

type RegType = 'INDIVIDUAL' | 'INSTITUTION' | 'PROVIDER';

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin, onRegister }) => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [regType, setRegType] = useState<RegType>('INDIVIDUAL');
  const [regForm, setRegForm] = useState({
      name: '',
      phone: '',
      code: '',
  });
  const [loginForm, setLoginForm] = useState({
      phone: '',
      code: '',
  });
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleGetCode = () => {
      if (!regForm.phone && showRegisterModal) {
          setError('请先输入手机号码');
          return;
      }
      if (!loginForm.phone && showLoginModal) {
          // For mock login we might not strictly require it, but let's be consistent
          // Actually user said "不需要输入任何信息即可登录", so we can just start countdown
      }
      setCountdown(60);
      const timer = setInterval(() => {
          setCountdown((prev) => {
              if (prev <= 1) {
                  clearInterval(timer);
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onLogin();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      if (!onRegister) return;

      if (!regForm.name || !regForm.phone || !regForm.code) {
          setError('请填写所有必填字段');
          return;
      }

      // Map selection to role ID
      let roleId = '';
      if (regType === 'INDIVIDUAL') roleId = 'role-individual';
      else if (regType === 'INSTITUTION') roleId = 'role-admin'; // Admin of new org
      else if (regType === 'PROVIDER') roleId = 'role-provider';

      const newUser: UserType = {
          id: `u-new-${Date.now()}`,
          name: regForm.name,
          phone: regForm.phone,
          roleId: roleId,
          avatar: `https://ui-avatars.com/api/?name=${regForm.name}&background=random`,
          dataScope: regType === 'INDIVIDUAL' ? 'ASSIGNED' : 'ALL',
          extraAppIds: [],
          extraPermissions: []
      };

      try {
          onRegister(newUser);
      } catch (err: any) {
          setError(err.message);
      }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-primary-100">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-meiwos-purple rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-500/30">
                M
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
                MeiAI Hub
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#" className="hover:text-primary-600 transition-colors">解决方案</a>
              <a href="#" className="hover:text-primary-600 transition-colors">应用市场</a>
              <a href="#" className="hover:text-primary-600 transition-colors">价格</a>
              <a href="#" className="hover:text-primary-600 transition-colors">文档</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowLoginModal(true)}
                className="text-sm font-medium text-slate-600 hover:text-primary-600 px-4 py-2 transition-colors"
              >
                登录
              </button>
              <button 
                onClick={() => setShowRegisterModal(true)}
                className="text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-5 py-2.5 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                免费注册
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-50/50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-meiwos-purple/5 to-transparent"></div>
          {/* Abstract Grid */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-semibold mb-8 animate-fade-in-up">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            美沃斯医美AI战略全新发布
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 mb-8 max-w-4xl mx-auto leading-tight">
            让医美机构 <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-meiwos-purple">
              接入 AI 的无限可能
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            聚合全球顶尖医美 AI 应用，提供账号、财务、数据一站式管理服务。
            赋能机构数字化升级，打造智能医美新生态。
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setShowLoginModal(true)}
              className="group flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-800 transition-all shadow-xl hover:shadow-2xl shadow-primary-900/10 w-full sm:w-auto"
            >
              立即进入控制台
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-50 hover:border-slate-300 transition-all w-full sm:w-auto">
              联系商务合作
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-sm text-slate-400 mb-6">已服务 500+ 顶尖医美机构</p>
            <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Mock Logos */}
               <div className="h-8 w-24 bg-slate-400 rounded"></div>
               <div className="h-8 w-24 bg-slate-400 rounded"></div>
               <div className="h-8 w-24 bg-slate-400 rounded"></div>
               <div className="h-8 w-24 bg-slate-400 rounded"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">为什么选择美沃斯 AI Hub</h2>
            <p className="text-lg text-slate-500">
              整合市场上杂乱的医美AI应用，提供统一的接入标准与管理平台，解决机构 "选型难、接入难、管理难" 的痛点。
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Box className="w-6 h-6 text-white" />}
              title="一站式应用市场"
              description="严选全球优质医美AI应用，涵盖面诊、营销、客服、术后等全场景，一键开通试用。"
              color="bg-blue-500"
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-white" />}
              title="统一权限与SSO"
              description="基于角色的访问控制（RBAC），统一账号单点登录，数据域权限精细化管理，保障数据安全。"
              color="bg-indigo-500"
            />
            <FeatureCard 
              icon={<Globe className="w-6 h-6 text-white" />}
              title="灵活集成方式"
              description="支持API内嵌与外部链接跳转两种模式，无缝对接机构现有业务流程。"
              color="bg-purple-500"
            />
            <FeatureCard 
              icon={<Cpu className="w-6 h-6 text-white" />}
              title="统一计费引擎"
              description="聚合多应用账单，支持按量付费、预充值模式，财务对账清晰透明，T+30自动结算。"
              color="bg-pink-500"
            />
            <FeatureCard 
              icon={<Database className="w-6 h-6 text-white" />}
              title="核心数据资产沉淀"
              description="统一商品库与医疗知识库，构建机构私有数据中台，赋能AI应用更懂你的业务。"
              color="bg-orange-500"
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-white" />}
              title="快速落地能力"
              description="依托美沃斯强大的行业号召力与营销能力，助力AI服务商快速触达精准客户。"
              color="bg-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500 rounded-full blur-[128px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 left-0 w-96 h-96 bg-meiwos-purple rounded-full blur-[128px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
         
         <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">准备好升级您的医美数字化引擎了吗？</h2>
            <p className="text-xl text-slate-300 mb-10">
              立即加入美沃斯 AI Hub，与 500+ 先锋机构共同探索 AI 驱动的医美新未来。
            </p>
            <button 
              onClick={() => setShowRegisterModal(true)}
              className="bg-primary-600 hover:bg-primary-500 text-white px-10 py-4 rounded-full text-lg font-bold transition-all shadow-lg shadow-primary-900/50 hover:shadow-primary-500/30"
            >
              免费注册体验
            </button>
         </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">M</div>
              <span className="font-bold text-slate-900">MeiAI Hub</span>
           </div>
           <div className="text-slate-500 text-sm">
             © 2024 美沃斯医美 All rights reserved.
           </div>
           <div className="flex gap-6 text-slate-400">
             <a href="#" className="hover:text-slate-600">隐私政策</a>
             <a href="#" className="hover:text-slate-600">服务条款</a>
             <a href="#" className="hover:text-slate-600">帮助中心</a>
           </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800">登录控制台</h3>
                      <button onClick={() => setShowLoginModal(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6">
                      <form onSubmit={handleLoginSubmit} className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">手机号码</label>
                              <input 
                                  type="tel" 
                                  value={loginForm.phone}
                                  onChange={e => setLoginForm({...loginForm, phone: e.target.value})}
                                  placeholder="请输入手机号码"
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">验证码</label>
                              <div className="flex gap-2">
                                  <input 
                                      type="text" 
                                      value={loginForm.code}
                                      onChange={e => setLoginForm({...loginForm, code: e.target.value})}
                                      placeholder="请输入验证码"
                                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                  />
                                  <button
                                      type="button"
                                      onClick={handleGetCode}
                                      disabled={countdown > 0}
                                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  >
                                      {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
                                  </button>
                              </div>
                          </div>

                          <button 
                              type="submit"
                              className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 mt-2"
                          >
                              登录
                          </button>
                      </form>
                      
                      <div className="mt-6 text-center text-sm text-slate-500">
                          还没有账号？ <button onClick={() => { setShowLoginModal(false); setShowRegisterModal(true); }} className="text-primary-600 hover:underline font-medium">免费注册</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                  <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800">注册新账号</h3>
                      <button onClick={() => setShowRegisterModal(false)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <div className="p-6">
                      {/* Type Selection Tabs */}
                      <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-100 rounded-lg">
                          {[
                              { id: 'INDIVIDUAL', label: '个人', icon: User },
                              { id: 'INSTITUTION', label: '机构', icon: Building },
                              { id: 'PROVIDER', label: '服务商', icon: Briefcase }
                          ].map(type => (
                              <button
                                  key={type.id}
                                  onClick={() => setRegType(type.id as RegType)}
                                  className={`flex flex-col items-center justify-center py-2 rounded-md text-sm font-medium transition-all ${
                                      regType === type.id 
                                          ? 'bg-white text-primary-600 shadow-sm' 
                                          : 'text-slate-500 hover:text-slate-700'
                                  }`}
                              >
                                  <type.icon className="w-4 h-4 mb-1" />
                                  {type.label}
                              </button>
                          ))}
                      </div>

                      <form onSubmit={handleRegisterSubmit} className="space-y-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">
                                  {regType === 'INDIVIDUAL' ? '姓名' : regType === 'INSTITUTION' ? '机构名称' : '企业名称'}
                              </label>
                              <input 
                                  type="text" 
                                  value={regForm.name}
                                  onChange={e => setRegForm({...regForm, name: e.target.value})}
                                  placeholder={regType === 'INDIVIDUAL' ? '请输入真实姓名' : '请输入营业执照上的名称'}
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">手机号码</label>
                              <input 
                                  type="tel" 
                                  value={regForm.phone}
                                  onChange={e => setRegForm({...regForm, phone: e.target.value})}
                                  placeholder="用于登录和接收验证码"
                                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                              />
                              <p className="text-xs text-slate-400 mt-1">注: 同一手机号在同一类型下不可重复注册</p>
                          </div>

                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">验证码</label>
                              <div className="flex gap-2">
                                  <input 
                                      type="text" 
                                      value={regForm.code}
                                      onChange={e => setRegForm({...regForm, code: e.target.value})}
                                      placeholder="请输入验证码"
                                      className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                  />
                                  <button
                                      type="button"
                                      onClick={handleGetCode}
                                      disabled={countdown > 0}
                                      className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                                  >
                                      {countdown > 0 ? `${countdown}s 后重试` : '获取验证码'}
                                  </button>
                              </div>
                          </div>

                          {error && (
                              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-start gap-2">
                                  <span className="mt-0.5">⚠️</span>
                                  {error}
                              </div>
                          )}

                          <button 
                              type="submit"
                              className="w-full bg-primary-600 text-white font-bold py-3 rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 mt-2"
                          >
                              立即注册并登录
                          </button>
                      </form>
                      
                      <div className="mt-6 text-center text-xs text-slate-400">
                          注册即代表同意 <a href="#" className="text-primary-600 hover:underline">用户协议</a> 和 <a href="#" className="text-primary-600 hover:underline">隐私政策</a>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string }> = ({ icon, title, description, color }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 shadow-lg ${color} shadow-opacity-20`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};
