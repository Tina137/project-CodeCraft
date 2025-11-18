"use client";

import { useEffect, useState } from "react";
import AddStoryForm from "@/components/AddStoryForm/AddStoryForm";
import { getStoryById } from "@/lib/api/clientApi";

interface Props {
  params: { storyId: string };
}

export default function EditStoryPage({ params }: Props) {
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    getStoryById(params.storyId).then((data) => setStory(data));
  }, [params.storyId]);

  if (!story) return <p>Loading...</p>;

  return (
    <AddStoryForm
      initialData={{
        _id: story._id,
        img: story.img,
        title: story.title,
        article: story.article,
        category: story.category,
      }}
      isEdit={true}
    />
  );
}
