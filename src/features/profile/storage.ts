import * as v from "valibot";
import type { Profile } from "./types";
import { ProfileSchema } from "./schema";

const STORAGE_KEY = "todo:profile:v1";

const DEFAULT_PROFILE: Profile = { name: "", onboarded: false };

export function loadProfile(): Profile {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_PROFILE;
  try {
    const parsed = JSON.parse(raw);
    const result = v.safeParse(ProfileSchema, parsed);
    return result.success ? result.output : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // localStorage unavailable (private mode/quota) — keep running in memory only
  }
}
