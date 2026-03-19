"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TipTapEditor from "@/components/course/TipTapEditor";
import Button from "@/components/common/Button";
import { useAutoSave, TAutoSaveStatus } from "@/hooks/useAutoSave";
import {
  getCourseDetail,
  createTopic,
  updateTopic,
  deleteTopic,
  createSubtopic,
  updateSubtopic,
  deleteSubtopic,
  uploadImage,
} from "@/services/teacherCourseService";
import { ICourseTeacherDetail, ITopicTeacherDetail } from "@/types";
import type { JSONContent } from "@tiptap/react";

interface ICourseContentProps {
  courseId: string;
}

function SaveStatusIndicator({ status }: { status: TAutoSaveStatus }) {
  if (status === "idle") return null;
  const text =
    status === "saving"
      ? "Saving..."
      : status === "saved"
        ? "All changes saved"
        : "Save failed";
  const color = status === "error" ? "text-red-600" : "text-dark-gray";
  return <span className={`text-xs ${color} flex-shrink-0`}>{text}</span>;
}

const CourseContent: React.FC<ICourseContentProps> = ({ courseId }) => {
  const router = useRouter();
  const [course, setCourse] = useState<ICourseTeacherDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Currently selected subtopic
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);

  // Topic/subtopic creation states
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [addingSubtopicForTopic, setAddingSubtopicForTopic] = useState<string | null>(null);
  const [newSubtopicTitle, setNewSubtopicTitle] = useState("");

  // Editing states
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editingSubtopicId, setEditingSubtopicId] = useState<string | null>(null);
  const [editSubtopicTitle, setEditSubtopicTitle] = useState("");

  // ─── Auto-save for content ────────────────────────────────────────────────────

  const contentSaveHandler = useCallback(
    async (value: unknown) => {
      if (!activeSubtopicId) return;
      const content = value as Record<string, unknown>;
      await updateSubtopic(activeSubtopicId, { content });
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          topics: prev.topics.map((t) => ({
            ...t,
            subtopics: t.subtopics.map((s) =>
              s.id === activeSubtopicId ? { ...s, content } : s
            ),
          })),
        };
      });
    },
    [activeSubtopicId]
  );

  const { trigger: triggerContentSave, status: contentSaveStatus } = useAutoSave({
    onSave: contentSaveHandler,
    delay: 1000,
  });

  // ─── Image upload handler ─────────────────────────────────────────────────────

  const handleImageUpload = useCallback(async (file: File): Promise<string> => {
    const result = await uploadImage(file, "course-content");
    return result.url;
  }, []);

  // ─── Load course ──────────────────────────────────────────────────────────────

  const loadCourse = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getCourseDetail(courseId);
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load course.");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // Find the active subtopic data
  const activeSubtopic = course?.topics
    .flatMap((t) => t.subtopics)
    .find((s) => s.id === activeSubtopicId) || null;

  // ─── Topic CRUD ──────────────────────────────────────────────────────────────

  const handleAddTopic = async () => {
    if (!newTopicTitle.trim()) return;
    try {
      const created = await createTopic(courseId, { title: newTopicTitle.trim() });
      setCourse((prev) => {
        if (!prev) return prev;
        const newTopic: ITopicTeacherDetail = {
          id: created.id,
          title: created.title,
          order: created.order,
          subtopics: [],
        };
        return { ...prev, topics: [...prev.topics, newTopic] };
      });
      setNewTopicTitle("");
      setIsAddingTopic(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add topic.");
    }
  };

  const handleUpdateTopic = async (topicId: string) => {
    if (!editTopicTitle.trim()) return;
    try {
      const updated = await updateTopic(topicId, { title: editTopicTitle.trim() });
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          topics: prev.topics.map((t) =>
            t.id === topicId ? { ...t, title: updated.title } : t
          ),
        };
      });
      setEditingTopicId(null);
      setEditTopicTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update topic.");
    }
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!window.confirm("Delete this topic and all its subtopics?")) return;
    try {
      await deleteTopic(topicId);
      setCourse((prev) => {
        if (!prev) return prev;
        return { ...prev, topics: prev.topics.filter((t) => t.id !== topicId) };
      });
      const topic = course?.topics.find((t) => t.id === topicId);
      if (topic?.subtopics.some((s) => s.id === activeSubtopicId)) {
        setActiveSubtopicId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete topic.");
    }
  };

  // ─── Subtopic CRUD ────────────────────────────────────────────────────────────

  const handleAddSubtopic = async (topicId: string) => {
    if (!newSubtopicTitle.trim()) return;
    try {
      const created = await createSubtopic(topicId, { title: newSubtopicTitle.trim() });
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          topics: prev.topics.map((t) =>
            t.id === topicId
              ? { ...t, subtopics: [...t.subtopics, created] }
              : t
          ),
        };
      });
      setNewSubtopicTitle("");
      setAddingSubtopicForTopic(null);
      setActiveSubtopicId(created.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add subtopic.");
    }
  };

  const handleUpdateSubtopicTitle = async (subtopicId: string) => {
    if (!editSubtopicTitle.trim()) return;
    try {
      const updated = await updateSubtopic(subtopicId, { title: editSubtopicTitle.trim() });
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          topics: prev.topics.map((t) => ({
            ...t,
            subtopics: t.subtopics.map((s) =>
              s.id === subtopicId ? { ...s, title: updated.title } : s
            ),
          })),
        };
      });
      setEditingSubtopicId(null);
      setEditSubtopicTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subtopic.");
    }
  };

  const handleDeleteSubtopic = async (subtopicId: string) => {
    if (!window.confirm("Delete this subtopic?")) return;
    try {
      await deleteSubtopic(subtopicId);
      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          topics: prev.topics.map((t) => ({
            ...t,
            subtopics: t.subtopics.filter((s) => s.id !== subtopicId),
          })),
        };
      });
      if (activeSubtopicId === subtopicId) {
        setActiveSubtopicId(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete subtopic.");
    }
  };

  // ─── Content update handler (triggers auto-save) ──────────────────────────────

  const handleContentUpdate = useCallback(
    (content: JSONContent) => {
      triggerContentSave(content);
    },
    [triggerContentSave]
  );

  // ─── Render ───────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="text-center py-12 text-dark-gray text-sm-text">
        Loading course content...
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm-text">
        {error}
      </div>
    );
  }

  if (!course) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-h3 font-bold text-dark">Course Content</h1>
          <p className="text-sm-text text-dark-gray mt-1">{course.title}</p>
        </div>
        <div className="flex gap-2 self-start">
          <Link
            href={`/teacher/courses/${courseId}`}
            className="inline-flex items-center px-4 py-2 text-sm-text font-medium rounded-lg border border-light-gray text-dark-gray hover:bg-light transition-colors"
          >
            Edit Details
          </Link>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => router.push("/teacher/courses")}
          >
            Back to Courses
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm-text">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Sidebar: Topic tree ────────────────────────────────────────── */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl border border-light-gray p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-body font-semibold text-dark">Topics</h2>
              <button
                type="button"
                onClick={() => setIsAddingTopic(true)}
                className="text-primary text-sm-text font-medium hover:underline"
              >
                + Add Topic
              </button>
            </div>

            {course.topics.length === 0 && !isAddingTopic && (
              <p className="text-sm-text text-dark-gray text-center py-4">
                No topics yet. Add your first topic to get started.
              </p>
            )}

            <div className="space-y-3">
              {course.topics.map((topic) => (
                <div key={topic.id}>
                  {/* Topic header */}
                  <div className="flex items-center gap-2 group">
                    {editingTopicId === topic.id ? (
                      <div className="flex-1 flex gap-1">
                        <input
                          type="text"
                          value={editTopicTitle}
                          onChange={(e) => setEditTopicTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateTopic(topic.id);
                            if (e.key === "Escape") setEditingTopicId(null);
                          }}
                          className="flex-1 text-sm-text border border-light-gray rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateTopic(topic.id)}
                          className="text-xs text-primary font-medium px-1"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="flex-1 text-sm-text font-semibold text-dark truncate">
                          {topic.title}
                        </h3>
                        <div className="hidden group-hover:flex gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTopicId(topic.id);
                              setEditTopicTitle(topic.title);
                            }}
                            className="text-xs text-dark-gray hover:text-primary"
                            title="Edit topic"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteTopic(topic.id)}
                            className="text-xs text-dark-gray hover:text-red-600"
                            title="Delete topic"
                          >
                            Del
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Subtopics */}
                  <div className="ml-3 mt-1 space-y-1">
                    {topic.subtopics.map((subtopic) => (
                      <div key={subtopic.id} className="flex items-center gap-1 group/sub">
                        {editingSubtopicId === subtopic.id ? (
                          <div className="flex-1 flex gap-1">
                            <input
                              type="text"
                              value={editSubtopicTitle}
                              onChange={(e) => setEditSubtopicTitle(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleUpdateSubtopicTitle(subtopic.id);
                                if (e.key === "Escape") setEditingSubtopicId(null);
                              }}
                              className="flex-1 text-xs border border-light-gray rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleUpdateSubtopicTitle(subtopic.id)}
                              className="text-xs text-primary font-medium px-1"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => setActiveSubtopicId(subtopic.id)}
                              className={`flex-1 text-left text-sm-text px-2 py-1.5 rounded transition-colors truncate ${
                                activeSubtopicId === subtopic.id
                                  ? "bg-primary-light text-primary font-medium"
                                  : "text-dark-gray hover:bg-light"
                              }`}
                            >
                              {subtopic.title}
                            </button>
                            <div className="hidden group-hover/sub:flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingSubtopicId(subtopic.id);
                                  setEditSubtopicTitle(subtopic.title);
                                }}
                                className="text-xs text-dark-gray hover:text-primary"
                                title="Edit subtopic"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubtopic(subtopic.id)}
                                className="text-xs text-dark-gray hover:text-red-600"
                                title="Delete subtopic"
                              >
                                Del
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}

                    {/* Add subtopic inline */}
                    {addingSubtopicForTopic === topic.id ? (
                      <div className="flex gap-1 mt-1">
                        <input
                          type="text"
                          value={newSubtopicTitle}
                          onChange={(e) => setNewSubtopicTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddSubtopic(topic.id);
                            if (e.key === "Escape") setAddingSubtopicForTopic(null);
                          }}
                          placeholder="Subtopic title..."
                          className="flex-1 text-xs border border-light-gray rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleAddSubtopic(topic.id)}
                          className="text-xs text-primary font-medium px-1"
                        >
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setAddingSubtopicForTopic(topic.id);
                          setNewSubtopicTitle("");
                        }}
                        className="text-xs text-primary hover:underline mt-1 ml-2"
                      >
                        + Add Subtopic
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add topic inline */}
            {isAddingTopic && (
              <div className="flex gap-1 mt-3">
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTopic();
                    if (e.key === "Escape") setIsAddingTopic(false);
                  }}
                  placeholder="Topic title..."
                  className="flex-1 text-sm-text border border-light-gray rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="text-sm-text text-primary font-medium px-2"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ─── Main: Editor pane ──────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {activeSubtopic ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-body font-semibold text-dark truncate">
                  {activeSubtopic.title}
                </h2>
                <SaveStatusIndicator status={contentSaveStatus} />
              </div>
              <TipTapEditor
                key={activeSubtopicId}
                content={activeSubtopic.content as JSONContent | null}
                onUpdate={handleContentUpdate}
                onImageUpload={handleImageUpload}
              />
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-light-gray">
              <p className="text-dark-gray text-body mb-2">
                Select a subtopic to start editing
              </p>
              <p className="text-sm-text text-gray">
                {course.topics.length === 0
                  ? "Create a topic first, then add subtopics to write content."
                  : "Click on a subtopic from the sidebar to open the editor."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
