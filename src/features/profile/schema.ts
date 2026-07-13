import * as v from "valibot";

export const ProfileSchema = v.object({
  name: v.string(),
  onboarded: v.boolean(),
});
