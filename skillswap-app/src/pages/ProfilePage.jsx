import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import ProfilePlaceholder from "../assets/profile-placeholder.svg";
import { FiX, FiPlus, FiLink, FiLoader, FiEdit2, FiSave } from "react-icons/fi";
import { useTheme } from "../contexts/ThemeContext";

const ProfilePage = () => {
  const { currentUser, updateUserProfile, reloadUser } = useAuth();
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    skillsToTeach: [],
    skillsToLearn: [],
    photoURL: "",
  });
  const [newSkill, setNewSkill] = useState({ teach: "", learn: "" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const initializeProfile = async () => {
      if (!currentUser?.uid) return;

      try {
        setLoading(true);
        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (!isMounted) return;

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            displayName: currentUser.displayName || "",
            bio: "",
            skillsToTeach: [],
            skillsToLearn: [],
            photoURL: currentUser.photoURL || "",
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            email: currentUser.email,
            uid: currentUser.uid,
          });
        }

        const data = userDoc.exists()
          ? userDoc.data()
          : {
              displayName: currentUser.displayName || "",
              bio: "",
              skillsToTeach: [],
              skillsToLearn: [],
              photoURL: currentUser.photoURL || "",
            };

        if (isMounted) {
          setFormData(data);
          setImageUrlInput(data.photoURL || "");
        }
      } catch (error) {
        console.error("Profile initialization error:", error);
        toast.error("Failed to load profile data");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeProfile();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleAddImageUrl = () => {
    const url = imageUrlInput?.trim() || "";
    if (url && isValidUrl(url)) {
      setFormData((prev) => ({
        ...prev,
        photoURL: url,
      }));
      setShowUrlInput(false);
      toast.success("Profile image URL saved");
    } else {
      toast.error("Please enter a valid image URL");
    }
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleAddSkill = (type) => {
    const skillField = type === "Teach" ? "teach" : "learn";
    const skill = newSkill[skillField]?.trim() || "";

    if (skill && !formData[`skillsTo${type}`].includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        [`skillsTo${type}`]: [...prev[`skillsTo${type}`], skill],
      }));
      setNewSkill((prev) => ({ ...prev, [skillField]: "" }));
    }
  };

  const handleRemoveSkill = (type, skill) => {
    setFormData((prev) => ({
      ...prev,
      [`skillsTo${type}`]: prev[`skillsTo${type}`].filter((s) => s !== skill),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    setSubmitting(true);

    try {
      await updateUserProfile({
        displayName: formData.displayName,
        photoURL: formData.photoURL,
      });

      await setDoc(
        doc(db, "users", currentUser.uid),
        {
          displayName: formData.displayName,
          bio: formData.bio,
          skillsToTeach: formData.skillsToTeach,
          skillsToLearn: formData.skillsToLearn,
          photoURL: formData.photoURL,
          updatedAt: serverTimestamp(),
          email: currentUser.email,
          uid: currentUser.uid,
        },
        { merge: true }
      );

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-indigo-500 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {theme.mode === "dark" ? (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-900 opacity-10 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-900 opacity-10 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        ) : (
          <>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-100 opacity-40 blur-3xl animate-blob"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-100 opacity-40 blur-3xl animate-blob animation-delay-2000"></div>
          </>
        )}
      </div>

      <div className="relative max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`glass rounded-3xl overflow-hidden shadow-2xl mb-8 ${theme.mode === "dark" ? "border border-gray-700" : "border border-white"}`}
        >
          <div
            className={`h-48 relative ${theme.mode === "dark" ? "bg-gradient-to-r from-gray-800 to-gray-900" : "bg-gradient-to-r from-indigo-100 to-purple-100"}`}
          >
            <div className="absolute -bottom-16 left-8 transform hover:scale-105 transition-transform duration-300">
              <div className="relative group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 object-cover relative z-10"
                  src={formData.photoURL || ProfilePlaceholder}
                  alt="Profile"
                  onError={(e) => {
                    e.target.src = ProfilePlaceholder;
                  }}
                />
                <button
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="absolute bottom-2 right-2 z-20 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-all shadow-lg"
                >
                  <FiLink className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="px-8 pt-20 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formData.displayName ||
                    currentUser?.displayName ||
                    "Anonymous"}
                </h1>
                <p className="text-indigo-500 dark:text-indigo-400">
                  {currentUser?.email}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`flex items-center px-4 py-2 rounded-lg ${
                  isEditing
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                } transition-colors shadow-md`}
              >
                {isEditing ? (
                  <>
                    <FiSave className="mr-2" />
                    View Mode
                  </>
                ) : (
                  <>
                    <FiEdit2 className="mr-2" />
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            {showUrlInput && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 overflow-hidden"
              >
                <div className="flex rounded-lg shadow-sm">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                    className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={handleAddImageUrl}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-r-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Save Image
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`glass rounded-3xl p-8 shadow-2xl ${theme.mode === "dark" ? "border border-gray-700" : "border border-white"}`}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-3"></span>
              About Me
            </h2>

            {isEditing ? (
              <textarea
                rows={5}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="w-full px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-inner"
                placeholder="Tell others about yourself..."
                maxLength={500}
              />
            ) : (
              <p className="text-gray-700 dark:text-gray-300">
                {formData.bio || "No bio yet. Add something about yourself!"}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`glass rounded-3xl p-8 shadow-2xl ${theme.mode === "dark" ? "border border-gray-700" : "border border-white"}`}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <span className="w-3 h-3 rounded-full bg-purple-500 mr-3"></span>
              My Skills
            </h2>

            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                I Can Teach
              </h3>
              {isEditing ? (
                <>
                  <div className="flex rounded-lg shadow-sm mb-3">
                    <input
                      type="text"
                      value={newSkill.teach}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, teach: e.target.value })
                      }
                      className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add a skill you can teach"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill("Teach")}
                      disabled={!newSkill.teach?.trim()}
                      className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="h-5 w-5" />
                    </button>
                  </div>
                  {formData.skillsToTeach.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsToTeach.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200 shadow-md"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill("Teach", skill)}
                            className="ml-2 inline-flex text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 focus:outline-none"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {formData.skillsToTeach.length > 0 ? (
                    formData.skillsToTeach.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-200 shadow-md"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No teaching skills added yet
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                I Want to Learn
              </h3>
              {isEditing ? (
                <>
                  <div className="flex rounded-lg shadow-sm mb-3">
                    <input
                      type="text"
                      value={newSkill.learn}
                      onChange={(e) =>
                        setNewSkill({ ...newSkill, learn: e.target.value })
                      }
                      className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-lg border-0 focus:ring-2 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Add a skill you want to learn"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkill("Learn")}
                      disabled={!newSkill.learn?.trim()}
                      className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiPlus className="h-5 w-5" />
                    </button>
                  </div>
                  {formData.skillsToLearn.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.skillsToLearn.map((skill) => (
                        <motion.div
                          key={skill}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-teal-100 text-green-800 dark:from-green-900 dark:to-teal-900 dark:text-green-200 shadow-md"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill("Learn", skill)}
                            className="ml-2 inline-flex text-green-600 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 focus:outline-none"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {formData.skillsToLearn.length > 0 ? (
                    formData.skillsToLearn.map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-100 to-teal-100 text-green-800 dark:from-green-900 dark:to-teal-900 dark:text-green-200 shadow-md"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      No learning skills added yet
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-8 flex justify-end"
          >
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <FiLoader className="animate-spin mr-3 h-5 w-5" />
                  Saving...
                </>
              ) : (
                <>
                  <FiSave className="mr-3 h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
