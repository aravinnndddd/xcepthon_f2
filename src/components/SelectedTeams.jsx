import React, { useEffect, useMemo, useState } from "react";
import { PROBLEM_STATEMENTS } from "../data/problemStatements";
import { AnimatePresence, motion } from "framer-motion";
import { Users, Shield, Loader2, CheckCircle2 } from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";


const teams = [
  { name: "Tea Spillers", problemId: 1 },
  { name: "Delta Automations", problemId: 2 },
  { name: "Null Byte", problemId: 4 },
  { name: "Algorix", problemId: 1 },
  { name: "T-Rex", problemId: 4 },
  { name: "Cypher", problemId: 3 },
  { name: "3BITS", problemId: 1 },
  { name: "Hyphen", problemId: 1 },
  { name: "Hive Minds", problemId: 3 },
  { name: "NORTH WIND", problemId: 2 },
  { name: "CodeCrafters", problemId: 1 },
  { name: "K Factory", problemId: 3 },
  { name: "X-CEPtionals", problemId: 2 },
  { name: "SPADEZZZ", problemId: 3 },
  { name: "Coding Ninjas", problemId: 4 },
  { name: "Caffeine fueled Coderss", problemId: 3 },
];

const TEAM_PASSKEYS = {
  "tea-spillers": "XCP-TEA-9421",
  "delta-automations": "XCP-DEL-6153",
  "null-byte": "XCP-NUL-3384",
  algorix: "XCP-ALG-8042",
  "t-rex": "XCP-TRX-1276",
  cypher: "XCP-CYP-5591",
  "3bits": "XCP-3BT-4607",
  hyphen: "XCP-HYP-2819",
  "hive-minds": "XCP-HIV-7346",
  "north-wind": "XCP-NWD-9905",
  codecrafters: "XCP-CDC-4178",
  "k-factory": "XCP-KFC-6630",
  "x-ceptionals": "XCP-XCP-1452",
  spadezzz: "XCP-SPD-8724",
  "coding-ninjas": "XCP-CDN-5068",
  "caffeine-fueled-coderss": "XCP-CFC-3197",
};

