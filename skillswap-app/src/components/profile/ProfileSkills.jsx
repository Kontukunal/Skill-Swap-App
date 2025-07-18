import React from "react";
import { FiPlus, FiX } from "react-icons/fi";

const ProfileSkills = ({
  title,
  skills,
  onAddSkill,
  onRemoveSkill,
  inputValue,
  onInputChange,
  colorClass,
}) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="mt-2 flex">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="flex-1 rounded-l-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholder={`Add ${title.toLowerCase()}`}
        />
        <button
          onClick={onAddSkill}
          disabled={!inputValue.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus />
        </button>
      </div>
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
            >
              {skill}
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="ml-1.5 inline-flex text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
              >
                <FiX className="h-4 w-4" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileSkills;
