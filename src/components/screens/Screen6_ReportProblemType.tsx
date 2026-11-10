import React, { useState } from 'react';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import { ComplaintCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { CategoryIcon } from '../common/CategoryIcon';

interface Props {
  onBack: () => void;
  onSelectCategory: (category: ComplaintCategory, subcategory?: string) => void;
  initialCategory?: ComplaintCategory;
}

export const Screen6_ReportProblemType: React.FC<Props> = ({
  onBack,
  onSelectCategory,
  initialCategory = 'garbage'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');

  const categoryKeys: ComplaintCategory[] = [
    'garbage',
    'road',
    'streetlight',
    'water',
    'drainage',
    'electricity',
    'other'
  ];

  const handleNext = () => {
    onSelectCategory(selectedCategory, selectedSubcategory);
  };

  const currentInfo = CATEGORIES[selectedCategory];

  return (
    <div className="flex flex-col h-full justify-between bg-white px-5 py-4 overflow-y-auto">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-base text-slate-800">Report an Issue</h2>
          <div className="w-5" />
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-3 mb-2">
          <div className="flex-1 h-1.5 rounded-full bg-blue-600" />
          <div className="flex-1 h-1.5 rounded-full bg-slate-200" />
        </div>
        <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
          Step 1 of 2: Select Problem Type
        </p>

        {/* Prompt */}
        <h3 className="text-lg font-bold text-slate-900 mt-2 mb-3">What's the problem?</h3>

        {/* Categories List */}
        <div className="space-y-2.5">
          {categoryKeys.map((catKey) => {
            const cat = CATEGORIES[catKey];
            const isSelected = selectedCategory === catKey;

            return (
              <div key={catKey}>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(catKey);
                    setSelectedSubcategory(cat.subcategories[0] || '');
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between active:scale-[0.99] ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 shadow-xs'
                      : 'border-slate-200/90 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <CategoryIcon category={catKey} size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{cat.name}</h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {cat.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {/* Subcategories picker if selected */}
                {isSelected && cat.subcategories.length > 0 && (
                  <div className="mt-2 ml-4 mr-1 pl-4 border-l-2 border-blue-200 space-y-1.5 py-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Specific issue:
                    </p>
                    {cat.subcategories.map((sub, idx) => (
                      <label
                        key={idx}
                        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-700 py-0.5"
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          value={sub}
                          checked={selectedSubcategory === sub || (!selectedSubcategory && idx === 0)}
                          onChange={() => setSelectedSubcategory(sub)}
                          className="text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                        />
                        <span>{sub}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Hazard Safety Alert for Electricity */}
        {currentInfo.isElectricalHazard && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="text-xs text-red-800 leading-relaxed">
              <strong className="font-bold block">Safety Hazard Alert:</strong>
              Do not touch or approach fallen electric poles, hanging cables or sparking transformers! Keep others away. For immediate life-threatening danger, dial Electricity Helpline <strong>1912</strong>.
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="pt-4 pb-2">
        <button
          onClick={handleNext}
          className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all"
        >
          Next
        </button>
      </div>
    </div>
  );
};
