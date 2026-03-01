interface Review {
  countryCode: string;
  date: Date;
  review: string;
  isFirstRow: boolean;
}

export function ReviewCard({ countryCode, date, review, isFirstRow }: Review) {
  return (
    <div
      className={`w-full py-5 flex flex-col gap-2 overflow-hidden group shrink-0 ${
        isFirstRow ? 'border-y' : 'border-b'
      }`}
    >
      <div className="flex items-center gap-1.5">
        <img
          src={`https://hatscripts.github.io/circle-flags/flags/${countryCode.toLowerCase()}.svg`}
          className="w-[18px] h-[18px]"
          alt={countryCode}
        />
        <small className="text-xs">
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
          })}
        </small>
      </div>
      <p>{review}</p>
    </div>
  );
}
