-- FUNCTION: match_knowledge (Secure Version)
-- PURPOSE: Allow matching against knowledge base even if no user session is active (e.g. Test Scripts)
create or replace function match_knowledge (
        query_embedding vector(768),
        match_threshold float,
        match_count int
    ) returns table (
        id bigint,
        content text,
        metadata jsonb,
        similarity float
    ) language plpgsql security definer as $$ begin return query
select kb.id,
    kb.content,
    kb.metadata,
    1 - (kb.embedding <=> query_embedding) as similarity
from knowledge_base kb
where 1 - (kb.embedding <=> query_embedding) > match_threshold
order by similarity desc
limit match_count;
end;
$$;
-- FUNCTION: match_valuations (Secure Version)
create or replace function match_valuations (
        query_embedding vector(768),
        match_threshold float,
        match_count int
    ) returns table (
        id bigint,
        solicitud_id bigint,
        summary_text text,
        valuation_price numeric,
        metadata jsonb,
        similarity float
    ) language plpgsql security definer as $$ begin return query
select vm.id,
    vm.solicitud_id,
    vm.summary_text,
    vm.valuation_price,
    vm.metadata,
    1 - (vm.embedding <=> query_embedding) as similarity
from valuation_memory vm
where 1 - (vm.embedding <=> query_embedding) > match_threshold
order by similarity desc
limit match_count;
end;
$$;