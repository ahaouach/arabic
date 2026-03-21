"use client";

import { useState, useEffect, useCallback } from "react";

// ---- Types -----------------------------------------------------------------

export type ContentType = "text" | "image" | "video" | "pdf";
export type UserRole = "parent" | "student" | "teacher";

export interface CommentAuthor {
  id: string;
  name: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  teacher: {
    id: string;
    name: string;
    initials: string;
    colorClass: string;
  };
  contentType: ContentType;
  text: string;
  mediaUrl?: string;
  fileName?: string;
  fileUrl?: string;
  tags: string[];
  createdAt: string;
  comments: Comment[];
}

export interface AddCommentInput {
  postId: string;
  text: string;
  author: CommentAuthor;
}

// ---- Hook ------------------------------------------------------------------

export interface UseCommunityReturn {
  posts: Post[];
  addComment: (input: AddCommentInput) => Promise<void>;
}

export function useCommunity(): UseCommunityReturn {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = useCallback(() => {
    fetch("/api/community/posts", { credentials: "same-origin" })
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  async function addComment(input: AddCommentInput): Promise<void> {
    const res = await fetch(`/api/community/posts/${input.postId}/comments`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input.text }),
    });

    if (res.ok) {
      const { comment } = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === input.postId
            ? { ...p, comments: [...p.comments, comment] }
            : p
        )
      );
    }
  }

  return { posts, addComment };
}
