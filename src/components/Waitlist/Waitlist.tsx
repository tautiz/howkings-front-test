import { WaitlistForm } from './WaitlistForm';
import { GraduationCap } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Waitlist = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-20 overflow-hidden bg-gray-950">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-transparent opacity-50" />
      
      {/* Animated stars effect */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        opacity: '0.1'
      }} />

      <div className="relative container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-blue-600/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('waitlist.title')}
          </h2>
          
          <p className="text-xl text-gray-300 mb-8">
            {t('waitlist.subtitle')}
          </p>
        </div>

        <WaitlistForm />

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              title: '1000+',
              description: t('waitlist.stats.students')
            },
            {
              title: '100%',
              description: t('waitlist.stats.security')
            },
            {
              title: '30 dienų',
              description: t('waitlist.stats.trial')
            }
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-900/50 backdrop-blur-sm">
              <h3 className="text-3xl font-bold text-blue-500 mb-2">{stat.title}</h3>
              <p className="text-gray-400">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
