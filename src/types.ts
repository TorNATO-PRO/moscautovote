type Session = Readonly<{
  event: string,
  entries: Array<VoteEntry>,
}>;

type VoteEntry = Readonly<{
  owner: string,
  make: string,
  model: string,
  year: number,
  category: string,
  votes: number,
}>;