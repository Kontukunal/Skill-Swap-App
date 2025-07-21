import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroImage from "../assets/hero.svg";
import { useTheme } from "../contexts/ThemeContext";

const HomePage = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const featureCards = [
    {
      title: "Create Your Profile",
      description:
        "List the skills you can teach and what you want to learn. Your profile helps others find you for skill exchanges.",
      icon: (
        <svg
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
      color: "text-indigo-500",
    },
    {
      title: "Find Matches",
      description:
        "Our algorithm connects you with people who have skills you want to learn and want to learn skills you can teach.",
      icon: (
        <svg
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
      color: "text-purple-500",
    },
    {
      title: "Exchange Skills",
      description:
        "Schedule sessions to teach and learn. Meet virtually or in person, and track your progress over time.",
      icon: (
        <svg
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
      ),
      color: "text-pink-500",
    },
  ];

  const testimonials = [
    {
      quote:
        "I learned web development in exchange for teaching Spanish. It's amazing how much you can learn when you're also teaching!",
      name: "Alex Johnson",
      title: "Web Developer & Spanish Tutor",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "SkillSwap helped me find a photography mentor while I shared my cooking skills. The perfect win-win!",
      name: "Sarah Miller",
      title: "Food Blogger & Photography Enthusiast",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote:
        "As a freelancer, I needed to upskill without spending money. SkillSwap was the perfect solution for me.",
      name: "Michael Chen",
      title: "Freelance Designer",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ y }}
      >
        {theme.mode === "dark" ? (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-900 opacity-10 blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-purple-900 opacity-10 blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-indigo-100 opacity-40 blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-64 h-64 rounded-full bg-purple-100 opacity-40 blur-3xl"></div>
          </>
        )}
      </motion.div>

      <section
        className={`relative pt-32 pb-40 overflow-hidden ${theme.mode === "dark" ? "bg-gradient-to-br from-gray-900 to-gray-800" : "bg-gradient-to-br from-indigo-50 via-purple-50 to-gray-50"}`}
      >
        <div className="absolute inset-0">
          {theme.mode === "dark" ? (
            <>
              <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-900 opacity-20 blur-3xl animate-blob"></div>
              <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-900 opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
            </>
          ) : (
            <>
              <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-100 opacity-40 blur-3xl animate-blob"></div>
              <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-purple-100 opacity-40 blur-3xl animate-blob animation-delay-2000"></div>
            </>
          )}
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                  Learn.{" "}
                  <span className="text-indigo-600 dark:text-indigo-400">
                    Teach.
                  </span>{" "}
                  Grow.
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                  Connect with people who want to share their skills and learn
                  from others in return. No money needed, just a willingness to
                  exchange knowledge.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  {currentUser ? (
                    <Link
                      to="/exchange"
                      className="px-8 py-4 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      Start Swapping →
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="px-8 py-4 rounded-lg text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/login"
                        className="px-8 py-4 rounded-lg text-lg font-semibold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {theme.mode === "dark" ? (
                <>
                  <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </>
              ) : (
                <>
                  <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                  <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </>
              )}
              <div className="relative z-10">
                <img
                  src={HeroImage}
                  alt="People exchanging skills"
                  className="w-full h-auto rounded-2xl shadow-2xl border-8 border-white dark:border-gray-800/50"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className={`py-24 ${theme.mode === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                How{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  SkillSwap
                </span>{" "}
                Works
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                A simple three-step process to start exchanging skills with
                like-minded people
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {featureCards.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border ${theme.mode === "dark" ? "bg-gray-800 border-gray-700 group-hover:border-indigo-400" : "bg-white border-gray-100 group-hover:border-indigo-200"}`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full ${feature.color} bg-opacity-10 flex items-center justify-center mb-6`}
                    >
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-6 text-indigo-600 dark:text-indigo-400 font-medium flex items-center">
                      Learn more
                      <svg
                        className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className={`py-16 ${theme.mode === "dark" ? "bg-gray-800" : "bg-gray-50"}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`p-6 rounded-xl ${theme.mode === "dark" ? "bg-gray-700" : "bg-white"} shadow-md`}
            >
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                10,000+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                Active Users
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`p-6 rounded-xl ${theme.mode === "dark" ? "bg-gray-700" : "bg-white"} shadow-md`}
            >
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                5,000+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                Skill Exchanges
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={`p-6 rounded-xl ${theme.mode === "dark" ? "bg-gray-700" : "bg-white"} shadow-md`}
            >
              <div className="text-4xl font-bold text-pink-600 dark:text-pink-400">
                200+
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                Skills Available
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`p-6 rounded-xl ${theme.mode === "dark" ? "bg-gray-700" : "bg-white"} shadow-md`}
            >
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                98%
              </div>
              <div className="mt-2 text-gray-600 dark:text-gray-300">
                Satisfaction Rate
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className={`py-24 ${theme.mode === "dark" ? "bg-gray-900" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                What Our{" "}
                <span className="text-indigo-600 dark:text-indigo-400">
                  Users
                </span>{" "}
                Say
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don't just take our word for it - hear from our community
              </p>
            </div>

            <div className="mt-16 grid gap-8 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <div
                    className={`p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 h-full border ${theme.mode === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}
                  >
                    <div className="flex items-center mb-6">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {testimonial.title}
                        </p>
                      </div>
                    </div>
                    <div className="relative">
                      <svg
                        className="absolute top-0 left-0 transform -translate-x-3 -translate-y-2 h-8 w-8 text-gray-200 dark:text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 32 32"
                      >
                        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                      </svg>
                      <p className="relative text-lg text-gray-700 dark:text-gray-300 italic">
                        "{testimonial.quote}"
                      </p>
                    </div>
                    <div className="mt-6 flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        className={`py-24 ${theme.mode === "dark" ? "bg-gradient-to-r from-indigo-900 to-purple-900" : "bg-gradient-to-r from-indigo-600 to-purple-600"}`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to start your skill exchange journey?
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-10">
              Join thousands of learners and teachers who are already exchanging
              skills and growing together.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {currentUser ? (
                <Link
                  to="/exchange"
                  className="px-8 py-4 rounded-lg text-lg font-semibold text-indigo-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  Browse Skills
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-8 py-4 rounded-lg text-lg font-semibold text-indigo-600 bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Sign Up Free
                  </Link>
                  <Link
                    to="/login"
                    className="px-8 py-4 rounded-lg text-lg font-semibold text-white bg-indigo-700 hover:bg-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
