-- 댓글 시스템 확장: 답글(parent_id, depth=2) + author_role + role 기반 admin

-- 1) 컬럼 추가
alter table public.comments
  add column if not exists parent_id uuid references public.comments(id) on delete cascade,
  add column if not exists author_role text check (author_role in ('owner'));

-- 2) 인덱스
create index if not exists comments_parent_id_idx
  on public.comments (parent_id);

create index if not exists comments_slug_toplevel_idx
  on public.comments (slug, created_at asc)
  where parent_id is null;

-- 3) Depth 강제 트리거 (답글의 답글 차단)
create or replace function public.enforce_comment_depth()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  parent_parent uuid;
begin
  if new.parent_id is not null then
    select parent_id into parent_parent
    from public.comments
    where id = new.parent_id;

    if parent_parent is not null then
      raise exception 'replies cannot have replies (max depth=2)';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists comments_enforce_depth on public.comments;
create trigger comments_enforce_depth
  before insert on public.comments
  for each row execute function public.enforce_comment_depth();

-- 4) 작성자 메타데이터 트리거 갱신: author_role도 함께 stamp
create or replace function public.set_comment_author_from_auth()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb;
  app_meta jsonb;
  user_email text;
begin
  if new.user_id is not null then
    select raw_user_meta_data, raw_app_meta_data, email
      into meta, app_meta, user_email
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
    new.author_role := app_meta->>'role';
  else
    new.author_role := null;
  end if;
  return new;
end;
$$;

revoke execute on function public.set_comment_author_from_auth() from public, anon, authenticated;

-- 5) DELETE RLS: 이메일 하드코딩 → role 기반
drop policy if exists "comments_delete_own_or_admin" on public.comments;
drop policy if exists "comments_delete_own_or_role" on public.comments;
create policy "comments_delete_own_or_role"
on public.comments for delete
to authenticated
using (
  user_id = auth.uid()
  or (auth.jwt() -> 'app_metadata' ->> 'role') = 'owner'
);
