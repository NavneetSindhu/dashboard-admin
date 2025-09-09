import React from 'react';
import { BookOpenIcon, ShieldCheckIcon, PhoneIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '../context/LanguageContext';

const resourcesConfig = [
    {
        categoryKey: 'disease_info',
        icon: BookOpenIcon,
        itemKeys: [
            { title: 'about_cholera_title', description: 'about_cholera_desc', link: 'https://en.wikipedia.org/wiki/Cholera' },
            { title: 'typhoid_guide_title', description: 'typhoid_guide_desc', link: 'https://en.wikipedia.org/wiki/Typhoid_fever' },
            { title: 'dengue_guide_title', description: 'dengue_guide_desc', link: 'https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue' },
        ]
    },
    {
        categoryKey: 'preventative_measures',
        icon: ShieldCheckIcon,
        itemKeys: [
            { title: 'safe_water_title', description: 'safe_water_desc', link: 'https://www.who.int/news-room/fact-sheets/detail/drinking-water' },
            { title: 'food_safety_title', description: 'food_safety_desc', link: 'https://www.who.int/news-room/fact-sheets/detail/food-safety' },
            { title: 'hand_hygiene_title', description: 'hand_hygiene_desc', link: 'https://www.cdc.gov/handwashing/when-how-handwashing.html' },
        ]
    },
    {
        categoryKey: 'gov_helplines',
        icon: PhoneIcon,
        itemKeys: [
            { title: 'national_helpline_title', description: 'national_helpline_desc', link: 'tel:1075' }, // Using COVID-19 helpline as a general example
            { title: 'state_helpline_title', description: 'state_helpline_desc', link: 'https://nhm.gov.in/index4.php?lang=1&level=0&linkid=141' },
            { title: 'ambulance_services_title', description: 'ambulance_services_desc', link: 'tel:108' },
        ]
    }
] as const;


const ResourceCard: React.FC<{title: string; description: string; link: string}> = ({ title, description, link }) => (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-lg bg-slate-100 dark:bg-neutral-700 hover:bg-slate-200 dark:hover:bg-neutral-600 transition-all group">
        <div className="flex justify-between items-center">
            <div>
                <p className="font-semibold text-slate-800 dark:text-neutral-200">{title}</p>
                <p className="text-sm text-slate-600 dark:text-neutral-400">{description}</p>
            </div>
            <ArrowTopRightOnSquareIcon className="h-5 w-5 text-slate-400 dark:text-neutral-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
        </div>
    </a>
)


const Resources: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">{t('resources_title_long')}</h1>
                <p className="text-slate-600 dark:text-neutral-400 mt-1">{t('resources_desc')}</p>
            </div>

            <div className="space-y-8">
                {resourcesConfig.map(({ categoryKey, icon: Icon, itemKeys }) => (
                     <div key={categoryKey} className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-neutral-700">
                         <h2 className="text-xl font-semibold text-slate-900 dark:text-white flex items-center mb-4">
                            <Icon className="h-6 w-6 mr-3 text-blue-600 dark:text-blue-500" />
                            {t(categoryKey)}
                         </h2>
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {itemKeys.map(item => <ResourceCard key={item.title} title={t(item.title)} description={t(item.description)} link={item.link} />)}
                         </div>
                     </div>
                ))}
            </div>
        </div>
    );
};

export default Resources;