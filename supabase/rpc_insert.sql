-- FUNCTION: ingest_knowledge
-- PURPOSE: Allow authorized agents/scripts to ingest data bypassing strict RLS (via Security Definer)
-- SECURITY: This runs with the privileges of the creator (postgres/admin).
create or replace function ingest_knowledge(
        content text,
        metadata jsonb,
        embedding vector(768)
    ) returns void language plpgsql security definer as $$ begin
insert into public.knowledge_base (content, metadata, embedding)
values (content, metadata, embedding);
end;
$$;