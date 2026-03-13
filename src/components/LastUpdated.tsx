interface LastUpdatedProps {
  date: Date | null | undefined;
  loading?: boolean;
}

const LastUpdated = ({ date, loading }: LastUpdatedProps) => {
  if (!date && !loading) return null;

  return (
    <div className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-warning animate-pulse' : 'bg-success animate-pulse'}`} />
      {loading ? (
        <span>Updating...</span>
      ) : date ? (
        <span>
          Updated {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </span>
      ) : null}
    </div>
  );
};

export default LastUpdated;
