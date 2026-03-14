import { createContext, useContext, useState } from 'react';

const translations = {
    en: {
        home: { title: 'Create Beautiful Digital Invitations', subtitle: 'Design stunning invitations for every occasion', cta: 'Get Started', features: 'Features', templates: 'Browse Templates' },
        nav: { home: 'Home', templates: 'Templates', pricing: 'Pricing', login: 'Login', register: 'Register', dashboard: 'Dashboard' },
        auth: { login: 'Sign In', register: 'Create Account', email: 'Email address', password: 'Password', confirmPassword: 'Confirm Password', name: 'Full Name', forgotPassword: 'Forgot password?', noAccount: "Don't have an account?", hasAccount: 'Already have an account?', googleSignIn: 'Sign in with Google', orEmail: 'or continue with email' },
        dashboard: { title: 'Dashboard', invitations: 'My Invitations', create: 'Create Invitation', payments: 'Payments', settings: 'Settings', noInvitations: 'No invitations yet' },
        common: { save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', loading: 'Loading...', error: 'Something went wrong', success: 'Success!', back: 'Back' },
    },
    hi: {
        home: { title: 'सुंदर डिजिटल निमंत्रण बनाएं', subtitle: 'हर अवसर के लिए शानदार निमंत्रण डिज़ाइन करें', cta: 'शुरू करें', features: 'विशेषताएं', templates: 'टेम्पलेट देखें' },
        nav: { home: 'होम', templates: 'टेम्पलेट', pricing: 'मूल्य', login: 'लॉगिन', register: 'रजिस्टर', dashboard: 'डैशबोर्ड' },
        auth: { login: 'साइन इन', register: 'अकाउंट बनाएं', email: 'ईमेल पता', password: 'पासवर्ड', confirmPassword: 'पासवर्ड की पुष्टि', name: 'पूरा नाम', forgotPassword: 'पासवर्ड भूल गए?', noAccount: 'अकाउंट नहीं है?', hasAccount: 'पहले से अकाउंट है?', googleSignIn: 'Google से साइन इन', orEmail: 'या ईमेल से जारी रखें' },
        dashboard: { title: 'डैशबोर्ड', invitations: 'मेरे निमंत्रण', create: 'निमंत्रण बनाएं', payments: 'भुगतान', settings: 'सेटिंग्स', noInvitations: 'अभी कोई निमंत्रण नहीं' },
        common: { save: 'सहेजें', cancel: 'रद्द करें', delete: 'हटाएं', edit: 'संपादित करें', loading: 'लोड हो रहा है...', error: 'कुछ गलत हो गया', success: 'सफल!', back: 'वापस' },
    },
};

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

    const t = (key) => {
        const keys = key.split('.');
        let result = translations[lang];
        for (const k of keys) {
            result = result?.[k];
        }
        return result || key;
    };

    const switchLanguage = (newLang) => {
        setLang(newLang);
        localStorage.setItem('lang', newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, t, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
