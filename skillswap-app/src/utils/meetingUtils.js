// src/utils/meetingUtils.js

export const generateMeetingLink = () => {
  const randomId = Math.random().toString(36).substring(2, 10);
  return `https://meet.google.com/new?hs=181&authuser=0&tf=0&nv=1&s=${randomId}`;
};

export const isMeetingActive = (session) => {
  if (!session.date || !session.time || !session.duration) return false;

  const sessionDateTime = new Date(`${session.date}T${session.time}`);
  const now = new Date();
  const tenMinutesBefore = new Date(sessionDateTime.getTime() - 10 * 60000);
  const sessionEndTime = new Date(
    sessionDateTime.getTime() + parseInt(session.duration) * 60000
  );
  const thirtyMinutesAfter = new Date(sessionEndTime.getTime() + 30 * 60000);

  // Meeting is active from 10 minutes before until 30 minutes after scheduled end
  return now >= tenMinutesBefore && now <= thirtyMinutesAfter;
};

export const shouldShowJoinButton = (session) => {
  if (!session.date || !session.time || !session.duration) return false;

  const sessionDateTime = new Date(`${session.date}T${session.time}`);
  const now = new Date();
  const tenMinutesBefore = new Date(sessionDateTime.getTime() - 10 * 60000);
  const sessionEndTime = new Date(
    sessionDateTime.getTime() + parseInt(session.duration) * 60000
  );

  // Show join button from 10 minutes before until scheduled end time
  return now >= tenMinutesBefore && now <= sessionEndTime;
};

export const isSessionCompleted = (session) => {
  if (!session.date || !session.time || !session.duration) return false;

  const sessionEndTime = new Date(
    new Date(`${session.date}T${session.time}`).getTime() +
      parseInt(session.duration) * 60000
  );
  const now = new Date();

  return now > sessionEndTime;
};
