"use client";

import { useState, useRef } from "react";
import type { Post, Comment, CommentAuthor } from "@/lib/useCommunity";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1)    return "just now";
  if (mins < 60)   return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days === 1)  return "Yesterday";
  if (days < 7)    return `${days} days ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function formatText(text: string) {
  return text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      {i < text.split("\n").length - 1 && <br />}
    </span>
  ));
}

// ─── UserAvatar ──────────────────────────────────────────────────────────────

const ROLE_COLORS: Record<string, string> = {
  teacher: "bg-primary-100 text-primary-700",
  parent:  "bg-blue-100 text-blue-700",
  student: "bg-amber-100 text-amber-700",
};

function UserAvatar({
  name,
  role,
  size = "md",
}: {
  name: string;
  role: string;
  size?: "sm" | "md" | "lg";
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const sizeClass = size === "sm" ? "w-7 h-7 text-xs" : size === "lg" ? "w-11 h-11 text-base" : "w-9 h-9 text-sm";
  return (
    <div className={`${sizeClass} rounded-full font-bold flex items-center justify-center shrink-0 ${ROLE_COLORS[role] ?? "bg-gray-100 text-gray-500"}`}>
      {initials}
    </div>
  );
}

// ─── MediaRenderer ───────────────────────────────────────────────────────────

function ImagePlaceholder({ src }: { src: string }) {
  const isMock = src.startsWith("/mock");
  if (isMock) {
    return (
      <div className="w-full h-56 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-100 flex flex-col items-center justify-center gap-2">
        <svg className="w-10 h-10 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
        <p className="text-xs text-primary-400 font-medium">Image available in production</p>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="Post image" className="w-full rounded-xl object-cover max-h-80" />
  );
}

function VideoEmbed({ url }: { url: string }) {
  const isYouTube = url.includes("youtube.com/embed") || url.includes("youtu.be");
  if (isYouTube) {
    return (
      <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingBottom: "56.25%" }}>
        <iframe
          src={url}
          title="Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      </div>
    );
  }
  // Generic video placeholder
  return (
    <div className="w-full h-48 rounded-xl bg-gray-900 flex flex-col items-center justify-center gap-2">
      <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
      </svg>
      <p className="text-xs text-white/40">Video player</p>
    </div>
  );
}

function PDFAttachment({ fileName, fileUrl }: { fileName: string; fileUrl?: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-400">PDF document</p>
      </div>
      <a
        href={fileUrl ?? "#"}
        download={fileName}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors shrink-0"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Download
      </a>
    </div>
  );
}

function MediaRenderer({ post }: { post: Post }) {
  if (post.contentType === "image" && post.mediaUrl) {
    return <ImagePlaceholder src={post.mediaUrl} />;
  }
  if (post.contentType === "video" && post.mediaUrl) {
    return <VideoEmbed url={post.mediaUrl} />;
  }
  if (post.contentType === "pdf" && post.fileName) {
    return <PDFAttachment fileName={post.fileName} fileUrl={post.fileUrl} />;
  }
  return null;
}

// ─── CommentItem ─────────────────────────────────────────────────────────────

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-2.5">
      <UserAvatar name={comment.author.name} role={comment.author.role} size="sm" />
      <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-semibold text-gray-900">{comment.author.name}</span>
          <span className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{comment.text}</p>
      </div>
    </div>
  );
}

// ─── CommentForm ─────────────────────────────────────────────────────────────

function CommentForm({
  onSubmit,
  currentUser,
}: {
  onSubmit: (text: string) => void;
  currentUser: CommentAuthor;
}) {
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSubmit(text);
    setText("");
    textareaRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2.5 items-start">
      <UserAvatar name={currentUser.name} role={currentUser.role} size="sm" />
      <div className="flex-1 flex gap-2">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Add a comment… (Ctrl+Enter to send)"
          className="flex-1 px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-colors"
          style={{ minHeight: "38px" }}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-3 py-2 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          Post
        </button>
      </div>
    </form>
  );
}

// ─── PostCard ────────────────────────────────────────────────────────────────

const CONTENT_TYPE_BADGE: Record<string, { label: string; classes: string }> = {
  text:  { label: "Update",    classes: "bg-gray-100 text-gray-500"          },
  image: { label: "Photo",     classes: "bg-blue-50 text-blue-600"           },
  video: { label: "Video",     classes: "bg-purple-50 text-purple-600"       },
  pdf:   { label: "Worksheet", classes: "bg-red-50 text-red-600"             },
};

const INITIAL_COMMENTS_SHOWN = 3;

interface PostCardProps {
  post: Post;
  currentUser: CommentAuthor;
  onAddComment: (postId: string, text: string) => void;
}

export default function PostCard({ post, currentUser, onAddComment }: PostCardProps) {
  const [showAll, setShowAll] = useState(false);
  const badge = CONTENT_TYPE_BADGE[post.contentType];

  const visibleComments = showAll
    ? post.comments
    : post.comments.slice(-INITIAL_COMMENTS_SHOWN);
  const hiddenCount = post.comments.length - INITIAL_COMMENTS_SHOWN;

  return (
    <article className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* ── Post header ── */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full text-sm font-bold flex items-center justify-center shrink-0 ${post.teacher.colorClass}`}>
              {post.teacher.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.teacher.name}</p>
              <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
            </div>
          </div>
          {/* Content type badge */}
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${badge.classes}`}>
            {badge.label}
          </span>
        </div>

        {/* ── Post text ── */}
        <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">
          {formatText(post.text)}
        </p>

        {/* ── Tags ── */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full font-medium">
                #{tag.replace(/\s+/g, "")}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Media ── */}
      {post.contentType !== "text" && (
        <div className="px-5 pb-4">
          <MediaRenderer post={post} />
        </div>
      )}

      {/* ── Comments section ── */}
      <div className="border-t border-gray-50 px-5 pt-4 pb-5 space-y-3">
        {/* Comment count */}
        {post.comments.length > 0 && (
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            {post.comments.length} comment{post.comments.length > 1 ? "s" : ""}
          </p>
        )}

        {/* Show older comments toggle */}
        {!showAll && hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            View {hiddenCount} earlier comment{hiddenCount > 1 ? "s" : ""}
          </button>
        )}

        {/* Comment list */}
        <div className="space-y-2.5">
          {visibleComments.map((c) => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </div>

        {/* Empty state */}
        {post.comments.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-1">
            Be the first to comment.
          </p>
        )}

        {/* Comment form */}
        <div className="pt-1">
          <CommentForm
            currentUser={currentUser}
            onSubmit={(text) => onAddComment(post.id, text)}
          />
        </div>
      </div>
    </article>
  );
}
