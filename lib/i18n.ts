export const translations = {
  en: {
    nav: {
      login: "Login",
      signup: "Sign Up",
      browse: "Browse",
      dashboard: "Dashboard",
      logout: "Logout",
    },
    auth: {
      register: "Create Account",
      login: "Login",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      userType: "Account Type",
      provider: "Service Provider",
      seeker: "Service Seeker",
      haveAccount: "Already have an account?",
      noAccount: "Don't have an account?",
      checkEmail: "Check your email",
      confirmEmail: "We sent you a confirmation link. Please check your email to activate your account.",
      creating: "Creating account...",
      loading: "Loading...",
      error: "An error occurred",
    },
    dashboard: {
      welcome: "Welcome",
      managePortfolio: "Manage your portfolio and connect with clients",
      browseProfs: "Browse and discover talented professionals",
      yourPortfolio: "Your Portfolio",
      manageProjects: "Manage your projects and showcase your work",
      viewProjects: "View Projects",
      addProject: "Add New Project",
      createProject: "Create Project",
      settings: "Profile Settings",
      editProfile: "Edit Profile",
      messages: "Messages",
      viewMessages: "View Messages",
      browse: "Browse Professionals",
      findTalent: "Find talented service providers",
    },
  },
  ar: {
    nav: {
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      browse: "استعرض",
      dashboard: "لوحة التحكم",
      logout: "تسجيل الخروج",
    },
    auth: {
      register: "إنشاء حساب",
      login: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      fullName: "الاسم الكامل",
      userType: "نوع الحساب",
      provider: "مقدم خدمات",
      seeker: "باحث عن خدمات",
      haveAccount: "هل لديك حساب بالفعل؟",
      noAccount: "ليس لديك حساب؟",
      checkEmail: "تحقق من بريدك الإلكتروني",
      confirmEmail: "لقد أرسلنا لك رابط تأكيد. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.",
      creating: "جاري الإنشاء...",
      loading: "جاري التحميل...",
      error: "حدث خطأ ما",
    },
    dashboard: {
      welcome: "مرحباً",
      managePortfolio: "أدر محفظتك واتصل بالعملاء",
      browseProfs: "استعرض واكتشف محترفين موهوبين",
      yourPortfolio: "محفظتك",
      manageProjects: "أدر مشاريعك واعرض عملك",
      viewProjects: "عرض المشاريع",
      addProject: "إضافة مشروع جديد",
      createProject: "إنشاء مشروع",
      settings: "إعدادات الملف الشخصي",
      editProfile: "تعديل الملف الشخصي",
      messages: "الرسائل",
      viewMessages: "عرض الرسائل",
      browse: "استعرض المحترفين",
      findTalent: "ابحث عن مقدمي خدمات موهوبين",
    },
  },
}

export type Language = "en" | "ar"

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
