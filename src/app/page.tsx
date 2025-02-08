import Container from "@/app/_components/container";
import { HeroPost } from "@/app/_components/hero-post";
import { Intro } from "@/app/_components/intro";
import { MoreStories } from "@/app/_components/more-stories";
import { getAllPosts } from "@/lib/api";
import { Profile } from "./_components/profile";

export default function Index() {
  const allPosts = getAllPosts();

  const heroPost = allPosts[0];

  const morePosts = allPosts.slice(1);

  return (
    <main>
      <Container>
        <Intro />

        <HeroPost
          title={heroPost.title}
          coverImage={heroPost.coverImage}
          date={heroPost.date}
          slug={heroPost.slug}
          excerpt={heroPost.excerpt}
        />

        {morePosts.length > 0 && <MoreStories posts={morePosts} />}
      </Container>
      <Profile
        name="지민성"
        githubUrl="https://github.com/jiminseong"
        profileImage="/assets/blog/author/profile.png"
      />
    </main>
  );
}
