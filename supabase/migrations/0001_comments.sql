-- Supabase 댓글 시스템: 테이블, 트리거, RLS 정책

-- 댓글 테이블
create table if not exists public.comments (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null,
  user_id           uuid references auth.users(id) on delete set null,
  author_name       text,
  author_avatar_url text,
  body              text not null,
  honeypot          text default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint body_length check (char_length(body) between 1 and 2000),
  constraint name_length check (
    author_name is null or char_length(author_name) between 1 and 40
  )
);

create index if not exists comments_slug_created_at_idx
  on public.comments (slug, created_at asc);

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists comments_touch_updated_at on public.comments;
create trigger comments_touch_updated_at
  before update on public.comments
  for each row execute function public.touch_updated_at();

-- 인증 유저 댓글의 작가 메타데이터를 서버 측에서 강제 설정 (임포스니지 방지)
create or replace function public.set_comment_author_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb;
  user_email text;
begin
  if new.user_id is not null then
    select raw_user_meta_data, email
      into meta, user_email
    from auth.users
    where id = new.user_id;

    new.author_name := coalesce(
      meta->>'full_name',
      meta->>'name',
      meta->>'user_name',
      meta->>'preferred_username',
      split_part(user_email, '@', 1),
      '사용자'
    );
    new.author_avatar_url := meta->>'avatar_url';
  end if;
  return new;
end;
$$;

-- 트리거 전용 함수 → REST RPC 호출 차단
revoke execute on function public.set_comment_author_from_auth() from public, anon, authenticated;

drop trigger if exists comments_set_author on public.comments;
create trigger comments_set_author
  before insert on public.comments
  for each row execute function public.set_comment_author_from_auth();

-- RLS
alter table public.comments enable row level security;

drop policy if exists "comments_select_all" on public.comments;
create policy "comments_select_all"
on public.comments for select
to anon, authenticated
using (true);

drop policy if exists "comments_insert_anonymous" on public.comments;
create policy "comments_insert_anonymous"
on public.comments for insert
to anon
with check (
  user_id is null
  and author_name is not null
  and char_length(trim(author_name)) between 1 and 40
  and char_length(body) between 1 and 2000
  and coalesce(honeypot, '') = ''
  and author_avatar_url is null
);

drop policy if exists "comments_insert_authenticated" on public.comments;
create policy "comments_insert_authenticated"
on public.comments for insert
to authenticated
with check (
  user_id = auth.uid()
  and char_length(body) between 1 and 2000
  and coalesce(honeypot, '') = ''
);

drop policy if exists "comments_delete_own_or_admin" on public.comments;
create policy "comments_delete_own_or_admin"
on public.comments for delete
to authenticated
using (
  user_id = auth.uid()
  or (auth.jwt() ->> 'email') = 'iamjms4237@gmail.com'
);
