export type Profile = {
  name: string; // "" if the user skipped onboarding
  onboarded: boolean; // true once the onboarding modal has been shown/dismissed
};

export type ProgressBucket = "empty" | "in-progress" | "complete";
