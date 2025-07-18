import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import { db } from "../config/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import ProfilePlaceholder from "../assets/profile-placeholder.svg";

const ProfilePage = () => {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: "",
    bio: "",
    skillsToTeach: [],
    skillsToLearn: [],
    photoURL: "",
  });
  const [newSkill, setNewSkill] = useState({ teach: "", learn: "" });
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(ProfilePlaceholder);

  useEffect(() => {
    const fetchProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setFormData({
              displayName: data.displayName || currentUser.displayName || "",
              bio: data.bio || "",
              skillsToTeach: data.skillsToTeach || [],
              skillsToLearn: data.skillsToLearn || [],
              photoURL: data.photoURL || "",
            });
            setPreviewImage(
              data.photoURL || currentUser.photoURL || ProfilePlaceholder
            );
          } else {
            setFormData((prev) => ({
              ...prev,
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
            }));
            setPreviewImage(currentUser.photoURL || ProfilePlaceholder);
          }
        } catch (error) {
          toast.error("Failed to load profile");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleAddSkill = (type) => {
    const skill = newSkill[type].trim();
    if (skill && !formData[`skillsTo${type}`].includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        [`skillsTo${type}`]: [...prev[`skillsTo${type}`], skill],
      }));
      setNewSkill((prev) => ({ ...prev, [type]: "" }));
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
    setLoading(true);

    try {
      // Update profile in Firebase Auth
      await updateUserProfile({
        displayName: formData.displayName,
        photoURL: previewImage.includes("blob:")
          ? currentUser.photoURL
          : previewImage,
      });

      // Update profile in Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        ...formData,
        photoURL: previewImage.includes("blob:")
          ? currentUser.photoURL
          : previewImage,
        updatedAt: serverTimestamp(),
      });

      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className="flex justify-center py-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              {previewImage ? (
                <img
                  className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-800 object-cover"
                  src={previewImage}
                  alt="Profile"
                />
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-gray-300 flex items-center justify-center">
                  <span className="text-4xl text-gray-600">
                    {formData.displayName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              )}
              <label
                htmlFor="profile-image"
                className="absolute bottom-2 right-2 bg-indigo-600 text-white p-2 rounded-full cursor-pointer hover:bg-indigo-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

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
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) =>
                    setFormData({ ...formData, displayName: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Bio
              </label>
              <textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                placeholder="Tell others about yourself..."
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
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add a skill you can teach"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill("Teach")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
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
                        <span className="sr-only">Remove skill</span>
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
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
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 dark:border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Add a skill you want to learn"
                />
                <button
                  type="button"
                  onClick={() => handleAddSkill("Learn")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add
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
                        <span className="sr-only">Remove skill</span>
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
