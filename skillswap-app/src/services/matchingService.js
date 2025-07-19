export const findSkillMatches = (currentUser, allUsers) => {
  if (!currentUser?.skillsToTeach || !currentUser?.skillsToLearn) return [];

  return allUsers.filter((user) => {
    // Don't match with yourself
    if (user.uid === currentUser.uid) return false;

    // Check if user has skills I want to learn AND wants to learn skills I have
    const hasSkillsIWant = currentUser.skillsToLearn.some((skill) =>
      user.skillsToTeach?.includes(skill)
    );

    const wantsSkillsIHave = user.skillsToLearn?.some((skill) =>
      currentUser.skillsToTeach.includes(skill)
    );

    return hasSkillsIWant && wantsSkillsIHave;
  });
};

export const calculateMatchScore = (user1, user2) => {
  let score = 0;

  // Skills match
  user1.skillsToLearn.forEach((skill) => {
    if (user2.skillsToTeach?.includes(skill)) score += 10;
  });

  user2.skillsToLearn?.forEach((skill) => {
    if (user1.skillsToTeach.includes(skill)) score += 10;
  });

  // Location bonus
  if (
    user1.location &&
    user2.location &&
    user1.location.toLowerCase() === user2.location.toLowerCase()
  ) {
    score += 5;
  }

  return score;
};
