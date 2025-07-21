import { useState, useEffect } from "react";
import {
  findSkillMatches,
  calculateMatchScore,
} from "../services/matchingService";

export const useSkillMatching = (currentUser, allUsers) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && allUsers.length > 0) {
      setLoading(true);
      const potentialMatches = findSkillMatches(currentUser, allUsers);

      const sortedMatches = potentialMatches
        .map((user) => ({
          user,
          score: calculateMatchScore(currentUser, user),
        }))
        .sort((a, b) => b.score - a.score);

      setMatches(sortedMatches);
      setLoading(false);
    }
  }, [currentUser, allUsers]);

  return { matches, loading };
};