const toTeamDocId = (teamName) =>
  teamName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const SelectedTeams = () => {
  const [abstracts, setAbstracts] = useState({});
  const [savedAbstracts, setSavedAbstracts] = useState({});
  const [driveLinks, setDriveLinks] = useState({});
  const [savedDriveLinks, setSavedDriveLinks] = useState({});
  const [loadingByTeam, setLoadingByTeam] = useState({});
  const [statusByTeam, setStatusByTeam] = useState({});
  const [activeDriveDialogTeamId, setActiveDriveDialogTeamId] = useState("");
  const [driveLinkDraft, setDriveLinkDraft] = useState("");
  const [dialogPasskey, setDialogPasskey] = useState("");
  const [dialogPasskeyVerified, setDialogPasskeyVerified] = useState(false);
  const [dialogError, setDialogError] = useState("");

  const teamsByDocId = useMemo(() => {
    const map = {};
    teams.forEach((team) => {
      map[toTeamDocId(team.name)] = team;
    });
    return map;
  }, []);

  useEffect(() => {
    const fetchSavedAbstracts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "teamAbstracts"));
        const nextSaved = {};
        const nextDrafts = {};
        const nextSavedLinks = {};
        const nextDraftLinks = {};

        snapshot.forEach((item) => {
          const data = item.data();
          if (!teamsByDocId[item.id]) {
            return;
          }

          const abstractText = data?.abstract || "";
          const driveLink = data?.driveLink || "";
          nextSaved[item.id] = abstractText;
          nextDrafts[item.id] = abstractText;
          nextSavedLinks[item.id] = driveLink;
          nextDraftLinks[item.id] = driveLink;
        });

        setSavedAbstracts(nextSaved);
        setAbstracts(nextDrafts);
        setSavedDriveLinks(nextSavedLinks);
        setDriveLinks(nextDraftLinks);
      } catch (error) {
        console.error("Failed to fetch team abstracts:", error);
      }
    };

    fetchSavedAbstracts();
  }, [teamsByDocId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const handleAbstractChange = (teamDocId, value) => {
    setAbstracts((prev) => ({
      ...prev,
      [teamDocId]: value,
    }));

    if (statusByTeam[teamDocId]) {
      setStatusByTeam((prev) => ({
        ...prev,
        [teamDocId]: "",
      }));
    }
  };

  const handleDriveLinkChange = (teamDocId, value) => {
    setDriveLinks((prev) => ({
      ...prev,
      [teamDocId]: value,
    }));

    if (statusByTeam[teamDocId]) {
      setStatusByTeam((prev) => ({
        ...prev,
        [teamDocId]: "",
      }));
    }
  };

  const openDriveDialog = (teamDocId) => {
    setActiveDriveDialogTeamId(teamDocId);
    setDriveLinkDraft(driveLinks[teamDocId] || "");
    setDialogPasskey("");
    setDialogPasskeyVerified(false);
    setDialogError("");

    if (statusByTeam[teamDocId]) {
      setStatusByTeam((prev) => ({
        ...prev,
        [teamDocId]: "",
      }));
    }
  };

  const syncTeamData = async (teamDocId, driveLinkValue) => {
    const team = teamsByDocId[teamDocId];
    if (!team) return;

    const abstractText = (abstracts[teamDocId] || "").trim();
    const driveLink = (driveLinkValue || driveLinks[teamDocId] || "").trim();

    setLoadingByTeam((prev) => ({
      ...prev,
      [teamDocId]: true,
    }));
    setStatusByTeam((prev) => ({
      ...prev,
      [teamDocId]: "",
    }));

    try {
      await setDoc(
        doc(db, "teamAbstracts", teamDocId),
        {
          teamName: team.name,
          problemId: team.problemId,
          abstract: abstractText,
          driveLink,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      setSavedDriveLinks((prev) => ({
        ...prev,
        [teamDocId]: driveLink,
      }));
      setDriveLinks((prev) => ({
        ...prev,
        [teamDocId]: driveLink,
      }));
      setStatusByTeam((prev) => ({
        ...prev,
        [teamDocId]: "Saved successfully.",
      }));
    } catch (error) {
      console.error("Failed to save team data:", error);
      setStatusByTeam((prev) => ({
        ...prev,
        [teamDocId]: "Failed to save. Check Firestore rules.",
      }));
      setDialogError("Save failed. Check console for details.");
    } finally {
      setLoadingByTeam((prev) => ({
        ...prev,
        [teamDocId]: false,
      }));
    }
  };

  const closeDriveDialog = () => {
    setActiveDriveDialogTeamId("");
    setDriveLinkDraft("");
    setDialogPasskey("");
    setDialogPasskeyVerified(false);
    setDialogError("");
  };

  const verifyDialogPasskey = () => {
    if (!activeDriveDialogTeamId) {
      return;
    }

    if (!dialogPasskey.trim()) {
      setDialogError("Enter team passkey to continue.");
      setDialogPasskeyVerified(false);
      return;
    }

    if (dialogPasskey.trim() !== TEAM_PASSKEYS[activeDriveDialogTeamId]) {
      setDialogError("Incorrect passkey for this team.");
      setDialogPasskeyVerified(false);
      return;
    }

    setDialogPasskeyVerified(true);
    setDialogError("");
  };

  const saveDriveDialog = () => {
    if (!activeDriveDialogTeamId) {
      return;
    }

    if (!dialogPasskeyVerified) {
      setDialogError("Verify team passkey before saving link.");
      return;
    }

    if (
      driveLinkDraft.trim() &&
      !/^https:\/\/(drive|docs)\.google\.com\/.+/i.test(driveLinkDraft.trim())
    ) {
      setDialogError("Please enter a valid Google Drive link.");
      return;
    }

    setDriveLinks((prev) => ({
      ...prev,
      [activeDriveDialogTeamId]: driveLinkDraft,
    }));

    // Trigger sync to Firestore
    syncTeamData(activeDriveDialogTeamId, driveLinkDraft);

    closeDriveDialog();
  };


  return (
    <section
      id="selected-teams"
      className="py-16 md:py-24 bg-goku-dark relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-goku-orange/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-goku-indigo/10 blur-[80px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4"
          >
            SELECTED <span className="text-yellow-400">TEAMS</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true, margin: "-50px" }}
            className="h-1 bg-gradient-to-r from-goku-orange to-transparent mx-auto"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teams.map((team, index) => {
            const problem = PROBLEM_STATEMENTS[team.problemId];
            const teamDocId = toTeamDocId(team.name);
            const isSaving = !!loadingByTeam[teamDocId];
            const currentAbstract = abstracts[teamDocId] || "";
            const savedAbstract = savedAbstracts[teamDocId] || "";
            const currentDriveLink = driveLinks[teamDocId] || "";
            const savedDriveLink = savedDriveLinks[teamDocId] || "";
            const isDirty =
              currentAbstract.trim() !== savedAbstract.trim() ||
              currentDriveLink.trim() !== savedDriveLink.trim();
            const statusMessage = statusByTeam[teamDocId] || "";
            const isSuccess = statusMessage === "Saved successfully.";

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
                className="bg-orange-600/90 backdrop-blur-sm p-4 sm:p-6 flex flex-col gap-4 group transition-all duration-300 rounded-2xl shadow-lg border border-orange-400/30 hover:bg-orange-600 hover:border-orange-400/60"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                    currentDriveLink.trim()
                      ? "bg-green-700 border-green-500/50"
                      : "bg-white/20 border-white/30 group-hover:bg-white/30"
                  }`}>
                    <Shield size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl text-white tracking-wide truncate group-hover:text-yellow-200 transition-colors">
                      {team.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={12} className="text-white/60" />
                      <span className="text-white/60 text-[10px] uppercase tracking-wider font-medium">
                        Qualified Fighter
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2 font-semibold">
                    Problem Statement
                  </p>
                  <h4 className="text-white font-heading text-sm sm:text-base leading-snug group-hover:text-yellow-100 transition-colors">
                    {problem.title}
                  </h4>
                </div>

                <div className="mt-1 pt-4 border-t border-white/10 flex flex-col gap-3">
                  {/* <textarea
                    value={currentAbstract}
                    onChange={(event) =>
                      handleAbstractChange(teamDocId, event.target.value)
                    }
                    placeholder="Write your team abstract here..."
                    rows={4}
                    className="w-full resize-none rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    disabled={isSaving}
                  /> */}

                  <button
                    type="button"
                    onClick={() => openDriveDialog(teamDocId)}
                    disabled={isSaving}
                    className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {currentDriveLink.trim()
                      ? "Edit Drive Link"
                      : "Add Drive Link"}
                  </button>

                  {currentDriveLink.trim() && (
                    <p className="text-[11px] text-white/70 truncate flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-green-300" />
                      Drive link added
                    </p>
                  )}

                  {statusMessage && (
                    <p
                      className={`text-xs ${isSuccess ? "text-green-200" : "text-red-200"}`}
                    >
                      {statusMessage}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeDriveDialogTeamId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
            onClick={closeDriveDialog}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md rounded-2xl border border-white/20 bg-goku-dark p-4 sm:p-5"
              onClick={(event) => event.stopPropagation()}
            >
              <h3 className="font-heading text-xl text-white">
                Add Drive Link
              </h3>
              <p className="mt-1 text-sm text-white/60">
                Enter team passkey to unlock Drive link editing.
              </p>

              <input
                type="password"
                value={dialogPasskey}
                onChange={(event) => {
                  setDialogPasskey(event.target.value);
                  if (dialogError) {
                    setDialogError("");
                  }
                  if (dialogPasskeyVerified) {
                    setDialogPasskeyVerified(false);
                  }
                }}
                placeholder="Enter team passkey"
                className="mt-4 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              />

              {!dialogPasskeyVerified && (
                <button
                  type="button"
                  onClick={verifyDialogPasskey}
                  className="mt-3 rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/25"
                >
                  Verify Passkey
                </button>
              )}

              {dialogPasskeyVerified && (
                <>
                  <p className="mt-4 text-xs text-green-200">
                    Passkey verified. You can add the drive link now.
                  </p>
                  <input
                    type="url"
                    value={driveLinkDraft}
                    onChange={(event) => setDriveLinkDraft(event.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/45 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  />
                </>
              )}

              {dialogError && (
                <p className="mt-3 text-xs text-red-200">{dialogError}</p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={saveDriveDialog}
                  disabled={!dialogPasskeyVerified}
                  className="rounded-xl bg-white/15 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-white/25"
                >
                  Save Link
                </button>
                <button
                  type="button"
                  onClick={closeDriveDialog}
                  className="rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-semibold text-white/80 transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SelectedTeams;
