-- New enum values only. Postgres requires ADD VALUE to commit before the
-- new value can be referenced by any other statement — so this file does
-- nothing else. Statements that use these values live in later migrations.

alter type application_status add value 'shortlisted';
alter type contract_status add value 'terminated';
alter type milestone_status add value 'disputed';
