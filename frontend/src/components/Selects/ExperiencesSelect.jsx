import Select from "react-select";
import { FaTimes } from "react-icons/fa";

function ExperienceSelect({ allExperiences, selectedExperiences, setEditForm}) {
  
  const experienceOptions = allExperiences.map((exp) => ({
    value: exp,
    label: exp,
  }));

  // Stili personalizzati
  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: '9999px',
      borderColor: 'rgba(255,255,255,0.25)',
      padding: '0.16rem',
      color: 'white',
      cursor: 'pointer'
    }),
    option: (provided, state) => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        ...provided,
        backgroundColor: state.isFocused
          ? (isDark ? '#475569' : '#1E40AF')
          : (isDark ? '#64748B' : '#2563EB'),
        color: 'white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
      };
    },
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'white',
      opacity: 1
    }),
    menu: (provided) => {
      const isDark = document.documentElement.classList.contains('dark');
      return {
        ...provided,
        zIndex: 3000,
        backgroundColor: isDark ? "#334155" : "#1E3A8A",
        borderRadius: '1rem',
        overflow: 'hidden',
      };
    },
    menuList: (provided) => ({
      ...provided,
      padding: 0,
      maxHeight: '200px',
      overflowY: 'auto',
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 99999,
    }),
  };

  return (
    <div className="space-y-3">
      {/* Select */}
      <Select
        value={null}
        onChange={(option) => {
          if (option && !selectedExperiences.includes(option.value)) {
            setEditForm((prev) => ({
              ...prev,
              experiences: [...prev.experiences, option.value],
            }));
          }
        }}
        options={experienceOptions}
        styles={customStyles}
        isSearchable={false}
        classNamePrefix="custom"
        menuPortalTarget={document.body}
        menuPosition="fixed"
        placeholder="Seleziona un'esperienza"
      />

      {/* Esperienze selezionate */}
      {selectedExperiences.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedExperiences.map((exp, index) => (
            <span
              key={index}
              className="bg-linear-to-br from-blue-600 to-cyan-500 dark:from-blue-600/70 dark:to-cyan-500/70 
              px-3 py-1 rounded-full text-sm text-white flex items-center gap-2 shadow-md">
              {exp}
              <button
                type="button"
                onClick={() =>
                  setEditForm((prev) => ({
                    ...prev,
                    experiences: prev.experiences.filter((x) => x !== exp),
                  }))
                }
                className="hover:text-rose-400 transition cursor-pointer">
                <FaTimes size={20} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExperienceSelect;
