import {
  useCallback,
  useEffect,
  useState,
  useRef,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Mail, Camera, X, Plus, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";

import { Card, CardTitle } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Loader } from "@/components/Loader";
import { toast } from "@/hooks/use-toast";

import { getUserById, updateProfile, uploadProfilePicture } from "@/auth-actions/AuthActions";
import {
  selectDecryptedTokens,
  selectUser,
  selectProfileState,
  type AppDispatch,
} from "@/store/store";
import type { ProfileRequest } from "@/types";
import { fadeUp } from "@/lib/utils";

export function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const run = useCallback(
    (fn: unknown) => (dispatch as unknown as (fn: unknown) => Promise<unknown>)(fn),
    [dispatch],
  );

  const authUser = useSelector(selectUser);
  const { accessToken } = useSelector(selectDecryptedTokens);
  const { userProfile, profile, loading, saving, uploading } = useSelector(selectProfileState);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");

  useEffect(() => {
    if (!profile) return;
    setEducation(profile.education ?? "");
    setSkills(profile.skills ?? []);
    setInterests(profile.interests ?? []);
  }, [profile]);

  useEffect(() => {
    if (!authUser?.userId || !accessToken) return;
    run(getUserById(authUser.userId, accessToken));
  }, [authUser?.userId, accessToken, run]);

  const handleSave = async () => {
    if (!authUser?.userId || !accessToken) return;
    const payload: ProfileRequest = { education, skills, interests };
    try {
      await run(updateProfile(authUser.userId, payload, accessToken));
      toast.success({ title: "Profile saved" });
    } catch(error : any) {
      toast.error({ title: error.message || "Failed to save profile" });
    }
  };

  const handlePictureChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser?.userId || !accessToken) return;
    try {
      await run(uploadProfilePicture(authUser.userId, file, accessToken));
      toast.success({ title: "Profile picture updated" });
    } catch(error : any) {
      toast.error({ title: error.message || "Failed to update profile picture" });
    }
    e.target.value = "";
  };

  const addTag = (
    value: string,
    list: string[],
    setList: (v: string[]) => void,
    setCurrent: (v: string) => void,
  ) => {
    const v = value.trim();
    if (!v || list.includes(v)) {
      setCurrent("");
      return;
    }
    setList([...list, v]);
    setCurrent("");
  };

  const removeTag = (item: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.filter((x) => x !== item));

  const firstName = userProfile?.firstName ?? authUser?.firstName ?? "";
  const lastName = userProfile?.lastName ?? authUser?.lastName ?? "";
  const email = userProfile?.email ?? authUser?.email ?? "";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const displayName = [firstName, lastName].filter(Boolean).join(" ");
  if (loading && !profile) {
    return <Loader fullscreen label="Loading profile…" />;
  }

  return (
    <motion.div className="space-y-6" {...fadeUp}>
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted-foreground">Manage your personal and career profile.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <Card className="lg:col-span-1 flex flex-col items-center text-center gap-5">
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white overflow-hidden select-none">
              {profile?.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile picture"
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || "?"
              )}
            </div>

            <button
              type="button"
              title="Change profile picture"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-glow hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePictureChange}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">{displayName || "—"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{education || "No education set"}</p>
          </div>
          <div className="w-full space-y-2 text-sm text-left text-muted-foreground">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{email || "—"}</span>
            </div>

            {userProfile?.emailVerified ? (
              <div className="flex items-center gap-2 text-success text-xs">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Email verified
              </div>
            ) : userProfile && !userProfile.emailVerified ? (
              <div className="flex items-center gap-2 text-warning text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                Email not verified
              </div>
            ) : null}
          </div>
          {skills.length > 0 && (
            <div className="w-full pt-4 border-t border-glass-border text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <Chip key={s} tone="primary">
                    {s}
                  </Chip>
                ))}
              </div>
            </div>
          )}
          {interests.length > 0 && (
            <div className="w-full pt-4 border-t border-glass-border text-left">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Interests
              </p>
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <Chip key={i} tone="accent">
                    {i}
                  </Chip>
                ))}
              </div>
            </div>
          )}
        </Card>
        <Card className="lg:col-span-2 space-y-6">
          <CardTitle>Edit profile</CardTitle>
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Account info</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First name" value={firstName} readOnly disabled />
              <Input label="Last name" value={lastName} readOnly disabled />
              <div className="md:col-span-2">
                <Input label="Email" type="email" value={email} readOnly disabled />
              </div>
            </div>
          </section>
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Career background
            </p>
            <Input
              label="Education"
              placeholder="e.g. BSc Computer Science, High School - Commercial Studies, etc."
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </section>
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Skills</p>
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Enter…"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(newSkill, skills, setSkills, setNewSkill);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag(newSkill, skills, setSkills, setNewSkill)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <Chip key={s} tone="primary">
                    {s}
                    <button
                      type="button"
                      onClick={() => removeTag(s, skills, setSkills)}
                      className="ml-1 opacity-60 hover:opacity-100 hover:text-destructive transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Chip>
                ))}
              </div>
            )}
          </section>
          <section className="space-y-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Interests</p>
            <div className="flex gap-2">
              <Input
                placeholder="Type an interest and press Enter…"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag(newInterest, interests, setInterests, setNewInterest);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addTag(newInterest, interests, setInterests, setNewInterest)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add
              </Button>
            </div>
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {interests.map((i) => (
                  <Chip key={i} tone="accent">
                    {i}
                    <button
                      type="button"
                      onClick={() => removeTag(i, interests, setInterests)}
                      className="ml-1 opacity-60 hover:opacity-100 hover:text-destructive transition-all"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Chip>
                ))}
              </div>
            )}
          </section>
          <div className="flex justify-end pt-4 border-t border-glass-border">
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save changes
            </Button>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
