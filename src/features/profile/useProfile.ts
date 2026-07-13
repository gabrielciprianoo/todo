import { useEffect, useState } from "react";
import { loadProfile, saveProfile } from "./storage";

export function useProfile() {
  const [profile, setProfile] = useState(loadProfile);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  const setName = (name: string) =>
    setProfile({ name, onboarded: true });

  const skipOnboarding = () =>
    setProfile((prev) => ({ ...prev, onboarded: true }));

  return { name: profile.name, onboarded: profile.onboarded, setName, skipOnboarding };
}
