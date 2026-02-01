import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './InstallGuidePage.css';

const InstallGuidePage: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>('android');

  const content = {
    uz: {
      title: "Ilovani O'rnatish",
      subtitle: "The Chef ilovasini qurilmangizga o'rnating",
      tabs: {
        android: "Android",
        ios: "iPhone",
        desktop: "Kompyuter"
      },
      android: {
        title: "Android Telefonlarda",
        steps: [
          {
            icon: "🌐",
            title: "Chrome'da oching",
            desc: "Chrome brauzerida saytga kiring"
          },
          {
            icon: "⬇️",
            title: "Taklif kutib turing",
            desc: "Ekranning pastida 'O'rnatish' tugmasi paydo bo'ladi"
          },
          {
            icon: "✅",
            title: "O'rnatish tugmasini bosing",
            desc: "Tugmani bosing va tasdiqlang"
          },
          {
            icon: "🎉",
            title: "Tayyor!",
            desc: "Ilova bosh ekranda paydo bo'ladi"
          }
        ],
        manual: "Yoki: Chrome'da 3 nuqta (⋮) → 'Bosh ekranga qo'shish'"
      },
      ios: {
        title: "iPhone va iPad'da",
        steps: [
          {
            icon: "🧭",
            title: "Safari'da oching",
            desc: "Faqat Safari brauzerida ishlaydi!"
          },
          {
            icon: "📤",
            title: "Ulashish tugmasini bosing",
            desc: "Pastdagi ulashish belgisini (📤) bosing"
          },
          {
            icon: "➕",
            title: "Bosh ekranga qo'shish",
            desc: "'Add to Home Screen' ni tanlang"
          },
          {
            icon: "🎉",
            title: "Tayyor!",
            desc: "Ilova bosh ekranda paydo bo'ladi"
          }
        ],
        note: "Muhim: Faqat Safari brauzerida ishlaydi!"
      },
      desktop: {
        title: "Kompyuterda",
        steps: [
          {
            icon: "🌐",
            title: "Chrome yoki Edge'da oching",
            desc: "Saytga kiring"
          },
          {
            icon: "⊕",
            title: "O'rnatish belgisini toping",
            desc: "Manzil satrining yonida belgi paydo bo'ladi"
          },
          {
            icon: "✅",
            title: "Belgini bosing",
            desc: "O'rnatish tugmasini bosing"
          },
          {
            icon: "🎉",
            title: "Tayyor!",
            desc: "Ilova alohida oynada ochiladi"
          }
        ],
        manual: "Yoki: 3 nuqta (⋮) → 'O'rnatish The Chef'"
      },
      benefits: {
        title: "Ilovaning Afzalliklari",
        items: [
          { icon: "⚡", text: "Tez ishlaydi" },
          { icon: "📴", text: "Offline ishlaydi" },
          { icon: "💾", text: "Kam joy egallaydi" },
          { icon: "🔄", text: "Avtomatik yangilanadi" },
          { icon: "🔒", text: "Xavfsiz" },
          { icon: "🔔", text: "Bildirishnomalar" }
        ]
      },
      faq: {
        title: "Savol-Javoblar",
        items: [
          {
            q: "Ilova bepulmi?",
            a: "Ha, to'liq bepul!"
          },
          {
            q: "Qancha joy egallaydi?",
            a: "Faqat 2-3 MB, oddiy ilovalar 50-200 MB egallaydi"
          },
          {
            q: "Offline ishlaydi?",
            a: "Ha! Bir marta yuklab olgandan keyin internet bo'lmasa ham ishlaydi"
          },
          {
            q: "Xavfsizmi?",
            a: "Ha! HTTPS shifrlash bilan to'liq himoyalangan"
          }
        ]
      }
    },
    ru: {
      title: "Установка Приложения",
      subtitle: "Установите приложение The Chef на ваше устройство",
      tabs: {
        android: "Android",
        ios: "iPhone",
        desktop: "Компьютер"
      },
      android: {
        title: "На Android Телефонах",
        steps: [
          {
            icon: "🌐",
            title: "Откройте в Chrome",
            desc: "Зайдите на сайт в браузере Chrome"
          },
          {
            icon: "⬇️",
            title: "Дождитесь предложения",
            desc: "Внизу экрана появится кнопка 'Установить'"
          },
          {
            icon: "✅",
            title: "Нажмите Установить",
            desc: "Нажмите кнопку и подтвердите"
          },
          {
            icon: "🎉",
            title: "Готово!",
            desc: "Приложение появится на главном экране"
          }
        ],
        manual: "Или: В Chrome 3 точки (⋮) → 'Добавить на главный экран'"
      },
      ios: {
        title: "На iPhone и iPad",
        steps: [
          {
            icon: "🧭",
            title: "Откройте в Safari",
            desc: "Работает только в браузере Safari!"
          },
          {
            icon: "📤",
            title: "Нажмите Поделиться",
            desc: "Нажмите значок поделиться (📤) внизу"
          },
          {
            icon: "➕",
            title: "На экран Домой",
            desc: "Выберите 'Add to Home Screen'"
          },
          {
            icon: "🎉",
            title: "Готово!",
            desc: "Приложение появится на главном экране"
          }
        ],
        note: "Важно: Работает только в Safari!"
      },
      desktop: {
        title: "На Компьютере",
        steps: [
          {
            icon: "🌐",
            title: "Откройте в Chrome или Edge",
            desc: "Зайдите на сайт"
          },
          {
            icon: "⊕",
            title: "Найдите значок установки",
            desc: "Справа от адресной строки появится значок"
          },
          {
            icon: "✅",
            title: "Нажмите на значок",
            desc: "Нажмите кнопку Установить"
          },
          {
            icon: "🎉",
            title: "Готово!",
            desc: "Приложение откроется в отдельном окне"
          }
        ],
        manual: "Или: 3 точки (⋮) → 'Установить The Chef'"
      },
      benefits: {
        title: "Преимущества Приложения",
        items: [
          { icon: "⚡", text: "Быстро работает" },
          { icon: "📴", text: "Работает офлайн" },
          { icon: "💾", text: "Мало места" },
          { icon: "🔄", text: "Авто-обновления" },
          { icon: "🔒", text: "Безопасно" },
          { icon: "🔔", text: "Уведомления" }
        ]
      },
      faq: {
        title: "Вопросы и Ответы",
        items: [
          {
            q: "Приложение бесплатное?",
            a: "Да, полностью бесплатно!"
          },
          {
            q: "Сколько места занимает?",
            a: "Всего 2-3 МБ, обычные приложения занимают 50-200 МБ"
          },
          {
            q: "Работает офлайн?",
            a: "Да! После установки работает без интернета"
          },
          {
            q: "Это безопасно?",
            a: "Да! Полностью защищено HTTPS шифрованием"
          }
        ]
      }
    },
    en: {
      title: "Install App",
      subtitle: "Install The Chef app on your device",
      tabs: {
        android: "Android",
        ios: "iPhone",
        desktop: "Desktop"
      },
      android: {
        title: "On Android Phones",
        steps: [
          {
            icon: "🌐",
            title: "Open in Chrome",
            desc: "Visit the site in Chrome browser"
          },
          {
            icon: "⬇️",
            title: "Wait for prompt",
            desc: "An 'Install' button will appear at the bottom"
          },
          {
            icon: "✅",
            title: "Tap Install",
            desc: "Tap the button and confirm"
          },
          {
            icon: "🎉",
            title: "Done!",
            desc: "App will appear on home screen"
          }
        ],
        manual: "Or: In Chrome, 3 dots (⋮) → 'Add to Home screen'"
      },
      ios: {
        title: "On iPhone and iPad",
        steps: [
          {
            icon: "🧭",
            title: "Open in Safari",
            desc: "Only works in Safari browser!"
          },
          {
            icon: "📤",
            title: "Tap Share",
            desc: "Tap the share icon (📤) at the bottom"
          },
          {
            icon: "➕",
            title: "Add to Home Screen",
            desc: "Select 'Add to Home Screen'"
          },
          {
            icon: "🎉",
            title: "Done!",
            desc: "App will appear on home screen"
          }
        ],
        note: "Important: Only works in Safari!"
      },
      desktop: {
        title: "On Desktop",
        steps: [
          {
            icon: "🌐",
            title: "Open in Chrome or Edge",
            desc: "Visit the site"
          },
          {
            icon: "⊕",
            title: "Find install icon",
            desc: "An icon will appear next to the address bar"
          },
          {
            icon: "✅",
            title: "Click the icon",
            desc: "Click Install button"
          },
          {
            icon: "🎉",
            title: "Done!",
            desc: "App will open in a separate window"
          }
        ],
        manual: "Or: 3 dots (⋮) → 'Install The Chef'"
      },
      benefits: {
        title: "App Benefits",
        items: [
          { icon: "⚡", text: "Fast performance" },
          { icon: "📴", text: "Works offline" },
          { icon: "💾", text: "Small size" },
          { icon: "🔄", text: "Auto-updates" },
          { icon: "🔒", text: "Secure" },
          { icon: "🔔", text: "Notifications" }
        ]
      },
      faq: {
        title: "FAQ",
        items: [
          {
            q: "Is the app free?",
            a: "Yes, completely free!"
          },
          {
            q: "How much space does it take?",
            a: "Only 2-3 MB, regular apps take 50-200 MB"
          },
          {
            q: "Does it work offline?",
            a: "Yes! Works without internet after installation"
          },
          {
            q: "Is it safe?",
            a: "Yes! Fully protected with HTTPS encryption"
          }
        ]
      }
    }
  };

  const t = content[language as keyof typeof content] || content.en;
  const tabContent = t[activeTab as keyof typeof t] as any;

  return (
    <div className="install-guide-page">
      <div className="install-guide-header">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="install-guide-tabs">
        <button
          className={activeTab === 'android' ? 'active' : ''}
          onClick={() => setActiveTab('android')}
        >
          📱 {t.tabs.android}
        </button>
        <button
          className={activeTab === 'ios' ? 'active' : ''}
          onClick={() => setActiveTab('ios')}
        >
          🍎 {t.tabs.ios}
        </button>
        <button
          className={activeTab === 'desktop' ? 'active' : ''}
          onClick={() => setActiveTab('desktop')}
        >
          💻 {t.tabs.desktop}
        </button>
      </div>

      <div className="install-guide-content">
        <h2>{tabContent.title}</h2>
        
        <div className="install-steps">
          {tabContent.steps.map((step: any, index: number) => (
            <div key={index} className="install-step">
              <div className="step-icon">{step.icon}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {tabContent.manual && (
          <div className="install-manual">
            <strong>{language === 'uz' ? 'Qo\'lda:' : language === 'ru' ? 'Вручную:' : 'Manual:'}</strong> {tabContent.manual}
          </div>
        )}

        {tabContent.note && (
          <div className="install-note">
            ⚠️ {tabContent.note}
          </div>
        )}
      </div>

      <div className="install-benefits">
        <h2>{t.benefits.title}</h2>
        <div className="benefits-grid">
          {t.benefits.items.map((item: any, index: number) => (
            <div key={index} className="benefit-item">
              <span className="benefit-icon">{item.icon}</span>
              <span className="benefit-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="install-faq">
        <h2>{t.faq.title}</h2>
        <div className="faq-list">
          {t.faq.items.map((item: any, index: number) => (
            <div key={index} className="faq-item">
              <h3>❓ {item.q}</h3>
              <p>✅ {item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstallGuidePage;
