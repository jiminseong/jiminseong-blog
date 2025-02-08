import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {
  name: string;
  profileImage: string;
  githubUrl: string;
};

export function Profile({ name, profileImage, githubUrl }: Props) {
  const text = "</Github>";
  return (
    <div className="flex flex-col w-full gap-4 mb-4 items-center ">
      <div className="rounded-full w-[100px] h-[100px] relative overflow-hidden">
        <Image fill alt={name} src={profileImage} className="object-cover" />
      </div>
      <p>Developer Jiminseong.</p>
      <Link href={githubUrl}>{text}</Link>
    </div>
  );
}
