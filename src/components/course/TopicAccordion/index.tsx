"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ITopicDetail } from "@/types";

interface ITopicAccordionProps {
  topics: ITopicDetail[];
  courseSlug: string;
  isEnrolled: boolean;
}

const TopicAccordion: React.FC<ITopicAccordionProps> = ({
  topics,
  courseSlug,
  isEnrolled,
}) => {
  const [openTopicId, setOpenTopicId] = useState<string | null>(
    topics.length > 0 ? topics[0].id : null
  );

  const toggle = (topicId: string) => {
    setOpenTopicId((prev) => (prev === topicId ? null : topicId));
  };

  if (topics.length === 0) {
    return (
      <p className="text-sm-text text-dark-gray py-4">
        No content has been added to this course yet.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {topics.map((topic, topicIndex) => {
        const isOpen = openTopicId === topic.id;
        return (
          <div
            key={topic.id}
            className="border border-light-gray rounded-lg overflow-hidden"
          >
            <button
              type="button"
              onClick={() => toggle(topic.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-light transition-colors text-left"
            >
              <span className="text-sm-text font-semibold text-dark">
                {topicIndex + 1}. {topic.title}
              </span>
              <span className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-dark-gray">
                  {topic.subtopics.length}{" "}
                  {topic.subtopics.length === 1 ? "lesson" : "lessons"}
                </span>
                <svg
                  className={`w-4 h-4 text-dark-gray transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>

            {isOpen && topic.subtopics.length > 0 && (
              <div className="border-t border-light-gray bg-light/50">
                {topic.subtopics.map((subtopic, subIndex) => (
                  <div
                    key={subtopic.id}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-light-gray last:border-b-0"
                  >
                    <span className="text-sm-text text-dark-gray">
                      {topicIndex + 1}.{subIndex + 1} {subtopic.title}
                    </span>
                    {isEnrolled ? (
                      <Link
                        href={`/courses/${courseSlug}/learn/${subtopic.id}`}
                        className="text-xs text-primary font-medium hover:underline flex-shrink-0 ml-2"
                      >
                        Read
                      </Link>
                    ) : (
                      <span className="text-xs text-gray flex-shrink-0 ml-2">
                        Locked
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TopicAccordion;
