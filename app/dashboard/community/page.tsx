"use client";

import { useCommunity } from "@/lib/useCommunity";
import { useAuth } from "@/lib/useAuth";
import PostCard from "@/components/PostCard";
import type { CommentAuthor } from "@/lib/useCommunity";

// ─── Sidebar widgets ─────────────────────────────────────────────────────────

function ActiveTeachersSidebar({ posts }: { posts: ReturnType<typeof useCommunity>["posts"] }) {
  // Aggregate post counts per teacher
  const byTeacher = posts.reduce<Record<string, { teacher: (typeof posts)[number]["teacher"]; count: number }>>(
    (acc, post) => {
      const { id } = post.teacher;
      if (!acc[id]) acc[id] = { teacher: post.teacher, count: 0 };
      acc[id].count++;
      return acc;
    },
    {}
  );

  const sorted = Object.values(byTeacher).sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Active Teachers</h3>
      <ul className="space-y-3" role="list">
        {sorted.map(({ teacher, count }) => (
          <li key={teacher.id} className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${teacher.colorClass}`}>
              {teacher.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{teacher.name}</p>
              <p className="text-xs text-gray-400">{count} post{count > 1 ? "s" : ""}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentActivitySidebar({ posts }: { posts: ReturnType<typeof useCommunity>["posts"] }) {
  // Collect the 5 most recent comments across all posts
  const recent = posts
    .flatMap((p) => p.comments.map((c) => ({ ...c, postTitle: p.text.slice(0, 40) })))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-bold text-gray-900 mb-4">Recent Activity</h3>
      <ul className="space-y-3" role="list">
        {recent.map((item) => (
          <li key={item.id} className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0 mt-1.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">{item.author.name}</span>
              {" commented on "}
              <span className="italic text-gray-500">&ldquo;{item.postTitle}…&rdquo;</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function CommunityPage() {
  const { posts, addComment } = useCommunity();
  const { user, loading } = useAuth();

  // Mock current user — in production: derived from JWT session
  const currentUser: CommentAuthor = {
    id: user?.id ?? "usr_demo",
    name: user?.name ?? "Demo Parent",
    role: "parent",
  };

  // Sort feed: newest first
  const feed = [...posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalComments = posts.reduce((acc, p) => acc + p.comments.length, 0);

  return (
    <div className="h-full overflow-y-auto">
      {/* Page header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Community</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {posts.length} posts · {totalComments} comments
            </p>
          </div>
          {/* Role badge */}
          {!loading && (
            <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {user?.name ?? "Guest"} · Parent
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex gap-6 items-start">

          {/* ── Feed (center) ── */}
          <div className="flex-1 min-w-0 space-y-5">
            {feed.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <p className="text-gray-500 font-medium">No posts yet</p>
                <p className="text-gray-400 text-sm mt-1">Teachers will share updates here soon.</p>
              </div>
            ) : (
              feed.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  // Fix: addComment expects { postId, text, author } but PostCard calls
                  // onAddComment(postId, text) — wrap to bridge the two signatures.
                  onAddComment={(postId, text) =>
                    addComment({ postId, text, author: currentUser })
                  }
                />
              ))
            )}
          </div>

          {/* ── Right sidebar ── */}
          <aside className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 shrink-0">
            <ActiveTeachersSidebar posts={posts} />
            <RecentActivitySidebar posts={posts} />

            {/* Community rules */}
            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-amber-900 mb-3">Community Guidelines</h3>
              <ul className="space-y-1.5">
                {[
                  "Be kind and respectful",
                  "Support each other's learning",
                  "Stay on topic",
                  "No spam or advertising",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2 text-xs text-amber-800">
                    <span className="text-amber-500 mt-0.5 shrink-0">✦</span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
