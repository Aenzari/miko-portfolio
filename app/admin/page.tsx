"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  SiteConfigState,
  DEFAULT_SITE_CONFIG,
} from "@/components/providers/SiteDataProvider";
import { Logo } from "@/components/Logo";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  tagline: string;
  stack: string[];
  demo_url?: string;
  repo_url?: string;
  featured: boolean;
  db_heavy: boolean;
  display_order: number;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "config" | "projects" | "inquiries"
  >("config");

  // Dashboard Data
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [config, setConfig] = useState<SiteConfigState>(DEFAULT_SITE_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");

  // Avatar upload state
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resume PDF upload state
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeMsg, setResumeMsg] = useState("");
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Project Editor State
  const [editingProject, setEditingProject] =
    useState<Partial<ProjectItem> | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setInquiries(data.inquiries || []);
      setProjects(data.projects || []);
      if (data.config) setConfig((prev) => ({ ...prev, ...data.config }));
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setLoginError("Invalid admin master key.");
        return;
      }
      setIsAuthenticated(true);
      loadData();
    } catch {
      setLoginError("Authentication failed.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    setIsAuthenticated(false);
  };

  // Inquiry Actions
  const toggleInquiryRead = async (id: string, current: boolean) => {
    await fetch("/api/admin/inquiries", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_read: !current }),
    });
    setInquiries(
      inquiries.map((inq) =>
        inq.id === id ? { ...inq, is_read: !current } : inq,
      ),
    );
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm("Permanently delete this inquiry?")) return;
    await fetch(`/api/admin/inquiries?id=${id}`, { method: "DELETE" });
    setInquiries(inquiries.filter((inq) => inq.id !== id));
  };

  // Avatar Actions
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarLoading(true);
    setAvatarMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.avatar_url) {
        setConfig((prev) => ({ ...prev, avatar_url: data.avatar_url }));
        setAvatarMsg("Profile photo updated successfully!");
      } else {
        setAvatarMsg(data.error || "Failed to upload image");
      }
    } catch {
      setAvatarMsg("Upload failed");
    } finally {
      setAvatarLoading(false);
      setTimeout(() => setAvatarMsg(""), 3000);
    }
  };

  const handleDeleteAvatar = async () => {
    if (
      !confirm(
        "Remove profile photo? It will revert to the geometric avatar monogram.",
      )
    )
      return;
    setAvatarLoading(true);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete" }),
      });
      if (res.ok) {
        setConfig((prev) => ({ ...prev, avatar_url: "" }));
        setAvatarMsg("Profile photo removed.");
      }
    } catch {
      setAvatarMsg("Failed to remove photo");
    } finally {
      setAvatarLoading(false);
      setTimeout(() => setAvatarMsg(""), 3000);
    }
  };

  // Resume PDF Actions
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setResumeLoading(true);
    setResumeMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.resume_url) {
        setConfig((prev) => ({ ...prev, resume_url: data.resume_url }));
        setResumeMsg("Resume PDF uploaded and updated across site!");
      } else {
        setResumeMsg(data.error || "Failed to upload PDF");
      }
    } catch {
      setResumeMsg("Upload failed");
    } finally {
      setResumeLoading(false);
      setTimeout(() => setResumeMsg(""), 3500);
    }
  };

  const handleResetResume = async () => {
    if (!confirm("Reset resume path to default (/resume.pdf)?")) return;
    setResumeLoading(true);
    try {
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (res.ok) {
        setConfig((prev) => ({ ...prev, resume_url: "/resume.pdf" }));
        setResumeMsg("Reset to default /resume.pdf");
      }
    } catch {
      setResumeMsg("Failed to reset");
    } finally {
      setResumeLoading(false);
      setTimeout(() => setResumeMsg(""), 3000);
    }
  };

  // Project Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject?.name || !editingProject.tagline) return;

    const method = editingProject.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...editingProject,
        slug:
          editingProject.slug ||
          editingProject.name.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        stack: Array.isArray(editingProject.stack)
          ? editingProject.stack
          : ((editingProject.stack as unknown as string) || "")
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
      }),
    });

    if (res.ok) {
      setEditingProject(null);
      loadData();
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Delete this project from portfolio?")) return;
    await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
    setProjects(projects.filter((p) => p.id !== id && p.slug !== id));
  };

  const handleResetProjects = async () => {
    if (
      !confirm(
        "Reset all projects back to the 10 pre-loaded flagship systems? Any custom added projects will be reset.",
      )
    )
      return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_defaults" }),
      });
      const data = await res.json();
      if (res.ok && data.projects) {
        setProjects(data.projects);
        alert("All 10 flagship projects restored successfully!");
      }
    } catch {
      alert("Failed to reset projects");
    } finally {
      setLoading(false);
    }
  };

  // Config Action
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus("Saving...");
    const res = await fetch("/api/admin/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });

    if (res.ok) {
      setSaveStatus("Live updates published across portfolio!");
      setTimeout(() => setSaveStatus(""), 2500);
    } else {
      setSaveStatus("Failed to save.");
    }
  };

  if (isAuthenticated === false) {
    return (
      <main className="min-h-screen bg-[#07090E] text-white flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 rounded-2xl glass glow-border border border-white/10 space-y-6">
          <div className="text-center flex flex-col items-center">
            <Logo size={42} showSubtitle={false} />
            <h1 className="text-lg font-mono font-bold mt-4 text-white">
              Admin Command Center
            </h1>
            <p className="text-xs text-gray-400 mt-1 font-mono">
              Single source of truth for Michael Angelou Quinit.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-gray-400 mb-1">
                Master Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password ..."
                className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-accent font-mono"
              />
            </div>

            {loginError && (
              <div className="text-xs text-red-400 font-mono">{loginError}</div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-xl text-xs font-mono font-bold transition-all shadow-lg shadow-accent/20"
            >
              Authenticate &rarr;
            </button>
          </form>
        </div>
      </main>
    );
  }

  if (isAuthenticated === null || loading) {
    return (
      <main className="min-h-screen bg-[#07090E] text-white flex items-center justify-center font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-accent animate-ping" />
          <span>Synchronizing Portfolio Admin State...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07090E] text-white p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3">
              <Logo size={36} />
              <span className="px-2.5 py-0.5 rounded bg-accent/15 border border-accent/30 text-accent font-mono text-xs">
                Admin Control Room
              </span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-1">
              Changes made here immediately update the live public portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-gray-300 transition-colors flex items-center gap-1.5"
            >
              <span>View Live Portfolio</span>
              <span>&rarr;</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white text-xs font-mono transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="flex items-center gap-2 border-b border-white/[0.06] pb-2 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab("config")}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "config"
                ? "bg-accent text-white font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Profile, Photo &amp; Brand
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-accent text-white font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects CMS ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab("inquiries")}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
              activeTab === "inquiries"
                ? "bg-accent text-white font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>Inquiries Inbox</span>
            {inquiries.filter((i) => !i.is_read).length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                {inquiries.filter((i) => !i.is_read).length}
              </span>
            )}
          </button>
        </div>

        {activeTab === "config" && (
          <section className="max-w-4xl space-y-6">
            {/* AVATAR / PROFILE PHOTO MANAGER */}
            <div className="p-6 rounded-2xl glass border border-accent/20 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-mono font-bold text-accent uppercase tracking-wider">
                    Developer Portrait &amp; Avatar
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">
                    Your photo renders in the Hero section and Recruiter Dossier
                    with luxury framing.
                  </p>
                </div>
                {avatarMsg && (
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {avatarMsg}
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 pt-2">
                {/* Photo Preview Frame */}
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-navy-900 border-2 border-accent/40 shadow-xl flex items-center justify-center relative">
                    {config.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={config.avatar_url}
                        alt="Miko Quinit Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-accent">
                        <span className="font-display font-bold text-2xl">
                          MQ
                        </span>
                        <span className="text-[9px] font-mono text-gray-400">
                          NO PHOTO
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-navy-950" />
                </div>

                {/* Upload & Management Controls */}
                <div className="space-y-3 flex-1 w-full">
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={avatarLoading}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark text-white text-xs font-mono font-bold transition-all disabled:opacity-50"
                    >
                      {avatarLoading
                        ? "Uploading..."
                        : "Upload New Photo (PNG / JPG / WebP)"}
                    </button>

                    {config.avatar_url && (
                      <button
                        type="button"
                        onClick={handleDeleteAvatar}
                        disabled={avatarLoading}
                        className="px-3.5 py-2 rounded-xl bg-red-500/15 hover:bg-red-500 text-red-300 hover:text-white text-xs font-mono transition-colors"
                      >
                        Delete Photo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-gray-500">
                      Or Image URL:
                    </span>
                    <input
                      type="text"
                      value={config.avatar_url || ""}
                      onChange={(e) =>
                        setConfig({ ...config, avatar_url: e.target.value })
                      }
                      placeholder="https://.../photo.jpg"
                      className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BRANDING CONFIGURATION */}
            <form
              onSubmit={handleSaveConfig}
              className="p-6 rounded-2xl glass border border-white/10 space-y-6"
            >
              <div className="border-b border-white/10 pb-4">
                <h3 className="text-sm font-mono font-bold text-accent uppercase tracking-wider">
                  Developer Brand &amp; Identity
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Custom brand moniker displayed across the navigation and
                  footer.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Brand Name / Moniker
                    </label>
                    <input
                      type="text"
                      value={config.brand_name || "//MAYK"}
                      onChange={(e) =>
                        setConfig({ ...config, brand_name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                      placeholder="//MAYK"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Brand Subtitle
                    </label>
                    <input
                      type="text"
                      value={config.brand_subtitle || "SYSTEMS ARCHITECT"}
                      onChange={(e) =>
                        setConfig({ ...config, brand_subtitle: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                      placeholder="SYSTEMS ARCHITECT"
                    />
                  </div>
                </div>
              </div>

              {/* PERSONAL INFO */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono text-accent uppercase tracking-wider">
                  Personal Bio &amp; Location
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={config.first_name}
                      onChange={(e) =>
                        setConfig({ ...config, first_name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={config.last_name}
                      onChange={(e) =>
                        setConfig({ ...config, last_name: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Nickname / Handle
                    </label>
                    <input
                      type="text"
                      value={config.nickname}
                      onChange={(e) =>
                        setConfig({ ...config, nickname: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Primary Email (Gmail)
                    </label>
                    <input
                      type="email"
                      required
                      value={config.email}
                      onChange={(e) =>
                        setConfig({ ...config, email: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={config.city}
                      onChange={(e) =>
                        setConfig({ ...config, city: e.target.value })
                      }
                      className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) =>
                      setConfig({ ...config, title: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Education / Specialization Subtitle
                  </label>
                  <input
                    type="text"
                    value={config.specialization}
                    onChange={(e) =>
                      setConfig({ ...config, specialization: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Status Badge Text
                  </label>
                  <input
                    type="text"
                    value={config.status_pill}
                    onChange={(e) =>
                      setConfig({ ...config, status_pill: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Hook Statement (Hero Section)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hook}
                    onChange={(e) =>
                      setConfig({ ...config, hook: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Mission Bio &amp; About Narrative (Profile Section)
                  </label>
                  <textarea
                    rows={4}
                    value={config.bio || ""}
                    onChange={(e) =>
                      setConfig({ ...config, bio: e.target.value })
                    }
                    placeholder="Enter detailed background, academic major, and engineering philosophy..."
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Telemetry Coordinates &amp; Base
                  </label>
                  <input
                    type="text"
                    value={
                      config.coordinates ||
                      "8.2280° N, 124.2452° E · ILIGAN CITY"
                    }
                    onChange={(e) =>
                      setConfig({ ...config, coordinates: e.target.value })
                    }
                    className="w-full px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* SOCIAL LINKS */}
              <div className="pt-4 border-t border-white/10 space-y-4">
                <h3 className="text-xs font-mono text-accent uppercase tracking-wider">
                  Social Links &amp; Profiles
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      value={config.github_url}
                      onChange={(e) =>
                        setConfig({ ...config, github_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={config.linkedin_url}
                      onChange={(e) =>
                        setConfig({ ...config, linkedin_url: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    OnlineJobs.ph Profile URL
                  </label>
                  <input
                    type="url"
                    value={config.onlinejobs_url}
                    onChange={(e) =>
                      setConfig({ ...config, onlinejobs_url: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>

              {/* DEDICATED RESUME PDF DOCUMENT UPLOAD CARD */}
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-mono text-accent uppercase tracking-wider">
                      Curriculum Vitae / Resume File (PDF)
                    </h3>
                    <p className="text-[11px] font-mono text-gray-400 mt-0.5">
                      Upload your official PDF resume for direct recruiter
                      downloads and quick-view inspection.
                    </p>
                  </div>
                  {resumeMsg && (
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {resumeMsg}
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs font-mono font-bold text-white flex items-center gap-2">
                        <span>Current File:</span>
                        <code className="text-accent text-[11px] bg-white/[0.04] px-2 py-0.5 rounded">
                          {config.resume_url || "/resume.pdf"}
                        </code>
                      </div>
                      <div className="text-[11px] font-mono text-gray-400">
                        Direct download enabled for ATS scanners &amp;
                        recruiters
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      type="file"
                      ref={resumeInputRef}
                      onChange={handleResumeUpload}
                      accept="application/pdf,.pdf"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={resumeLoading}
                      onClick={() => resumeInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark text-white text-xs font-mono font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-accent/20"
                    >
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                      <span>
                        {resumeLoading ? "Uploading PDF..." : "Upload PDF"}
                      </span>
                    </button>

                    <a
                      href={config.resume_url || "/resume.pdf"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-mono text-gray-300 hover:text-white transition-colors"
                    >
                      Preview PDF
                    </a>

                    <button
                      type="button"
                      onClick={handleResetResume}
                      disabled={resumeLoading}
                      className="px-3 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-mono text-red-400 transition-colors"
                    >
                      Reset Default
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-gray-500">
                    Or Manual Resume URL:
                  </span>
                  <input
                    type="text"
                    value={config.resume_url || ""}
                    onChange={(e) =>
                      setConfig({ ...config, resume_url: e.target.value })
                    }
                    placeholder="/uploads/resume.pdf"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-3">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-white text-xs font-mono font-bold shadow-lg shadow-accent/20 transition-all"
                >
                  Save &amp; Update Portfolio Live &rarr;
                </button>
                {saveStatus && (
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {saveStatus}
                  </span>
                )}
              </div>
            </form>
          </section>
        )}

        {activeTab === "projects" && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-display font-bold">
                  Projects CMS ({projects.length})
                </h2>
                <p className="text-xs font-mono text-gray-400">
                  All flagship projects are preloaded. You can edit, delete, add
                  new ones, or reset anytime.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetProjects}
                  className="px-3.5 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white text-xs font-mono transition-colors"
                >
                  Restore 10 Flagship Defaults
                </button>
                <button
                  onClick={() =>
                    setEditingProject({
                      name: "",
                      category: "Full-Stack",
                      tagline: "",
                      stack: [],
                      featured: false,
                      db_heavy: false,
                      display_order: projects.length + 1,
                    })
                  }
                  className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white text-xs font-mono font-bold transition-all shadow-md shadow-accent/20"
                >
                  + Add Project
                </button>
              </div>
            </div>

            {editingProject && (
              <form
                onSubmit={handleSaveProject}
                className="p-6 rounded-2xl glass glow-border border border-accent/40 space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <h3 className="text-sm font-mono font-bold text-accent">
                    {editingProject.id
                      ? `Edit Project: ${editingProject.name}`
                      : "Create New Project"}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="text-xs font-mono text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.name || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={editingProject.category || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          category: e.target.value,
                        })
                      }
                      placeholder="e.g. Marketplace, Data Visualization, Real-Time"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-gray-400 mb-1">
                    Tagline / Problem Solved *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={editingProject.tagline || ""}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        tagline: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Tech Stack (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(editingProject.stack)
                          ? editingProject.stack.join(", ")
                          : (editingProject.stack as unknown as string) || ""
                      }
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          stack: e.target.value.split(",").map((s) => s.trim()),
                        })
                      }
                      placeholder="React, Next.js, PostgreSQL"
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      Live Demo URL
                    </label>
                    <input
                      type="url"
                      value={editingProject.demo_url || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          demo_url: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-gray-400 mb-1">
                      GitHub Repo URL
                    </label>
                    <input
                      type="url"
                      value={editingProject.repo_url || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          repo_url: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/10 text-xs font-mono text-white"
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-5">
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProject.featured)}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            featured: e.target.checked,
                          })
                        }
                      />
                      <span>Featured (2-col span)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs font-mono cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProject.db_heavy)}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            db_heavy: e.target.checked,
                          })
                        }
                      />
                      <span>Database-Heavy Badge</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent-dark text-white text-xs font-mono font-bold"
                >
                  Save Project Live &rarr;
                </button>
              </form>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl glass border border-white/[0.06] flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-accent font-semibold">
                        {proj.category}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        {proj.featured && (
                          <span className="text-emerald-400 font-bold">
                            Featured
                          </span>
                        )}
                        {proj.db_heavy && (
                          <span className="text-cyan-400 font-bold">
                            DB-Heavy
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-white font-display">
                      {proj.name}
                    </h3>
                    <p className="text-xs text-gray-400 font-light mt-1 mb-3 line-clamp-2">
                      {proj.tagline}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {proj.stack.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-gray-300"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs font-mono">
                    <button
                      onClick={() => setEditingProject(proj)}
                      className="text-gray-300 hover:text-accent transition-colors"
                    >
                      Edit Project &rarr;
                    </button>
                    <button
                      onClick={() => deleteProject(proj.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "inquiries" && (
          <section className="space-y-4">
            <h2 className="text-lg font-display font-bold">
              Client &amp; Recruiter Inquiries ({inquiries.length})
            </h2>
            {inquiries.length === 0 ? (
              <div className="p-8 text-center glass rounded-2xl font-mono text-xs text-gray-400">
                No inquiries received yet. Any messages sent from the Contact
                form appear here immediately.
              </div>
            ) : (
              <div className="space-y-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`p-5 rounded-2xl glass border transition-all ${
                      inq.is_read
                        ? "border-white/[0.06] opacity-75"
                        : "border-accent/40 bg-accent/[0.02]"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-white">
                          {inq.name}
                        </span>
                        {inq.company && (
                          <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono text-gray-400">
                            {inq.company}
                          </span>
                        )}
                        {!inq.is_read && (
                          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-gray-500">
                        {new Date(inq.created_at).toLocaleString("en-US", {
                          timeZone: "Asia/Manila",
                        })}
                      </span>
                    </div>

                    <a
                      href={`mailto:${inq.email}?subject=Re: Inquiry&body=Hi ${inq.name.split(" ")[0]},%0D%0A%0D%0AThanks for reaching out!`}
                      className="text-xs font-mono text-accent hover:underline block mb-3"
                    >
                      {inq.email}
                    </a>

                    <p className="text-xs text-gray-300 leading-relaxed font-body bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
                      {inq.message}
                    </p>

                    <div className="flex items-center justify-end gap-4 mt-3 text-xs font-mono">
                      <button
                        onClick={() => toggleInquiryRead(inq.id, inq.is_read)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        Mark as {inq.is_read ? "Unread" : "Read"}
                      </button>
                      <button
                        onClick={() => deleteInquiry(inq.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
