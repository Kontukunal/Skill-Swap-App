import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import ProfilePlaceholder from "../assets/profile-placeholder.svg";
import { FiX, FiPlus, FiLink, FiLoader } from "react-icons/fi";

const ProfilePage = () => {
  const { currentUser, updateUserProfile, reloadUser } = useAuth();
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
        <FiLoader className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-16 left-6">
            <div className="relative group">
              <img
                className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 object-cover"
                src={formData.photoURL || ProfilePlaceholder}
                alt="Profile"
                onError={(e) => {
                  e.target.src = ProfilePlaceholder;
                }}
              />
              <button
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700 transition-colors"
              >
                <FiLink className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {showUrlInput && (
          <div className="px-6 pt-4">
            <div className="flex rounded-md shadow-sm mb-4">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleAddImageUrl}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="px-6 pt-20 pb-6">
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                  minLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Bio
              </label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Tell others about yourself..."
                maxLength={500}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills I Can Teach
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={newSkill.teach}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, teach: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add a skill you can teach"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill("Teach")}
                  disabled={!newSkill.teach?.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus />
                </button>
              </div>
              {formData.skillsToTeach.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skillsToTeach.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill("Teach", skill)}
                        className="ml-1.5 inline-flex text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-indigo-100 focus:outline-none"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skills I Want to Learn
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={newSkill.learn}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, learn: e.target.value })
                  }
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add a skill you want to learn"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill("Learn")}
                  disabled={!newSkill.learn?.trim()}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus />
                </button>
              </div>
              {formData.skillsToLearn.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skillsToLearn.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill("Learn", skill)}
                        className="ml-1.5 inline-flex text-green-600 dark:text-green-300 hover:text-green-900 dark:hover:text-green-100 focus:outline-none"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                {submitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
